import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs-extra'
import { v4 as uuidv4 } from 'uuid'

export interface AppSettings {
  id: string
  key: string
  value: string
  type: 'string' | 'number' | 'boolean' | 'json'
  category: 'general' | 'appearance' | 'behavior' | 'advanced'
  updatedAt: Date
}

export interface RecentFolder {
  id: string
  path: string
  name: string
  type: 'input' | 'output' | 'both'
  lastUsed: Date
  useCount: number
  favorite: boolean
  projectType?: string
}

export interface RecentProject {
  id: string
  name: string
  inputPath: string
  outputPath?: string
  lastOpened: Date
  settings: Record<string, any>
  description?: string
}

export class DatabaseService {
  private db: Database.Database
  private dbPath: string

  constructor(dataDirectory?: string) {
    // Default to user data directory, or provided directory
    const baseDir = dataDirectory || path.join(process.cwd(), 'data')
    fs.ensureDirSync(baseDir)
    
    this.dbPath = path.join(baseDir, 'task-writer.db')
    this.db = new Database(this.dbPath)
    
    // Enable WAL mode for better performance
    this.db.pragma('journal_mode = WAL')
    this.db.pragma('synchronous = NORMAL')
    this.db.pragma('cache_size = 1000')
    
    this.initializeTables()
    this.seedDefaultSettings()
  }

