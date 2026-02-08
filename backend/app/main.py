from __future__ import annotations

from datetime import datetime
from typing import List

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(
    title="AutoContour-One API",
    description="Prototype API untuk studi prospektif non-inferiority auto-contouring IMRT/VMAT.",
    version="0.1.0",
)


class PatientCase(BaseModel):
    patient_id: str = Field(..., description="ID pasien anonim")
    site: str = Field(..., description="Lokasi kanker: H&N, prostat, atau paru")
    technique: str = Field(..., description="Teknik RT: IMRT atau VMAT")


class AutoContourResult(BaseModel):
    generated_at: datetime
    structures: List[str]
    dsc: float
    hd95_mm: float
    estimated_minutes_saved: int
    recommendation: str


SUPPORTED_SITES = {
    "h&n": ["CTV", "PTV", "Parotid_L", "Parotid_R", "SpinalCord"],
    "prostat": ["CTV", "PTV", "Rectum", "Bladder", "FemoralHead_L", "FemoralHead_R"],
    "paru": ["CTV", "PTV", "Lung_L", "Lung_R", "Heart", "Esophagus"],
}


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "AutoContour-One"}


@app.post("/autocontour", response_model=AutoContourResult)
def autocontour(case: PatientCase) -> AutoContourResult:
    site_key = case.site.lower().strip()
    structures = SUPPORTED_SITES.get(site_key, ["CTV", "PTV", "OAR_Default"])

    # Mocked metrics for prototype/demo; replace with AI model inference in production.
    dsc = 0.89 if site_key == "h&n" else 0.91
    hd95_mm = 2.8 if site_key == "h&n" else 2.3
    estimated_minutes_saved = 35 if case.technique.upper() == "VMAT" else 28

    recommendation = (
        "Hasil auto-contour layak review dokter radiasi; lakukan validasi DVH dan revisi minor bila perlu."
    )

    return AutoContourResult(
        generated_at=datetime.utcnow(),
        structures=structures,
        dsc=dsc,
        hd95_mm=hd95_mm,
        estimated_minutes_saved=estimated_minutes_saved,
        recommendation=recommendation,
    )
