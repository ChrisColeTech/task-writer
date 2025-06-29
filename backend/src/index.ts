import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { fileSystemRoutes } from './routes/fileSystem'
import { taskGeneratorRoutes } from './routes/taskGenerator'
import { scaffoldGeneratorRoutes } from './routes/scaffoldGenerator'
import { databaseRoutes } from './routes/database'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:5173', 'http://localhost:4173'] // Vite dev and preview
    : true, // Allow all origins in development
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  })
})

// API routes
app.use('/api/filesystem', fileSystemRoutes)
app.use('/api/task-generator', taskGeneratorRoutes)
app.use('/api/scaffold-generator', scaffoldGeneratorRoutes)
app.use('/api/database', databaseRoutes)

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Task Writer Backend running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app