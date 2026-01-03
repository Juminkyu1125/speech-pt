import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const navigate = useNavigate()

  const prettySize = useMemo(() => {
    if (!file) return ""
    const mb = file.size / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }, [file])

  const handleUpload = async () => {
    if (!file) return
    setIsUploading(true)

    try {
      const form = new FormData()
      form.append("audio", file)

      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: form,
      })

      const data = await res.json()
      navigate(`/processing/${data.task_id}`)
    } catch (e) {
      alert("업로드 실패, 백엔드 켜져있는지 확인해봐")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 className="h1">SpeechPT</h1>
          <div className="sub">PPT, CV 기반 발표 음성 코칭, 업로드부터 결과 리포트까지</div>
        </div>

        <div className="badge">
          <span className="dot" />
          <span>Dev, mock analyze 연결</span>
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="cardBody">
          <div style={{ fontSize: 16, fontWeight: 700 }}>음성 업로드</div>
          <div className="sub">wav, mp3 추천, 30초 이상이면 분석 품질이 좋아짐</div>

          <div className="drop">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 650 }}>파일 선택</div>
                <div className="small">audio, only</div>
              </div>

              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="fileLine">
              {file ? (
                <>
                  선택됨, <b style={{ color: "var(--text)" }}>{file.name}</b>, {prettySize}
                </>
              ) : (
                "아직 선택된 파일 없음"
              )}
            </div>

            <div className="row" style={{ marginTop: 14 }}>
              <button className="btn" onClick={handleUpload} disabled={!file || isUploading}>
                {isUploading ? "업로드중" : "분석 시작"}
              </button>

              <button className="btn" style={{ borderColor: "var(--border)", background: "rgba(148,163,184,.08)" }}
                onClick={() => setFile(null)}
                disabled={!file || isUploading}
              >
                선택 해제
              </button>
            </div>
          </div>

          <div className="small" style={{ marginTop: 12 }}>
            다음 단계, processing 페이지에서 status 폴링 후 result 화면으로 이동, speed, pitch 차트 렌더링
          </div>
        </div>
      </div>
    </div>
  )
}