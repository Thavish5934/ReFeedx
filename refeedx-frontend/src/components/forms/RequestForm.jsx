import { useState } from 'react'
import { toInputDateTimeValue } from '../../utils/formatDate'
import ErrorMessage from '../common/ErrorMessage'

const emptyValues = {
  foodType: '',
  quantity: '',
  peopleCount: '',
  requiredAt: '',
  description: '',
  location: '',
  contactPhone: '',
}

export default function RequestForm({ initialValues, onSubmit, onCancel, submitLabel = 'Post Request' }) {
  const [form, setForm] = useState(() => ({
    ...emptyValues,
    ...initialValues,
    requiredAt: toInputDateTimeValue(initialValues?.requiredAt),
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
      await onSubmit({ ...form, peopleCount: Number(form.peopleCount) })
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save this request. Please check the form.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="foodType">What food is needed</label>
          <input
            id="foodType"
            name="foodType"
            required
            placeholder="e.g. Vegetarian meals"
            className="input"
            value={form.foodType}
            onChange={handleChange}
          />
        </div>
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
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="peopleCount">Number of people</label>
          <input
            id="peopleCount"
            name="peopleCount"
            type="number"
            min={1}
            required
            className="input"
            value={form.peopleCount}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label" htmlFor="requiredAt">Needed by</label>
          <input
            id="requiredAt"
            name="requiredAt"
            type="datetime-local"
            required
            className="input"
            value={form.requiredAt}
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
          <label className="label" htmlFor="location">Location</label>
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
