//Libs
import {
  app,
  BrowserWindow,
  ipcMain,
  clipboard,
  shell,
  systemPreferences,
  Notification,
  Tray,
  Menu,
  nativeImage
} from "electron"
import { join } from "path"
import * as fs from "fs"

//Imports
import { registerGlobalShortcut, unregisterAllShortcuts } from "./shortcuts"
import { captureActiveScreen } from "./screenCapture"

//Types
import { ColorHistoryItem } from "../renderer/types"

// Set application name
app.setName("Color Picker")

//Consts
let HISTORY_FILE_PATH = ""

//Funcs
function readHistoryFromFile(): ColorHistoryItem[] {
  try {
    if (fs.existsSync(HISTORY_FILE_PATH)) {
      let data = fs.readFileSync(HISTORY_FILE_PATH, "utf-8")
      return JSON.parse(data) as ColorHistoryItem[]
    }
  } catch (error) {
    console.error("Erro ao ler histórico:", error)
  }
  return []
}

function saveHistoryToFile(history: ColorHistoryItem[]): void {
  try {
    fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify(history, null, 2), "utf-8")
  } catch (error) {
    console.error("Erro ao salvar histórico:", error)
  }
}

let historyWindow: BrowserWindow | null = null
let pickerWindow: BrowserWindow | null = null
let lastCapture: {
  imgDataUrl: string
  bounds: { x: number; y: number; width: number; height: number }
  initialCursor: { x: number; y: number }
} | null = null
let tray: Tray | null = null

