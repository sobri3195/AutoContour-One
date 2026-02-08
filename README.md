# AutoContour-One

**Judul:** *AutoContour-One: AI Auto-Contouring Target dan OAR untuk Mengurangi Waktu Perencanaan RT*  
**Author:** dr. Muhammad Sobri Maulana

## Ringkasan Protokol (PICO)
- **P (Population):** Pasien H&N / prostat / paru kandidat IMRT/VMAT.
- **I (Intervention):** Auto-contouring berbasis AI untuk CTV/PTV + OAR.
- **C (Comparator):** Contouring manual oleh dokter radiasi.
- **O (Outcomes):**
  - Waktu contouring (primer)
  - Dice Similarity Coefficient (DSC)
  - Hausdorff Distance 95% (HD95)
  - Variasi antar-dokter
  - Jumlah revisi plan
  - Kualitas DVH

**Desain studi disarankan:** Prospektif non-inferiority.

---

## Arsitektur Aplikasi
Proyek ini berisi:
1. **Backend Python (FastAPI)**: endpoint API untuk simulasi AI auto-contouring.
2. **Frontend React (Vite)**: antarmuka untuk input kasus pasien dan menampilkan output metrik.

```
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
│   └── index.html
└── README.md
```

## Menjalankan Backend (Python)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Endpoint utama:
- `GET /health`
- `POST /autocontour`

Contoh body JSON `POST /autocontour`:
```json
{
  "patient_id": "HNP001",
  "site": "H&N",
  "technique": "VMAT"
}
```

## Menjalankan Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

Buka: `http://localhost:5173`

> Pastikan backend berjalan di `http://localhost:8000`.

## Catatan Pengembangan
- Implementasi saat ini adalah **prototype/mock model** untuk demonstrasi alur studi.
- Untuk produksi, ganti fungsi inferensi pada backend dengan model segmentasi AI yang tervalidasi klinis.
- Tambahkan integrasi DICOM RTSTRUCT, pipeline QA, dan audit log untuk penggunaan klinis.
