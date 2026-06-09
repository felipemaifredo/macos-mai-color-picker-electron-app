//Libs
import { desktopCapturer, screen } from "electron"

//Types
type CaptureResult = {
  imgDataUrl: string
  bounds: {
    x: number
    y: number
    width: number
    height: number
  }
  initialCursor: {
    x: number
    y: number
  }
}

//Funcs
export async function captureActiveScreen(): Promise<CaptureResult> {
  let cursorPoint = screen.getCursorScreenPoint()
  let activeDisplay = screen.getDisplayNearestPoint(cursorPoint)
  let { bounds, scaleFactor } = activeDisplay

  let width = Math.round(bounds.width * scaleFactor)
  let height = Math.round(bounds.height * scaleFactor)

  let sources = await desktopCapturer.getSources({
    types: ["screen"],
    thumbnailSize: { width, height }
  })

  let matchedSource = sources.find((s) => s.display_id === activeDisplay.id.toString())
  if (!matchedSource) {
    let displays = screen.getAllDisplays()
    let displayIndex = displays.findIndex((d) => d.id === activeDisplay.id)
    matchedSource = sources[displayIndex] || sources[0]
  }

  if (!matchedSource) {
    throw new Error("Não foi possível encontrar uma fonte de captura de tela.")
  }

  let initialCursor = {
    x: cursorPoint.x - bounds.x,
    y: cursorPoint.y - bounds.y
  }

  return {
    imgDataUrl: matchedSource.thumbnail.toDataURL(),
    bounds: {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height
    },
    initialCursor
  }
}
