import { useState } from 'react'

const API_BASE_URL = 'http://localhost:8000'

export default function App() {
  const [form, setForm] = useState({
    patient_id: 'HNP001',
    site: 'H&N',
    technique: 'VMAT',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/autocontour`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('Gagal mengambil hasil auto-contour.')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container">
      <h1>AutoContour-One</h1>
      <p className="subtitle">
        AI Auto-Contouring Target + OAR untuk mempercepat perencanaan IMRT/VMAT.
      </p>

      <form className="card" onSubmit={handleSubmit}>
        <label>
          Patient ID
          <input name="patient_id" value={form.patient_id} onChange={handleChange} required />
        </label>

        <label>
          Lokasi
          <select name="site" value={form.site} onChange={handleChange}>
            <option>H&N</option>
            <option>prostat</option>
            <option>paru</option>
          </select>
        </label>

        <label>
          Teknik RT
          <select name="technique" value={form.technique} onChange={handleChange}>
            <option>IMRT</option>
            <option>VMAT</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Memproses...' : 'Jalankan Auto-Contouring'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <section className="card result">
          <h2>Ringkasan Hasil</h2>
          <ul>
            <li><strong>Waktu dibuat:</strong> {new Date(result.generated_at).toLocaleString()}</li>
            <li><strong>Struktur:</strong> {result.structures.join(', ')}</li>
            <li><strong>DSC:</strong> {result.dsc}</li>
            <li><strong>HD95:</strong> {result.hd95_mm} mm</li>
            <li><strong>Estimasi hemat waktu:</strong> {result.estimated_minutes_saved} menit</li>
          </ul>
          <p>{result.recommendation}</p>
        </section>
      )}
    </main>
  )
}
