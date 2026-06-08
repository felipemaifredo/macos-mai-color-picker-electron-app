//Libs
import { useState, useEffect } from "react"

//Imports
import Picker from "../ui/Pages/Picker/Picker"
import History from "../ui/Pages/History/History"
import Permission from "../ui/Pages/Permission/Permission"

//Main
function App(): React.JSX.Element {
  let [page, setPage] = useState<string | null>(null)
  let [hasPermission, setHasPermission] = useState<boolean | null>(null)

  useEffect(function() {
    let params = new URLSearchParams(window.location.search)
    setPage(params.get("page"))

    // Check system permission on start
    window.api.checkScreenRecordingPermission().then(function(granted) {
      setHasPermission(granted)
    })

    // Listen to updates from system settings
    window.api.onPermissionStatusChanged(function(granted) {
      setHasPermission(granted)
    })
  }, [])

  if (page === "picker") {
    return <Picker />
  }

  if (page === "history") {
    if (hasPermission === null) {
      return (
        <div style={{ color: "#ffffff", padding: "24px", fontFamily: "-apple-system, sans-serif" }}>
          Verificando permissão...
        </div>
      )
    }

    if (!hasPermission) {
      return <Permission />
    }

    return <History />
  }

  return (
    <div style={{ color: "#ffffff", padding: "32px", fontFamily: "-apple-system, sans-serif", textAlign: "center" }}>
      <h1>macOS Color Picker</h1>
      <p style={{ color: "rgba(255, 255, 255, 0.6)" }}>Pressione CMD + SHIFT + C para iniciar o capturador.</p>
    </div>
  )
}

export default App
