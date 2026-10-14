import { useEffect, useRef, useState } from 'react'
import adminApi from '../api/adminApi'
import Modal from './Modal'
import Spinner from './Spinner'
import { ErrorAlert } from './Feedback'

const fields = [
  { name: 'fullName', label: 'Full Name', type: 'text', minLength: 2, maxLength: 100 },
  { name: 'email', label: 'Email', type: 'email', minLength: 5, maxLength: 150 },
  { name: 'mobileNumber', label: 'Mobile Number', type: 'tel', pattern: '[6-9][0-9]{9}', maxLength: 10, title: 'Enter a valid 10-digit Indian mobile number' },
  { name: 'city', label: 'City', type: 'text', minLength: 2, maxLength: 100 },
  { name: 'dob', label: 'Date of Birth', type: 'date' },
]
const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

export default function EditInfluencerModal({ influencerId, onClose, onSaved }) {
  const [original, setOriginal] = useState(null)
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const submitting = useRef(false)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        const { data } = await adminApi.getInfluencer(influencerId)
        const values = Object.fromEntries([...fields.map(field => field.name), 'gender'].map(name => [name, data.data[name] ?? '']))
        if (active) { setOriginal(values); setForm(values) }
      } catch (err) {
        if (active) setError(err.response?.data?.message || 'Failed to load influencer')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [influencerId, attempt])

  const close = () => { if (!submitting.current) onClose() }
  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }))
  const yesterday = new Date()
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)

  async function save(event) {
    event.preventDefault()
    if (submitting.current || !form) return
    setError('')
    const values = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]))
    values.email = values.email.toLowerCase()
    for (const field of fields) {
      if (!values[field.name] || (field.minLength && values[field.name].length < field.minLength)) {
        setError(`${field.label} must contain${field.minLength ? ` at least ${field.minLength} characters` : ' a value'}.`)
        return
      }
    }
    const changes = Object.fromEntries(Object.entries(values).filter(([key, value]) => value !== original[key]))
    if (!Object.keys(changes).length) { onClose(); return }
    submitting.current = true
    setSaving(true)
    try {
      await adminApi.updateInfluencer(influencerId, changes)
      onSaved()
    } catch (err) {
      const response = err.response
      const missingRoute = response?.status === 404 && typeof response.data === 'string' && response.data.includes('Cannot PUT')
      setError(missingRoute
        ? 'The connected server does not support influencer updates yet. Deploy the latest backend changes and try again.'
        : response?.data?.message || 'Failed to update influencer. Please try again.')
    } finally {
      submitting.current = false
      setSaving(false)
    }
  }

  return (
    <Modal open onClose={close} title="Edit Influencer">
      {loading ? <Spinner /> : (
        <>
          <ErrorAlert message={error} onRetry={!form ? () => setAttempt(value => value + 1) : undefined} />
          {form && (
            <form onSubmit={save} className="space-y-4">
              <fieldset disabled={saving} className="grid grid-cols-1 sm:grid-cols-2 gap-4 disabled:opacity-60">
                {fields.map(({ name, label, ...attributes }) => (
                  <label key={name} className="block space-y-1 text-sm font-medium text-gray-700">
                    <span>{label}</span>
                    <input {...attributes} name={name} required value={form[name]} onChange={change}
                      max={name === 'dob' ? yesterday.toISOString().slice(0, 10) : undefined} className={inputClass} />
                  </label>
                ))}
                <label className="block space-y-1 text-sm font-medium text-gray-700">
                  <span>Gender</span>
                  <select name="gender" value={form.gender} onChange={change} className={inputClass}>
                    <option value="" disabled>Select gender</option>
                    {['Male', 'Female', 'Other'].map(value => <option key={value} value={value}>{value}</option>)}
                  </select>
                </label>
              </fieldset>
              <div className="flex justify-end gap-3">
                <button type="button" disabled={saving} onClick={close} className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50">{saving ? 'Saving…' : 'Save Changes'}</button>
              </div>
            </form>
          )}
        </>
      )}
    </Modal>
  )
}