  /**
   * Initialize database tables
   */
  private initializeTables(): void {
    // App Settings table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS app_settings (
        id TEXT PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        type TEXT CHECK(type IN ('string', 'number', 'boolean', 'json')) DEFAULT 'string',
        category TEXT CHECK(category IN ('general', 'appearance', 'behavior', 'advanced')) DEFAULT 'general',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Recent Folders table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS recent_folders (
        id TEXT PRIMARY KEY,
        path TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        type TEXT CHECK(type IN ('input', 'output', 'both')) DEFAULT 'input',
        last_used DATETIME DEFAULT CURRENT_TIMESTAMP,
        use_count INTEGER DEFAULT 1,
        favorite BOOLEAN DEFAULT FALSE,
        project_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Recent Projects table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS recent_projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        input_path TEXT NOT NULL,
        output_path TEXT,
        last_opened DATETIME DEFAULT CURRENT_TIMESTAMP,
        settings TEXT, -- JSON string
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes for performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_settings_category ON app_settings(category);
      CREATE INDEX IF NOT EXISTS idx_folders_last_used ON recent_folders(last_used DESC);
      CREATE INDEX IF NOT EXISTS idx_folders_favorite ON recent_folders(favorite);
      CREATE INDEX IF NOT EXISTS idx_projects_last_opened ON recent_projects(last_opened DESC);
    `)
  }

  /**
   * Seed default application settings
   */
  private seedDefaultSettings(): void {
    const defaultSettings = [
      { key: 'theme', value: 'system', category: 'appearance' },
      { key: 'sidebarPosition', value: 'left', category: 'appearance' },
      { key: 'showStatusBar', value: 'true', type: 'boolean', category: 'appearance' },
      { key: 'maxRecentFolders', value: '10', type: 'number', category: 'behavior' },
      { key: 'maxRecentProjects', value: '15', type: 'number', category: 'behavior' },
      { key: 'autoScanOnSelect', value: 'true', type: 'boolean', category: 'behavior' },
      { key: 'maxFileSizeBytes', value: '1048576', type: 'number', category: 'advanced' }, // 1MB
      { key: 'maxScanDepth', value: '10', type: 'number', category: 'advanced' }
    ]

    const insertSetting = this.db.prepare(`
      INSERT OR IGNORE INTO app_settings (id, key, value, type, category)
      VALUES (?, ?, ?, ?, ?)
    `)

    for (const setting of defaultSettings) {
      insertSetting.run(
        uuidv4(),
        setting.key,
        setting.value,
        setting.type || 'string',
        setting.category
      )
    }
  }

  // ==================== SETTINGS METHODS ====================

  /**
   * Get all settings or by category
   */
  getSettings(category?: string): AppSettings[] {
    const query = category 
      ? this.db.prepare('SELECT * FROM app_settings WHERE category = ? ORDER BY key')
      : this.db.prepare('SELECT * FROM app_settings ORDER BY category, key')
    
    const rows = category ? query.all(category) : query.all()
    
    return rows.map(this.mapSettingsRow)
  }

  /**
   * Get single setting by key
   */
  getSetting(key: string): AppSettings | null {
    const row = this.db.prepare('SELECT * FROM app_settings WHERE key = ?').get(key)
    return row ? this.mapSettingsRow(row) : null
  }

  /**
   * Set setting value
   */
  setSetting(key: string, value: any, type?: AppSettings['type'], category?: AppSettings['category']): void {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
    
    this.db.prepare(`
      INSERT OR REPLACE INTO app_settings (id, key, value, type, category, updated_at)
      VALUES (
        COALESCE((SELECT id FROM app_settings WHERE key = ?), ?),
        ?, ?, 
        COALESCE(?, (SELECT type FROM app_settings WHERE key = ?), 'string'),
        COALESCE(?, (SELECT category FROM app_settings WHERE key = ?), 'general'),
        CURRENT_TIMESTAMP
      )
    `).run(key, uuidv4(), key, stringValue, type, key, category, key)
  }

  /**
   * Delete setting
   */
  deleteSetting(key: string): boolean {
    const result = this.db.prepare('DELETE FROM app_settings WHERE key = ?').run(key)
    return result.changes > 0
  }

  // ==================== RECENT FOLDERS METHODS ====================

  /**
   * Get recent folders
   */
  getRecentFolders(limit = 10, type?: RecentFolder['type']): RecentFolder[] {
    const query = type
      ? this.db.prepare('SELECT * FROM recent_folders WHERE type = ? OR type = "both" ORDER BY last_used DESC LIMIT ?')
      : this.db.prepare('SELECT * FROM recent_folders ORDER BY last_used DESC LIMIT ?')
    
    const rows = type ? query.all(type, limit) : query.all(limit)
    return rows.map(this.mapFolderRow)
  }

  /**
   * Get favorite folders
   */
  getFavoriteFolders(): RecentFolder[] {
    const rows = this.db.prepare('SELECT * FROM recent_folders WHERE favorite = TRUE ORDER BY name').all()
    return rows.map(this.mapFolderRow)
  }

  /**
   * Add or update recent folder
   */
  addRecentFolder(folderData: Omit<RecentFolder, 'id' | 'lastUsed' | 'useCount'>): void {
    const existing = this.db.prepare('SELECT id, use_count FROM recent_folders WHERE path = ?').get(folderData.path)
    
    if (existing) {
      // Update existing folder
      this.db.prepare(`
        UPDATE recent_folders 
        SET name = ?, type = ?, last_used = CURRENT_TIMESTAMP, use_count = use_count + 1, project_type = ?
        WHERE path = ?
      `).run(folderData.name, folderData.type, folderData.projectType, folderData.path)
    } else {
      // Insert new folder
      this.db.prepare(`
        INSERT INTO recent_folders (id, path, name, type, project_type, favorite)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(uuidv4(), folderData.path, folderData.name, folderData.type, folderData.projectType, folderData.favorite)
      
      // Clean up old entries (keep only maxRecentFolders)
      const maxFolders = this.getSetting('maxRecentFolders')
      const limit = maxFolders ? parseInt(maxFolders.value) : 10
      
      this.db.prepare(`
        DELETE FROM recent_folders 
        WHERE id NOT IN (
          SELECT id FROM recent_folders 
          WHERE favorite = FALSE
          ORDER BY last_used DESC 
          LIMIT ?
        ) AND favorite = FALSE
      `).run(limit)
    }
  }

  /**
   * Toggle folder favorite status
   */
  toggleFavoriteFolder(path: string): boolean {
    const result = this.db.prepare(`
      UPDATE recent_folders 
      SET favorite = NOT favorite 
      WHERE path = ?
    `).run(path)
    
    if (result.changes > 0) {
      const folder = this.db.prepare('SELECT favorite FROM recent_folders WHERE path = ?').get(path) as { favorite: number } | undefined
      return folder?.favorite === 1
    }
    return false
  }

