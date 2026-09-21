const STATUS_STYLES = {
  AVAILABLE: 'text-leaf-dark border-leaf',
  OPEN: 'text-leaf-dark border-leaf',
  RESERVED: 'text-marigold-dark border-marigold',
  MATCHED: 'text-marigold-dark border-marigold',
  PENDING: 'text-marigold-dark border-marigold',
  IN_PROGRESS: 'text-marigold-dark border-marigold',
  COLLECTED: 'text-forest-600 border-forest-400',
  COMPLETED: 'text-forest border-forest',
  FULFILLED: 'text-forest border-forest',
  RESOLVED: 'text-leaf-dark border-leaf',
  CLOSED: 'text-ink/50 border-ink/25',
  EXPIRED: 'text-tomato-dark border-tomato',
  CANCELLED: 'text-tomato-dark border-tomato',
  UNREAD: 'text-tomato-dark border-tomato',
  READ: 'text-marigold-dark border-marigold',
}

/**
 * ReFeedX's signature element - every status in the product (donation,
 * request, match, message) is rendered as an inked stamp rather than a
 * generic colored pill, since the whole platform is really just stamping
 * food's journey from AVAILABLE to someone's table.
 */
export default function StatusBadge({ status }) {
  const styles = STATUS_STYLES[status] || 'text-ink/50 border-ink/25'
  return <span className={`stamp ${styles}`}>{status?.replaceAll('_', ' ')}</span>
}
