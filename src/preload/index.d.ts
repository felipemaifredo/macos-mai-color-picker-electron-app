//Libs
import { ElectronAPI } from "@electron-toolkit/preload"

//Imports
import { ColorHistoryItem } from "../renderer/types"

//Types
export type WindowApi = {
  onScreenCaptured: (callback: (imgDataUrl: string) => void) => void
  selectColor: (color: { hex: string; rgb: string; hsl: string; hsv: string }) => void
  cancelSelection: () => void
  copyToClipboard: (text: string) => void
  getHistory: () => Promise<ColorHistoryItem[]>
  removeHistoryItem: (timestamp: number) => Promise<ColorHistoryItem[]>
  clearHistory: () => Promise<ColorHistoryItem[]>
  checkScreenRecordingPermission: () => Promise<boolean>
  openSystemSettings: () => void
  onHistoryUpdated: (callback: (history: ColorHistoryItem[]) => void) => void
  onPermissionStatusChanged: (callback: (granted: boolean) => void) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: WindowApi
  }
}

