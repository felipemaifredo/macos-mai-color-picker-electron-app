//Libs
import { useState, useEffect, useRef } from "react"

//Imports
import { rgbToHex, rgbToHsl, rgbToHsv } from "../../../Lib/Utils/color"
import styles from "./Picker.module.css"

//Types
type ColorInfo = {
  hex: string
  rgb: string
  hsl: string
  hsv: string
}

//Main
function Picker(): React.JSX.Element {
  let [color, setColor] = useState<ColorInfo>({
    hex: "#000000",
    rgb: "rgb(0, 0, 0)",
    hsl: "hsl(0, 0%, 0%)",
    hsv: "hsv(0, 0%, 0%)"
  })

  let [activeFormat, setActiveFormat] = useState<"hex" | "rgb" | "hsl" | "hsv">("hex")
  let [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  let [toast, setToast] = useState<{ show: boolean; text: string }>({ show: false, text: "" })
  let [isImageLoaded, setIsImageLoaded] = useState<boolean>(false)

  let bgCanvasRef = useRef<HTMLCanvasElement | null>(null)
  let magCanvasRef = useRef<HTMLCanvasElement | null>(null)
  let imageRef = useRef<HTMLImageElement | null>(null)
  let offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null)

  // Override body styles to allow window transparency
  useEffect(function() {
    let originalBg = document.body.style.background
    let originalBgImg = document.body.style.backgroundImage
    let originalDisplay = document.body.style.display
    let originalAlignItems = document.body.style.alignItems
    let originalJustifyContent = document.body.style.justifyContent

    document.body.style.background = "transparent"
    document.body.style.backgroundImage = "none"
    document.body.style.display = "block"
    document.body.style.alignItems = "stretch"
    document.body.style.justifyContent = "stretch"

    return function() {
      document.body.style.background = originalBg
      document.body.style.backgroundImage = originalBgImg
      document.body.style.display = originalDisplay
      document.body.style.alignItems = originalAlignItems
      document.body.style.justifyContent = originalJustifyContent
    }
  }, [])

  // Load screen capture on start
  useEffect(function() {
    let handleCapture = function(imgDataUrl: string) {
      let img = new Image()
      img.src = imgDataUrl
      img.onload = function() {
        imageRef.current = img
        setIsImageLoaded(true)

        // Draw static background screenshot
        let bgCanvas = bgCanvasRef.current
        if (bgCanvas) {
          bgCanvas.width = window.innerWidth
          bgCanvas.height = window.innerHeight
          let ctx = bgCanvas.getContext("2d")
          if (ctx) {
            ctx.drawImage(img, 0, 0, window.innerWidth, window.innerHeight)
            // Apply slight dark overlay
            ctx.fillStyle = "rgba(15, 15, 20, 0.4)"
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
          }
        }

        // Draw offscreen canvas for exact pixel values
        let offCanvas = document.createElement("canvas")
        offCanvas.width = img.width
        offCanvas.height = img.height
        let offCtx = offCanvas.getContext("2d")
        if (offCtx) {
          offCtx.drawImage(img, 0, 0)
        }
        offscreenCanvasRef.current = offCanvas
      }
    }

    window.api.onScreenCaptured(handleCapture)
  }, [])

  // Listen to keyboard shortcuts
  useEffect(function() {
    let handleKeyDown = function(event: KeyboardEvent) {
      if (event.key === "Escape") {
        window.api.cancelSelection()
      } else if (event.key === "Tab") {
        event.preventDefault()
        setActiveFormat(function(prev) {
          if (prev === "hex") return "rgb"
          if (prev === "rgb") return "hsl"
          if (prev === "hsl") return "hsv"
          return "hex"
        })
      } else if (event.key === "Enter") {
        event.preventDefault()
        let textToCopy = ""
        if (activeFormat === "hex") textToCopy = color.hex
        else if (activeFormat === "rgb") textToCopy = color.rgb
        else if (activeFormat === "hsl") textToCopy = color.hsl
        else if (activeFormat === "hsv") textToCopy = color.hsv

        // Direct clipboard copy & notify main process
        window.api.copyToClipboard(textToCopy)
        
        setToast({ show: true, text: textToCopy })
        setTimeout(function() {
          window.api.selectColor({
            hex: color.hex,
            rgb: color.rgb,
            hsl: color.hsl,
            hsv: color.hsv,
            selectedFormatText: textToCopy
          } as any)
        }, 800)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return function() {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [color, activeFormat])

  let handleMouseMove = function(event: React.MouseEvent<HTMLDivElement>) {
    let mouseX = event.clientX
    let mouseY = event.clientY
    setMousePos({ x: mouseX, y: mouseY })

    let img = imageRef.current
    let offCanvas = offscreenCanvasRef.current
    if (!img || !offCanvas) return

    let offCtx = offCanvas.getContext("2d", { willReadFrequently: true })
    if (!offCtx) return

    // Map logical mouse coordinates to physical image coordinates
    let scaleX = img.width / window.innerWidth
    let scaleY = img.height / window.innerHeight
    let physicalX = Math.round(mouseX * scaleX)
    let physicalY = Math.round(mouseY * scaleY)

    // Clamp coordinates to image boundaries
    physicalX = Math.max(0, Math.min(img.width - 1, physicalX))
    physicalY = Math.max(0, Math.min(img.height - 1, physicalY))

    // Read colors from the offscreen physical resolution canvas
    try {
      let pixelData = offCtx.getImageData(physicalX, physicalY, 1, 1).data
      let r = pixelData[0]
      let g = pixelData[1]
      let b = pixelData[2]

      let hexVal = rgbToHex(r, g, b)
      let hslVal = rgbToHsl(r, g, b)
      let hsvVal = rgbToHsv(r, g, b)

      let newColor: ColorInfo = {
        hex: hexVal,
        rgb: `rgb(${r}, ${g}, ${b})`,
        hsl: `hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`,
        hsv: `hsv(${hsvVal.h}, ${hsvVal.s}%, ${hsvVal.v}%)`
      }
      setColor(newColor)

      // Draw the magnifier canvas
      let magCanvas = magCanvasRef.current
      if (magCanvas) {
        let magCtx = magCanvas.getContext("2d")
        if (magCtx) {
          let zoomFactor = 13 // Zoom multiplier
          let gridPixels = 9 // Grid is 9x9 physical pixels
          let totalSize = gridPixels * zoomFactor // 117px

          magCanvas.width = totalSize
          magCanvas.height = totalSize

          magCtx.imageSmoothingEnabled = false
          
          // Clear and draw background
          magCtx.fillStyle = "#000000"
          magCtx.fillRect(0, 0, totalSize, totalSize)

          // Draw slice of image centered around the cursor
          let srcX = physicalX - Math.floor(gridPixels / 2)
          let srcY = physicalY - Math.floor(gridPixels / 2)

          magCtx.drawImage(
            offCanvas,
            srcX,
            srcY,
            gridPixels,
            gridPixels,
            0,
            0,
            totalSize,
            totalSize
          )

          // Draw Grid overlay
          magCtx.strokeStyle = "rgba(255, 255, 255, 0.15)"
          magCtx.lineWidth = 1
          for (let i = 0; i <= gridPixels; i++) {
            // Vertical line
            magCtx.beginPath()
            magCtx.moveTo(i * zoomFactor, 0)
            magCtx.lineTo(i * zoomFactor, totalSize)
            magCtx.stroke()

            // Horizontal line
            magCtx.beginPath()
            magCtx.moveTo(0, i * zoomFactor)
            magCtx.lineTo(totalSize, i * zoomFactor)
            magCtx.stroke()
          }

          // Highlight Central Pixel
          let centerIndex = Math.floor(gridPixels / 2)
          magCtx.strokeStyle = "#00f0ff"
          magCtx.lineWidth = 1.5
          magCtx.strokeRect(
            centerIndex * zoomFactor,
            centerIndex * zoomFactor,
            zoomFactor,
            zoomFactor
          )
        }
      }
    } catch (e) {
      console.error("Erro ao ler pixels:", e)
    }
  }

  let handleSelectColor = function() {
    // Click action copies HEX and closes
    window.api.copyToClipboard(color.hex)
    setToast({ show: true, text: color.hex })
    setTimeout(function() {
      window.api.selectColor({
        hex: color.hex,
        rgb: color.rgb,
        hsl: color.hsl,
        hsv: color.hsv
      })
    }, 800)
  }

  // Adjust widget position to avoid off-screen overflow
  let widgetStyle: React.CSSProperties = {}
  let widgetOffset = 20
  let widgetWidth = 190
  let widgetHeight = 270

  if (mousePos.x > window.innerWidth - widgetWidth - widgetOffset) {
    widgetStyle.left = mousePos.x - widgetWidth / 2 - widgetOffset - 40
  } else {
    widgetStyle.left = mousePos.x + widgetWidth / 2 + widgetOffset + 40
  }

  if (mousePos.y > window.innerHeight - widgetHeight / 2 - widgetOffset) {
    widgetStyle.top = window.innerHeight - widgetHeight / 2 - widgetOffset
  } else if (mousePos.y < widgetHeight / 2 + widgetOffset) {
    widgetStyle.top = widgetHeight / 2 + widgetOffset
  } else {
    widgetStyle.top = mousePos.y
  }

  return (
    <div
      className={styles.container}
      onMouseMove={handleMouseMove}
      onClick={handleSelectColor}
    >
      <canvas ref={bgCanvasRef} className={styles.backgroundCanvas} />

      {isImageLoaded && (
        <div
          className={styles.floatingWidget}
          style={{
            left: widgetStyle.left,
            top: widgetStyle.top
          }}
        >
          <div className={styles.magnifierRing}>
            <canvas ref={magCanvasRef} className={styles.magnifierCanvas} />
            <div className={styles.centerReticle} />
          </div>

          <div className={styles.infoCard}>
            <div className={`${styles.colorRow} ${activeFormat === "hex" ? styles.active : ""}`}>
              <span className={styles.formatLabel}>Hex</span>
              <span className={styles.colorValue}>{color.hex}</span>
            </div>
            <div className={styles.divider} />
            <div className={`${styles.colorRow} ${activeFormat === "rgb" ? styles.active : ""}`}>
              <span className={styles.formatLabel}>Rgb</span>
              <span className={styles.colorValue}>{color.rgb}</span>
            </div>
            <div className={styles.divider} />
            <div className={`${styles.colorRow} ${activeFormat === "hsl" ? styles.active : ""}`}>
              <span className={styles.formatLabel}>Hsl</span>
              <span className={styles.colorValue}>{color.hsl}</span>
            </div>
            <div className={styles.divider} />
            <div className={`${styles.colorRow} ${activeFormat === "hsv" ? styles.active : ""}`}>
              <span className={styles.formatLabel}>Hsv</span>
              <span className={styles.colorValue}>{color.hsv}</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.tips}>
              TAB: Mudar formato<br />
              ENTER / CLIQUE: Copiar
            </div>
          </div>
        </div>
      )}

      <div className={`${styles.toast} ${toast.show ? styles.show : ""}`}>
        <span className={styles.toastTitle}>Cor Copiada!</span>
        <span className={styles.toastBody}>{toast.text}</span>
      </div>
    </div>
  )
}

export default Picker