  /**
   * Remove recent folder
   */
  removeRecentFolder(path: string): boolean {
    const result = this.db.prepare('DELETE FROM recent_folders WHERE path = ?').run(path)
    return result.changes > 0
  }

  // ==================== RECENT PROJECTS METHODS ====================

  /**
   * Get recent projects
   */
  getRecentProjects(limit = 15): RecentProject[] {
    const rows = this.db.prepare('SELECT * FROM recent_projects ORDER BY last_opened DESC LIMIT ?').all(limit)
    return rows.map(this.mapProjectRow)
  }

  /**
   * Add or update recent project
   */
  addRecentProject(projectData: Omit<RecentProject, 'id' | 'lastOpened'>): void {
    const existing = this.db.prepare('SELECT id FROM recent_projects WHERE input_path = ?').get(projectData.inputPath)
    
    if (existing) {
      // Update existing project
      this.db.prepare(`
        UPDATE recent_projects 
        SET name = ?, output_path = ?, last_opened = CURRENT_TIMESTAMP, settings = ?, description = ?
        WHERE input_path = ?
      `).run(
        projectData.name,
        projectData.outputPath,
        JSON.stringify(projectData.settings),
        projectData.description,
        projectData.inputPath
      )
    } else {
      // Insert new project
      this.db.prepare(`
        INSERT INTO recent_projects (id, name, input_path, output_path, settings, description)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        uuidv4(),
        projectData.name,
        projectData.inputPath,
        projectData.outputPath,
        JSON.stringify(projectData.settings),
        projectData.description
      )
      
      // Clean up old entries
      const maxProjects = this.getSetting('maxRecentProjects')
      const limit = maxProjects ? parseInt(maxProjects.value) : 15
      
      this.db.prepare(`
        DELETE FROM recent_projects 
        WHERE id NOT IN (
          SELECT id FROM recent_projects 
          ORDER BY last_opened DESC 
          LIMIT ?
        )
      `).run(limit)
    }
  }

  /**
   * Remove recent project
   */
  removeRecentProject(inputPath: string): boolean {
    const result = this.db.prepare('DELETE FROM recent_projects WHERE input_path = ?').run(inputPath)
    return result.changes > 0
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get database stats
   */
  getStats(): { settings: number; recentFolders: number; recentProjects: number } {
    const settingsCount = this.db.prepare('SELECT COUNT(*) as count FROM app_settings').get() as { count: number }
    const foldersCount = this.db.prepare('SELECT COUNT(*) as count FROM recent_folders').get() as { count: number }
    const projectsCount = this.db.prepare('SELECT COUNT(*) as count FROM recent_projects').get() as { count: number }
    
    return {
      settings: settingsCount.count,
      recentFolders: foldersCount.count,
      recentProjects: projectsCount.count
    }
  }

  /**
   * Clear all data (for reset)
   */
  clearAllData(): void {
    this.db.exec('DELETE FROM recent_folders')
    this.db.exec('DELETE FROM recent_projects')
    // Keep settings but reset to defaults
    this.db.exec('DELETE FROM app_settings')
    this.seedDefaultSettings()
  }

  /**
   * Close database connection
   */
  close(): void {
    this.db.close()
  }

  // ==================== PRIVATE MAPPING METHODS ====================

  private mapSettingsRow(row: any): AppSettings {
    return {
      id: row.id,
      key: row.key,
      value: row.value,
      type: row.type,
      category: row.category,
      updatedAt: new Date(row.updated_at)
    }
  }

  private mapFolderRow(row: any): RecentFolder {
    return {
      id: row.id,
      path: row.path,
      name: row.name,
      type: row.type,
      lastUsed: new Date(row.last_used),
      useCount: row.use_count,
      favorite: row.favorite === 1,
      projectType: row.project_type
    }
  }

  private mapProjectRow(row: any): RecentProject {
    return {
      id: row.id,
      name: row.name,
      inputPath: row.input_path,
      outputPath: row.output_path,
      lastOpened: new Date(row.last_opened),
      settings: row.settings ? JSON.parse(row.settings) : {},
      description: row.description
    }
  }
}