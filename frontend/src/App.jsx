import { useState } from 'react'

const API_BASE_URL = 'http://localhost:8000'

export default function App() {
  const tabs = [
    { key: 'form', label: 'Formulir', icon: '📝' },
    { key: 'hasil', label: 'Hasil', icon: '📊' },
    { key: 'tentang', label: 'Tentang', icon: 'ℹ️' },
  ]

  const [form, setForm] = useState({
    patient_id: 'HNP001',
    site: 'H&N',
    technique: 'VMAT',
  })
  const [activeTab, setActiveTab] = useState('form')
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
      setActiveTab('hasil')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClassName =
    'mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200'

  const renderTabContent = () => {
    if (activeTab === 'form') {
      return (
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
      )
    }

    if (activeTab === 'hasil') {
      return (
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
          <h2 className="text-xl font-semibold">Ringkasan Hasil</h2>
          {result ? (
            <>
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
            </>
          ) : (
            <p className="mt-3 text-slate-600">
              Belum ada hasil. Jalankan auto-contouring dari tab Formulir.
            </p>
          )}
        </section>
      )
    }

    return (
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
        <h2 className="text-xl font-semibold">Tentang Aplikasi</h2>
        <p className="mt-3 text-slate-700">
          AutoContour-One membantu menyiapkan kontur target + OAR lebih cepat untuk workflow IMRT/VMAT.
        </p>
        <p className="mt-2 text-slate-700">
          Gunakan tab Formulir untuk menjalankan proses, lalu cek kualitas output di tab Hasil.
        </p>
      </section>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 md:py-8">
      <div className="mx-auto max-w-3xl space-y-5 pb-24 md:pb-0">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">AutoContour-One</h1>
          <p className="text-slate-600">
            AI Auto-Contouring Target + OAR untuk mempercepat perencanaan IMRT/VMAT.
          </p>
        </header>

        <nav className="hidden rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200/70 md:flex">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-sky-500 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </nav>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        {renderTabContent()}
      </div>

      <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-col items-center justify-center rounded-xl px-2 py-2 text-xs font-medium transition ${
                  isActive ? 'bg-sky-500 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-base leading-none">{tab.icon}</span>
                <span className="mt-1">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </main>
  )
}
