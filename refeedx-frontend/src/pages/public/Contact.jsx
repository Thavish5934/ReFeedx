import { useState } from 'react'
import * as contactService from '../../services/contactService'
import ErrorMessage from '../../components/common/ErrorMessage'
import { getErrorMessage } from '../../utils/errorMessage'

const initialForm = { name: '', email: '', phone: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await contactService.submitContactMessage(form)
      setSubmitted(true)
      setForm(initialForm)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not send your message. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <p className="stamp text-marigold-dark border-marigold mb-4">Get in Touch</p>
      <h1 className="font-display text-3xl font-bold text-forest mb-2">Contact ReFeedX</h1>
      <p className="text-ink/60 mb-10">
        Question, feedback, or something that doesn’t look right? Send it our way.
      </p>

      {submitted ? (
        <div className="card text-center py-12">
          <h2 className="font-display text-xl font-bold text-forest mb-2">Message sent</h2>
          <p className="text-ink/60 mb-6">Thanks for reaching out — we’ll get back to you soon.</p>
          <button onClick={() => setSubmitted(false)} className="btn-outline">
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="name">Name</label>
              <input id="name" name="name" required className="input" value={form.name} onChange={handleChange} />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="phone">Phone (optional)</label>
            <input id="phone" name="phone" className="input" value={form.phone} onChange={handleChange} />
          </div>

          <div>
            <label className="label" htmlFor="subject">Subject</label>
            <input id="subject" name="subject" required className="input" value={form.subject} onChange={handleChange} />
          </div>

          <div>
            <label className="label" htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="input resize-none"
              value={form.message}
              onChange={handleChange}
            />
          </div>

          <ErrorMessage message={error} />

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </div>
  )
}
