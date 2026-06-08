//Libs
import { contextBridge, ipcRenderer } from "electron"
import { electronAPI } from "@electron-toolkit/preload"

//Imports
import { ColorHistoryItem } from "../renderer/types"

//Funcs
function onScreenCaptured(callback: (imgDataUrl: string) => void): void {
  let handler = (_event: any, imgDataUrl: string) => callback(imgDataUrl)
  ipcRenderer.on("screen-captured", handler)
}

function selectColor(color: { hex: string; rgb: string; hsl: string; hsv: string }): void {
  ipcRenderer.send("select-color", color)
}

function cancelSelection(): void {
  ipcRenderer.send("cancel-selection")
}

function copyToClipboard(text: string): void {
  ipcRenderer.send("copy-to-clipboard", text)
}

function getHistory(): Promise<any> {
  return ipcRenderer.invoke("get-history")
}

function removeHistoryItem(timestamp: number): Promise<any> {
  return ipcRenderer.invoke("remove-history-item", timestamp)
}

function clearHistory(): Promise<any> {
  return ipcRenderer.invoke("clear-history")
}

function checkScreenRecordingPermission(): Promise<boolean> {
  return ipcRenderer.invoke("check-permission")
}

function openSystemSettings(): void {
  ipcRenderer.send("open-settings")
}

function onHistoryUpdated(callback: (history: ColorHistoryItem[]) => void): void {
  let handler = function(_event: any, history: ColorHistoryItem[]) {
    callback(history)
  }
  ipcRenderer.on("history-updated", handler)
}

function onPermissionStatusChanged(callback: (granted: boolean) => void): void {
  let handler = function(_event: any, granted: boolean) {
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
      selectColor,
      cancelSelection,
      copyToClipboard,
      getHistory,
      removeHistoryItem,
      clearHistory,
      checkScreenRecordingPermission,
      openSystemSettings,
      onHistoryUpdated,
      onPermissionStatusChanged
    })
  } catch (error) {
    console.error(error)
  }
} else {
  let anyWindow = window as any
  anyWindow.electron = electronAPI
  anyWindow.api = {
    onScreenCaptured,
    selectColor,
    cancelSelection,
    copyToClipboard,
    getHistory,
    removeHistoryItem,
    clearHistory,
    checkScreenRecordingPermission,
    openSystemSettings,
    onHistoryUpdated,
    onPermissionStatusChanged
  }
}
