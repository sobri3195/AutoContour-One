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

  const inputClassName =
    'mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200'

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl space-y-5">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">AutoContour-One</h1>
          <p className="text-slate-600">
            AI Auto-Contouring Target + OAR untuk mempercepat perencanaan IMRT/VMAT.
          </p>
        </header>

        <form
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Patient ID
              <input
                className={inputClassName}
                name="patient_id"
                value={form.patient_id}
                onChange={handleChange}
                required
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Lokasi
              <select className={inputClassName} name="site" value={form.site} onChange={handleChange}>
                <option>H&N</option>
                <option>prostat</option>
                <option>paru</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Teknik RT
              <select
                className={inputClassName}
                name="technique"
                value={form.technique}
                onChange={handleChange}
              >
                <option>IMRT</option>
                <option>VMAT</option>
              </select>
            </label>

            <button
              className="w-full rounded-lg bg-sky-500 px-4 py-2.5 font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Jalankan Auto-Contouring'}
            </button>
          </div>
        </form>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        {result && (
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
            <h2 className="text-xl font-semibold">Ringkasan Hasil</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-slate-700">
              <li>
                <strong>Waktu dibuat:</strong> {new Date(result.generated_at).toLocaleString()}
              </li>
              <li>
                <strong>Struktur:</strong> {result.structures.join(', ')}
              </li>
              <li>
                <strong>DSC:</strong> {result.dsc}
              </li>
              <li>
                <strong>HD95:</strong> {result.hd95_mm} mm
              </li>
              <li>
                <strong>Estimasi hemat waktu:</strong> {result.estimated_minutes_saved} menit
              </li>
            </ul>
            <p className="mt-3 text-slate-700">{result.recommendation}</p>
          </section>
        )}
      </div>
    </main>
  )
}
