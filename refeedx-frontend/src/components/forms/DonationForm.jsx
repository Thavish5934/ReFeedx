import { useState } from 'react'
import { toInputDateTimeValue } from '../../utils/formatDate'
import ErrorMessage from '../common/ErrorMessage'

const CATEGORIES = ['VEG', 'NON_VEG', 'BAKERY', 'GROCERY', 'OTHER']

const emptyValues = {
  foodName: '',
  category: 'VEG',
  quantity: '',
  servings: '',
  preparedAt: '',
  expiryAt: '',
  description: '',
  location: '',
  contactPhone: '',
}

export default function DonationForm({ initialValues, onSubmit, onCancel, submitLabel = 'Post Donation' }) {
  const [form, setForm] = useState(() => ({
    ...emptyValues,
    ...initialValues,
    preparedAt: toInputDateTimeValue(initialValues?.preparedAt),
    expiryAt: toInputDateTimeValue(initialValues?.expiryAt),
  }))
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await onSubmit({ ...form, servings: Number(form.servings) })
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save this donation. Please check the form.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="foodName">Food name</label>
          <input id="foodName" name="foodName" required className="input" value={form.foodName} onChange={handleChange} />
        </div>
        <div>
          <label className="label" htmlFor="category">Category</label>
          <select id="category" name="category" className="input" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.replace('_', '-')}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            name="quantity"
            required
            placeholder="e.g. 10 kg, 30 plates"
            className="input"
            value={form.quantity}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label" htmlFor="servings">Serves how many people</label>
          <input
            id="servings"
            name="servings"
            type="number"
            min={1}
            required
            className="input"
            value={form.servings}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="preparedAt">Prepared at</label>
          <input
            id="preparedAt"
            name="preparedAt"
            type="datetime-local"
            required
            className="input"
            value={form.preparedAt}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label" htmlFor="expiryAt">Expires at</label>
          <input
            id="expiryAt"
            name="expiryAt"
            type="datetime-local"
            required
            className="input"
            value={form.expiryAt}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="input resize-none"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="location">Pickup location</label>
          <input id="location" name="location" required className="input" value={form.location} onChange={handleChange} />
        </div>
        <div>
          <label className="label" htmlFor="contactPhone">Contact phone</label>
          <input
            id="contactPhone"
            name="contactPhone"
            required
            className="input"
            value={form.contactPhone}
            onChange={handleChange}
          />
        </div>
      </div>

      <ErrorMessage message={error} />

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-outline">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
