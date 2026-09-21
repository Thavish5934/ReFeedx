import StatusBadge from '../common/StatusBadge'
import { formatDateTime } from '../../utils/formatDate'
import { buildMapLink } from '../../utils/mapLink'

export default function DonationCard({ donation, footer, selectable, selected, onSelect }) {
  const mapHref = buildMapLink(donation.location, donation.latitude, donation.longitude)

  return (
    <div
      className={`card flex flex-col gap-3 ${selectable ? 'cursor-pointer transition-shadow' : ''} ${
        selected ? 'ring-2 ring-leaf border-leaf' : ''
      }`}
      onClick={selectable ? () => onSelect?.(donation) : undefined}
      role={selectable ? 'button' : undefined}
      tabIndex={selectable ? 0 : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-leaf-dark font-semibold">{donation.category}</p>
          <h3 className="font-display text-lg font-bold text-forest">{donation.foodName}</h3>
        </div>
        <StatusBadge status={donation.status} />
      </div>

      {donation.description && <p className="text-sm text-ink/60 leading-relaxed">{donation.description}</p>}

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <dt className="text-ink/40 text-xs">Quantity</dt>
          <dd className="text-ink font-medium">{donation.quantity} · Serves {donation.servings}</dd>
        </div>
        <div>
          <dt className="text-ink/40 text-xs">Expires</dt>
          <dd className="text-ink font-medium">{formatDateTime(donation.expiryAt)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-ink/40 text-xs">Location</dt>
          <dd className="text-ink font-medium">{donation.location}</dd>
        </div>
      </dl>

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-forest-100">
        <div className="text-sm min-w-0">
          <p className="text-ink/40 text-xs">Donor</p>
          <p className="font-medium text-ink truncate">
            {donation.donor?.name} · {donation.donor?.phone}
          </p>
        </div>
        <a
          href={mapHref}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-semibold text-leaf hover:underline shrink-0"
        >
          Get Directions →
        </a>
      </div>

      {footer && (
        <div className="pt-3 border-t border-forest-100" onClick={(e) => e.stopPropagation()}>
          {footer}
        </div>
      )}
    </div>
  )
}
