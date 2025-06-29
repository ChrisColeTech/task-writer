import { DatabaseService } from '../services/DatabaseService'
import fs from 'fs-extra'
import path from 'path'
import os from 'os'

// Test database setup
const TEST_DB_DIR = path.join(__dirname, '../../test-data')
const MOCK_DIR = path.join(os.tmpdir(), 'task-writer-test')

beforeAll(async () => {
  // Ensure test data directory exists
  await fs.ensureDir(TEST_DB_DIR)
})

afterAll(async () => {
  // Clean up test data directory
  await fs.remove(TEST_DB_DIR)
})

// Helper to create test database
export const createTestDatabase = (): DatabaseService => {
  const testDbPath = path.join(TEST_DB_DIR, `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.db`)
  return new DatabaseService(path.dirname(testDbPath))
}

// Helper to clean up test database
export const cleanupTestDatabase = (db: DatabaseService): void => {
  db.close()
}

// Mock data generators
export const mockSettings = {
  theme: { key: 'theme', value: 'dark', type: 'string' as const, category: 'appearance' as const },
  sidebarPosition: { key: 'sidebarPosition', value: 'left', type: 'string' as const, category: 'appearance' as const },
  maxFiles: { key: 'maxFiles', value: '1000', type: 'number' as const, category: 'behavior' as const }
}

export const mockFolders = {
  inputFolder: {
    path: '/test/input/project',
    name: 'Test Project',
    type: 'input' as const,
    projectType: 'react',
    favorite: false
  },
  outputFolder: {
    path: '/test/output',
    name: 'Output Folder',
    type: 'output' as const,
    favorite: true
  }
}

export const mockProjects = {
  reactProject: {
    name: 'React App',
    inputPath: '/test/react-app',
    outputPath: '/test/react-output',
    settings: { framework: 'react', typescript: true },
    description: 'A React TypeScript project'
  },
  nodeProject: {
    name: 'Node API',
    inputPath: '/test/node-api',
    settings: { framework: 'express', database: 'postgresql' }
  }
}

// Helper to create mock directory structure for testing
export const createMockDirectoryStructure = (): string => {
  const testDir = path.join(MOCK_DIR, `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  fs.ensureDirSync(testDir)
  return testDir
}

// Helper to clean up mock directory
export const cleanupMockDirectory = (testDir: string): void => {
  if (fs.existsSync(testDir)) {
    fs.removeSync(testDir)
  }
}

// Dummy test to satisfy Jest requirement
describe('Test Setup', () => {
  it('should export helper functions', () => {
    expect(createTestDatabase).toBeDefined();
    expect(cleanupTestDatabase).toBeDefined();
    expect(mockSettings).toBeDefined();
    expect(createMockDirectoryStructure).toBeDefined();
    expect(cleanupMockDirectory).toBeDefined();
  });
});