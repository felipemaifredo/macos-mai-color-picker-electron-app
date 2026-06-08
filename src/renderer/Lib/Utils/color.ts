//Types
export type RGB = {
  r: number
  g: number
  b: number
}

export type HSL = {
  h: number
  s: number
  l: number
}

export type HSV = {
  h: number
  s: number
  v: number
}

//Funcs
export function rgbToHex(r: number, g: number, b: number): string {
  let rHex = Math.max(0, Math.min(255, r)).toString(16).padStart(2, '0')
  let gHex = Math.max(0, Math.min(255, g)).toString(16).padStart(2, '0')
  let bHex = Math.max(0, Math.min(255, b)).toString(16).padStart(2, '0')
  return `#${rHex}${gHex}${bHex}`.toUpperCase()
}

export function hexToRgb(hex: string): RGB | null {
  let cleanHex = hex.replace(/^#/, '')

  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((char) => char + char)
      .join('')
  }

  if (cleanHex.length !== 6) {
    return null
  }

  let num = parseInt(cleanHex, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  }
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255
  g /= 255
  b /= 255

  let max = Math.max(r, g, b)
  let min = Math.min(r, g, b)
  let h = 0
  let s = 0
  let l = (max + min) / 2

  if (max !== min) {
    let d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

export function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255
  g /= 255
  b /= 255

  let max = Math.max(r, g, b)
  let min = Math.min(r, g, b)
  let h = 0
  let s = 0
  let v = max

  let d = max - min
  s = max === 0 ? 0 : d / max

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  }
}
