"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { UploadCertificate } from "../components/institution/UploadCertificate"
import { CertificateDashboard } from "../components/institution/CertificateDashboard"
import { Button } from "../components/common/Button"

export const Institution = () => {
  const [activeTab, setActiveTab] = useState<"upload" | "dashboard">("upload")
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button variant="secondary" onClick={() => navigate("/")}>
          ← Back
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-8">Institution Portal</h1>

      <div className="mb-6 flex gap-4">
        <Button variant={activeTab === "upload" ? "primary" : "secondary"} onClick={() => setActiveTab("upload")}>
          Upload Certificate
        </Button>
        <Button variant={activeTab === "dashboard" ? "primary" : "secondary"} onClick={() => setActiveTab("dashboard")}>
          View Dashboard
        </Button>
      </div>

      {activeTab === "upload" ? <UploadCertificate /> : <CertificateDashboard />}
    </div>
  )
}
