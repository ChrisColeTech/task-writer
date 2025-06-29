import { motion, useReducedMotion } from 'framer-motion'
import { getPageIcon, getNavigationItem } from '../../config/navigationConfig'

interface PageHeaderProps {
  pageId: string
  title?: string
  description?: string
  subtitle?: string
  children?: React.ReactNode
  centered?: boolean
}

/**
 * PageHeader component that follows style guide standards
 * This component provides a fallback header for cases where
 * a full style guide compliant header isn't implemented
 * 
 * Note: For new pages, prefer implementing the full style guide
 * header pattern directly in the page component
 */
const PageHeader = ({ 
  pageId, 
  title, 
  description, 
  subtitle,
  children, 
  centered = false 
}: PageHeaderProps) => {
  const navigationItem = getNavigationItem(pageId)
  const displayTitle = title || navigationItem?.label || pageId
  const prefersReducedMotion = useReducedMotion()

  const headerVariants = {
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.4 }
  }

  return (
    <motion.header
      {...headerVariants}
      className={centered ? 'text-center' : ''}
    >
      <div className="bg-surface app-border overflow-hidden mb-8 motion-reduce:transform-none hover:shadow-theme transition-shadow duration-300">
        <div className="bg-gradient-to-r from-surface to-background px-8 py-12">
          <div className={`flex items-center ${centered ? 'justify-center' : ''} mb-6`}>
            <div className="page-icon mr-4" role="img" aria-label={`${displayTitle} page icon`}>
              {getPageIcon(pageId, 'text-accent w-12 h-12')}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-text" id="page-title">
                {displayTitle}
              </h1>
              {subtitle && (
                <p className="text-lg text-text-muted mt-2" id="page-subtitle">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {description && (
            <p className="text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="app-border-t p-6">
            {children}
          </div>
        )}
      </div>
    </motion.header>
  )
}

export default PageHeader