function createHistoryWindow(): void {
  let win = new BrowserWindow({
    title: "Color Picker",
    width: 360,
    height: 580,
    minWidth: 360,
    maxWidth: 360,
    minHeight: 580,
    maxHeight: 580,
    show: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 12, y: 12 },
    transparent: true,
    webPreferences: {
      preload: join(__dirname, "../preload/preload.js"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  historyWindow = win

  win.on("ready-to-show", () => {
    win.show()
  })

  win.on("closed", () => {
    historyWindow = null
  })

  let devUrl = process.env["ELECTRON_RENDERER_URL"]
  if (devUrl) {
    win.loadURL(`${devUrl}?page=history`)
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"), { query: { page: "history" } })
  }
}

function showHistoryWindow(): void {
  if (historyWindow) {
    if (historyWindow.isMinimized()) {
      historyWindow.restore()
    }
    historyWindow.show()
    historyWindow.focus()
  } else {
    createHistoryWindow()
  }
}

function createTray(): void {
  let iconPath = app.isPackaged
    ? join(process.resourcesPath, "resources/icon.png")
    : join(__dirname, "../../resources/icon.png")

  try {
    let icon = nativeImage.createFromPath(iconPath)
    let trayIcon = icon.resize({ width: 16, height: 16 })

    if (process.platform === "darwin") {
      trayIcon.setTemplateImage(true)
    }

    tray = new Tray(trayIcon)
    tray.setToolTip("Color Picker")

    let contextMenu = Menu.buildFromTemplate([
      {
        label: "Abrir Histórico",
        click: function () {
          showHistoryWindow()
        }
      },
      {
        label: "Capturar Cor",
        click: function () {
          startColorPicker()
        }
      },
      { type: "separator" },
      {
        label: "Sair",
        click: function () {
          app.quit()
        }
      }
    ])

    tray.setContextMenu(contextMenu)

    tray.on("click", function () {
      showHistoryWindow()
    })
  } catch (error) {
    console.error("Falha ao criar o ícone da bandeja:", error)
  }
}

async function startColorPicker(): Promise<void> {
  let status = systemPreferences.getMediaAccessStatus("screen")
  if (status !== "granted") {
    if (historyWindow) {
      historyWindow.show()
      historyWindow.webContents.send("permission-status-changed", false)
    }
    return
  }

  if (historyWindow) {
    historyWindow.hide()
  }

  try {
    await new Promise(function (resolve) {
      setTimeout(resolve, 150)
    })

    let capture = await captureActiveScreen()
    lastCapture = capture

    if (pickerWindow) {
      pickerWindow.removeAllListeners("closed")
      pickerWindow.close()
      pickerWindow = null
    }

    let win = new BrowserWindow({
      x: capture.bounds.x,
      y: capture.bounds.y,
      width: capture.bounds.width,
      height: capture.bounds.height,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      enableLargerThanScreen: true,
      skipTaskbar: true,
      hasShadow: false,
      movable: false,
      resizable: false,
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      webPreferences: {
        preload: join(__dirname, "../preload/preload.js"),
        sandbox: false,
        contextIsolation: true,
        nodeIntegration: false
      }
    })

    pickerWindow = win
    win.setAlwaysOnTop(true, "screen-saver")
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

    win.once("ready-to-show", () => {
      win.show()
      win.focus()
      win.webContents.send("screen-captured", capture.imgDataUrl)
    })

    win.on("closed", () => {
      pickerWindow = null
      lastCapture = null
      if (historyWindow) {
        historyWindow.show()
      }
    })

    let devUrl = process.env["ELECTRON_RENDERER_URL"]
    if (devUrl) {
      win.loadURL(`${devUrl}?page=picker`)
    } else {
      win.loadFile(join(__dirname, "../renderer/index.html"), { query: { page: "picker" } })
    }
  } catch (error) {
    console.error("Falha ao iniciar o Color Picker:", error)
    if (historyWindow) {
      historyWindow.show()
    }
  }
}

function setupIpcHandlers(): void {
  ipcMain.on("start-picker", () => {
    startColorPicker()
  })

  ipcMain.handle("get-screen-capture", () => {
    return lastCapture
  })

  ipcMain.handle("get-history", () => {
    return readHistoryFromFile()
  })

  ipcMain.handle("remove-history-item", (_event, timestamp: number) => {
    let history = readHistoryFromFile()
    let updated = history.filter((item) => item.timestamp !== timestamp)
    saveHistoryToFile(updated)
    if (historyWindow) {
      historyWindow.webContents.send("history-updated", updated)
    }
    return updated
  })

  ipcMain.handle("clear-history", () => {
    let empty: ColorHistoryItem[] = []
    saveHistoryToFile(empty)
    if (historyWindow) {
      historyWindow.webContents.send("history-updated", empty)
    }
    return empty
  })

  ipcMain.handle("check-permission", () => {
    return systemPreferences.getMediaAccessStatus("screen") === "granted"
  })

  ipcMain.on("open-settings", () => {
    shell.openExternal(
      "x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture"
    )
  })

  ipcMain.on("copy-to-clipboard", (_event, text: string) => {
    clipboard.writeText(text)
  })

  ipcMain.on(
    "select-color",
    (
      _event,
      color: { hex: string; rgb: string; hsl: string; hsv: string; selectedFormatText?: string }
    ) => {
      let textToCopy = color.selectedFormatText || color.hex
      clipboard.writeText(textToCopy)

      let history = readHistoryFromFile()
      let newItem: ColorHistoryItem = {
        hex: color.hex,
        rgb: color.rgb,
        hsl: color.hsl,
        hsv: color.hsv,
        timestamp: Date.now()
      }

      let updated = [newItem, ...history].slice(0, 20)
      saveHistoryToFile(updated)

      if (historyWindow) {
        historyWindow.webContents.send("history-updated", updated)
      }

      if (pickerWindow) {
        pickerWindow.close()
      }

      new Notification({
        title: "Cor Copiada!",
        body: `${textToCopy} copiado para a área de transferência.`,
        silent: true
      }).show()
    }
  )

  ipcMain.on("cancel-selection", () => {
    if (pickerWindow) {
      pickerWindow.close()
    }
  })
}

//Main
app.whenReady().then(function () {
  HISTORY_FILE_PATH = join(app.getPath("userData"), "history.json")
  setupIpcHandlers()
  createTray()
  createHistoryWindow()

  registerGlobalShortcut("CommandOrControl+Shift+C", function () {
    startColorPicker()
  })

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createHistoryWindow()
    }
  })
})

app.on("window-all-closed", () => {
  // Keep the app running in the system tray / status bar
})

app.on("will-quit", () => {
  unregisterAllShortcuts()
})
