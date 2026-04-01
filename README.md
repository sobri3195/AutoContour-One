# AutoContour-One

![License](https://img.shields.io/badge/license-MIT-green)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB)
![Status](https://img.shields.io/badge/status-Prototype-orange)

> **AutoContour-One** adalah prototipe aplikasi AI Auto-Contouring untuk membantu proses kontur **target** dan **Organ at Risk (OAR)** pada workflow radioterapi **IMRT/VMAT**, sehingga proses perencanaan terapi menjadi lebih cepat dan terstruktur.

---

## 📌 Daftar Isi
- [Gambaran Umum](#-gambaran-umum)
- [Fitur Utama](#-fitur-utama)
- [Analisis Kodebase (Mendalam)](#-analisis-kodebase-mendalam)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Struktur Proyek](#-struktur-proyek)
- [Spesifikasi API](#-spesifikasi-api)
- [Cara Menjalankan Proyek](#-cara-menjalankan-proyek)
- [Contoh Penggunaan](#-contoh-penggunaan)
- [Roadmap Pengembangan](#-roadmap-pengembangan)
- [Kontribusi](#-kontribusi)
- [Author & Kontak](#-author--kontak)
- [Dukungan & Donasi](#-dukungan--donasi)

---

## 🔎 Gambaran Umum
Pada versi saat ini, AutoContour-One masih berupa **prototype/mock system** yang berfokus pada validasi alur kerja:
1. Input data kasus pasien dari frontend.
2. Request ke backend untuk simulasi auto-contouring.
3. Pengembalian metrik kualitas (DSC, HD95, estimasi waktu hemat) dan daftar struktur target/OAR.

Meskipun belum terhubung ke engine segmentasi AI klinis berbasis DICOM, fondasi software-nya sudah rapi untuk ditingkatkan ke tahap riset lanjut maupun integrasi produksi.

---

## 🚀 Fitur Utama
- **Input kasus pasien terstruktur** (patient_id, site, technique).
- **Simulasi auto-contouring** berdasarkan lokasi kanker (H&N, prostat, paru).
- **Keluaran metrik klinis inti**:
  - Dice Similarity Coefficient (DSC)
  - Hausdorff Distance 95% (HD95)
  - Estimasi penghematan waktu contouring
- **Daftar struktur anatomis otomatis** per lokasi kasus.
- **UI berbasis tab (Formulir, Hasil, Tentang)** yang responsif desktop/mobile.
- **Health-check endpoint** untuk monitoring service readiness.

---

## 🧠 Analisis Kodebase (Mendalam)

## 1) Backend (FastAPI)
File inti: `backend/app/main.py`

### a. Kontrak Data (Schema)
Backend menggunakan `Pydantic` untuk memastikan format input/output konsisten:
- `PatientCase`: validasi field input (`patient_id`, `site`, `technique`).
- `AutoContourResult`: model response standar berisi timestamp, struktur, metrik, dan rekomendasi klinis.

**Manfaat:**
- Mengurangi error integrasi frontend-backend.
- Memudahkan dokumentasi otomatis OpenAPI.

### b. Logika Domain (Mocked Clinical Heuristic)
- `SUPPORTED_SITES` menjadi peta struktur default per site.
- Nilai `dsc`, `hd95_mm`, dan `estimated_minutes_saved` dihasilkan melalui rule sederhana.

**Kelebihan desain saat ini:**
- Mudah dipahami dan cepat untuk demo/prototyping.
- Menyediakan placeholder yang jelas untuk diganti ke model inferensi nyata.

**Batasan:**
- Belum ada inferensi model AI sesungguhnya (UNet/nnUNet/transformer segmentation).
- Belum ada parsing DICOM-RT/RTSTRUCT.
- Belum ada pipeline QA klinis otomatis.

### c. Endpoint
- `GET /health` untuk health checking.
- `POST /autocontour` untuk simulasi hasil auto-contouring.

### d. Kesiapan Produksi
Agar siap klinis/produksi, backend perlu:
- Integrasi model segmentasi tervalidasi.
- Audit trail, logging, dan observability (Prometheus/Grafana/ELK).
- Validasi input yang lebih ketat (enum site/technique, anonymization enforcement).
- Versi API dan test suite yang komprehensif.

---

## 2) Frontend (React + Vite + Tailwind)
File inti: `frontend/src/App.jsx`

### a. Desain Interaksi
Aplikasi memakai pola **tabbed interface**:
- **Formulir**: input kasus.
- **Hasil**: visualisasi output response backend.
- **Tentang**: penjelasan singkat fungsi aplikasi.

### b. State Management
Menggunakan React `useState` untuk:
- `form` (payload)
- `activeTab` (navigasi)
- `result` (hasil API)
- `loading` dan `error` (UX feedback)

**Kelebihan:**
- Simpel, maintainable untuk skala kecil-menengah.
- Alur data mudah dilacak.

**Catatan peningkatan:**
- Untuk skala lebih besar: pertimbangkan React Query / Zustand.
- API base URL saat ini hardcoded (`http://localhost:8000`), lebih baik dipindahkan ke `.env` (`VITE_API_BASE_URL`).

### c. UX dan Responsivitas
- Desktop: top tabs.
- Mobile: bottom navigation.
- Visual style clean via Tailwind.

---

## 3) Integrasi Frontend-Backend
Alur request:
1. User submit form.
2. Frontend `fetch` ke `POST /autocontour`.
3. Response JSON dirender pada tab hasil.

Potensi peningkatan:
- Retry logic & timeout.
- Error boundary.
- Loading skeleton.
- Validasi input client-side lebih kaya.

---

## 4) Kualitas Engineering Saat Ini
**Yang sudah baik:**
- Struktur repo jelas (frontend/backend dipisah).
- Dependency modern dan umum digunakan.
- Kode ringkas, fokus pada MVP.

**Yang sebaiknya ditambah:**
- Unit test + integration test.
- CI/CD pipeline.
- Dockerfile + docker-compose.
- Dokumentasi API lebih detail + contoh multi-case.

---

## 🏗️ Arsitektur Sistem
```text
[React Frontend]
   └── Form Input (patient_id, site, technique)
         └── HTTP POST /autocontour
              └── [FastAPI Backend]
                    ├── Validasi schema (Pydantic)
                    ├── Mapping struktur berdasarkan site
                    ├── Simulasi metrik (DSC/HD95/waktu)
                    └── JSON response
         └── Render hasil pada tab "Hasil"
```

---

## 📁 Struktur Proyek
```bash
AutoContour-One/
├── backend/
│   ├── app/
│   │   └── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
└── README.md
```

---

## 🔌 Spesifikasi API
### 1) Health Check
`GET /health`

**Response:**
```json
{
  "status": "ok",
  "service": "AutoContour-One"
}
```

### 2) Auto-Contouring
`POST /autocontour`

**Request Body:**
```json
{
  "patient_id": "HNP001",
  "site": "H&N",
  "technique": "VMAT"
}
```

**Response Body (contoh):**
```json
{
  "generated_at": "2026-04-01T00:00:00.000000",
  "structures": ["CTV", "PTV", "Parotid_L", "Parotid_R", "SpinalCord"],
  "dsc": 0.89,
  "hd95_mm": 2.8,
  "estimated_minutes_saved": 35,
  "recommendation": "Hasil auto-contour layak review dokter radiasi; lakukan validasi DVH dan revisi minor bila perlu."
}
```

---

## ⚙️ Cara Menjalankan Proyek
## Prasyarat
- Python 3.10+
- Node.js 18+
- npm 9+

### Menjalankan Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Menjalankan Frontend
```bash
cd frontend
npm install
npm run dev
```

Akses aplikasi di: `http://localhost:5173`

---

## 🧪 Contoh Penggunaan (cURL)
```bash
curl -X POST http://localhost:8000/autocontour \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "HNP001",
    "site": "H&N",
    "technique": "VMAT"
  }'
```

---

## 🛣️ Roadmap Pengembangan
- [ ] Integrasi model segmentasi AI riil (3D medical segmentation).
- [ ] Dukungan import/export DICOM RTSTRUCT.
- [ ] Modul evaluasi plan (DVH constraints checker).
- [ ] User management + role-based access.
- [ ] Logging klinis dan audit compliance.
- [ ] Containerization (Docker/K8s).
- [ ] CI/CD + automated tests.

---

## 🤝 Kontribusi
Kontribusi sangat terbuka untuk:
- Pengembangan model AI segmentasi.
- Integrasi data pipeline radioterapi.
- Peningkatan UI/UX dan keamanan aplikasi.

Silakan fork, buat branch fitur, dan kirim pull request.

---

## 👤 Author & Kontak
- **GitHub:** https://github.com/sobri3195
- **Author:** **Lettu Kes dr. Muhammad Sobri Maulana, S.Kom, CEH, OSCP, OSCE**
- **Email:** muhammadsobrimaulana31@gmail.com
- **Website:** https://muhammadsobrimaulana.netlify.app
- **Portfolio/Personal Page:** https://muhammad-sobri-maulana-kvr6a.sevalla.page/
- **YouTube:** https://www.youtube.com/@muhammadsobrimaulana6013
- **Telegram:** https://t.me/winlin_exploit
- **TikTok:** https://www.tiktok.com/@dr.sobri
- **Grup WhatsApp:** https://chat.whatsapp.com/B8nwRZOBMo64GjTwdXV8Bl

---

## ❤️ Dukungan & Donasi
Jika project ini bermanfaat, dukungan Anda sangat berarti:

- Lynk: https://lynk.id/muhsobrimaulana
- Trakteer: https://trakteer.id/g9mkave5gauns962u07t
- KaryaKarsa: https://karyakarsa.com/muhammadsobrimaulana
- Nyawer: https://nyawer.co/MuhammadSobriMaulana
- Gumroad: https://maulanasobri.gumroad.com/
- Toko Online Sobri: https://pegasus-shop.netlify.app

Terima kasih atas dukungannya 🙏

---

## ⚠️ Disclaimer
Aplikasi ini adalah **prototype edukasi dan riset**. Bukan medical device tersertifikasi dan **tidak** boleh digunakan sebagai satu-satunya dasar keputusan klinis tanpa validasi institusional dan supervisi tenaga medis berwenang.
