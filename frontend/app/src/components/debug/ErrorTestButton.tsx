import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useErrorHandler } from '@/hooks/useErrorHandler'

/**
 * Simple button to test error banner functionality
 * Can be temporarily added anywhere for testing
 */
export const ErrorTestButton: React.FC = () => {
  const { handleError } = useErrorHandler()

  const testError = () => {
    handleError({
      title: 'Test Error',
      message: 'This is a test error message to verify the error banner is working correctly.',
      type: 'warning',
      persistence: 'persistent'
    })
  }

  return (
    <Button
      onClick={testError}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <AlertTriangle className="w-4 h-4" />
      Test Error Banner
    </Button>
  )
}

export default ErrorTestButton