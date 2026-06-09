//Libs
import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron"
import { electronAPI } from "@electron-toolkit/preload"

//Imports
import { ColorHistoryItem } from "../renderer/types"

//Types
type ScreenCaptureResult = {
  imgDataUrl: string
  bounds: { x: number; y: number; width: number; height: number }
  initialCursor: { x: number; y: number }
} | null

//Funcs
function onScreenCaptured(callback: (imgDataUrl: string) => void): void {
  function handler(_event: IpcRendererEvent, imgDataUrl: string): void {
    callback(imgDataUrl)
  }
  ipcRenderer.on("screen-captured", handler)
}

function getScreenCapture(): Promise<ScreenCaptureResult> {
  return ipcRenderer.invoke("get-screen-capture")
}

function selectColor(color: {
  hex: string
  rgb: string
  hsl: string
  hsv: string
  selectedFormatText?: string
}): void {
  ipcRenderer.send("select-color", color)
}

function cancelSelection(): void {
  ipcRenderer.send("cancel-selection")
}

function startPicker(): void {
  ipcRenderer.send("start-picker")
}

function copyToClipboard(text: string): void {
  ipcRenderer.send("copy-to-clipboard", text)
}

function getHistory(): Promise<ColorHistoryItem[]> {
  return ipcRenderer.invoke("get-history")
}

function removeHistoryItem(timestamp: number): Promise<ColorHistoryItem[]> {
  return ipcRenderer.invoke("remove-history-item", timestamp)
}

function clearHistory(): Promise<ColorHistoryItem[]> {
  return ipcRenderer.invoke("clear-history")
}

function checkScreenRecordingPermission(): Promise<boolean> {
  return ipcRenderer.invoke("check-permission")
}

function openSystemSettings(): void {
  ipcRenderer.send("open-settings")
}

function onHistoryUpdated(callback: (history: ColorHistoryItem[]) => void): void {
  function handler(_event: IpcRendererEvent, history: ColorHistoryItem[]): void {
    callback(history)
  }
  ipcRenderer.on("history-updated", handler)
}

function onPermissionStatusChanged(callback: (granted: boolean) => void): void {
  function handler(_event: IpcRendererEvent, granted: boolean): void {
    callback(granted)
  }
  ipcRenderer.on("permission-status-changed", handler)
}

//Main
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI)
    contextBridge.exposeInMainWorld("api", {
      onScreenCaptured,
      getScreenCapture,
      selectColor,
      cancelSelection,
      copyToClipboard,
      getHistory,
      removeHistoryItem,
      clearHistory,
      checkScreenRecordingPermission,
      openSystemSettings,
      onHistoryUpdated,
      onPermissionStatusChanged,
      startPicker
    })
  } catch (error) {
    console.error(error)
  }
} else {
  let unknownWindow = window as unknown as Record<string, unknown>
  unknownWindow.electron = electronAPI
  unknownWindow.api = {
    onScreenCaptured,
    getScreenCapture,
    selectColor,
    cancelSelection,
    copyToClipboard,
    getHistory,
    removeHistoryItem,
    clearHistory,
    checkScreenRecordingPermission,
    openSystemSettings,
    onHistoryUpdated,
    onPermissionStatusChanged,
    startPicker
  }
}
