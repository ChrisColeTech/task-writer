import React from 'react'
import { Button } from '@/components/ui/Button'
import { useErrorHandler } from '@/hooks/useErrorHandler'

/**
 * Demo component to test the error handling system
 * Can be temporarily added to any page for testing
 */
export const ErrorDemo: React.FC = () => {
  const { 
    handleError, 
    handleValidationError, 
    handleServerError, 
    handleNetworkError, 
    handleBrowserLimitation 
  } = useErrorHandler()

  return (
    <div className="p-4 bg-surface app-border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Error System Demo</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => handleError({
            title: 'Test Error',
            message: 'This is a test error message',
            type: 'error',
            persistence: 'persistent'
          })}
          variant="outline"
          size="sm"
        >
          Test Error
        </Button>

        <Button
          onClick={() => handleError({
            title: 'Test Warning',
            message: 'This is a test warning message',
            type: 'warning',
            persistence: 'persistent'
          })}
          variant="outline"
          size="sm"
        >
          Test Warning
        </Button>

        <Button
          onClick={() => handleValidationError('Email', 'Invalid email format')}
          variant="outline"
          size="sm"
        >
          Validation Error
        </Button>

        <Button
          onClick={() => handleServerError(
            { code: 500, message: 'Internal server error occurred' },
            'API Error'
          )}
          variant="outline"
          size="sm"
        >
          Server Error
        </Button>

        <Button
          onClick={() => handleNetworkError()}
          variant="outline"
          size="sm"
        >
          Network Error
        </Button>

        <Button
          onClick={() => handleBrowserLimitation(
            'File System Access',
            'Download the desktop app for full functionality.'
          )}
          variant="outline"
          size="sm"
        >
          Browser Limitation
        </Button>
      </div>
    </div>
  )
}

export default ErrorDemo