//Libs
import {
  app,
  BrowserWindow,
  ipcMain,
  clipboard,
  shell,
  systemPreferences,
  Notification
} from 'electron'
import { join } from 'path'
import * as fs from 'fs'

//Imports
import { registerGlobalShortcut, unregisterAllShortcuts } from './shortcuts'
import { captureActiveScreen } from './screenCapture'

//Types
import { ColorHistoryItem } from '../renderer/types'

//Consts
let HISTORY_FILE_PATH = ''

//Funcs
function readHistoryFromFile(): ColorHistoryItem[] {
  try {
    if (fs.existsSync(HISTORY_FILE_PATH)) {
      let data = fs.readFileSync(HISTORY_FILE_PATH, 'utf-8')
      return JSON.parse(data) as ColorHistoryItem[]
    }
  } catch (error) {
    console.error('Erro ao ler histórico:', error)
  }
  return []
}

function saveHistoryToFile(history: ColorHistoryItem[]): void {
  try {
    fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify(history, null, 2), 'utf-8')
  } catch (error) {
    console.error('Erro ao salvar histórico:', error)
  }
}

let historyWindow: BrowserWindow | null = null
let pickerWindow: BrowserWindow | null = null

function createHistoryWindow(): void {
  let win = new BrowserWindow({
    width: 360,
    height: 520,
    show: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 12, y: 12 },
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  historyWindow = win

  win.on('ready-to-show', () => {
    win.show()
  })

  win.on('closed', () => {
    historyWindow = null
  })

  let devUrl = process.env['ELECTRON_RENDERER_URL']
  if (devUrl) {
    win.loadURL(`${devUrl}?page=history`)
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'), { query: { page: 'history' } })
  }
}

async function startColorPicker(): Promise<void> {
  let status = systemPreferences.getMediaAccessStatus('screen')
  if (status !== 'granted') {
    if (historyWindow) {
      historyWindow.show()
      historyWindow.webContents.send('permission-status-changed', false)
    }
    return
  }

  try {
    let capture = await captureActiveScreen()

    if (pickerWindow) {
      pickerWindow.close()
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
        preload: join(__dirname, '../preload/preload.js'),
        sandbox: false,
        contextIsolation: true,
        nodeIntegration: false
      }
    })

    pickerWindow = win
    win.setAlwaysOnTop(true, 'screen-saver')
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

    win.once('ready-to-show', () => {
      win.show()
      win.focus()
      win.webContents.send('screen-captured', capture.imgDataUrl)
    })

    win.on('closed', () => {
      pickerWindow = null
    })

    let devUrl = process.env['ELECTRON_RENDERER_URL']
    if (devUrl) {
      win.loadURL(`${devUrl}?page=picker`)
    } else {
      win.loadFile(join(__dirname, '../renderer/index.html'), { query: { page: 'picker' } })
    }
  } catch (error) {
    console.error('Falha ao iniciar o Color Picker:', error)
  }
}

function setupIpcHandlers(): void {
  ipcMain.handle('get-history', () => {
    return readHistoryFromFile()
  })

  ipcMain.handle('remove-history-item', (_event, timestamp: number) => {
    let history = readHistoryFromFile()
    let updated = history.filter((item) => item.timestamp !== timestamp)
    saveHistoryToFile(updated)
    if (historyWindow) {
      historyWindow.webContents.send('history-updated', updated)
    }
    return updated
  })

  ipcMain.handle('clear-history', () => {
    let empty: ColorHistoryItem[] = []
    saveHistoryToFile(empty)
    if (historyWindow) {
      historyWindow.webContents.send('history-updated', empty)
    }
    return empty
  })

  ipcMain.handle('check-permission', () => {
    return systemPreferences.getMediaAccessStatus('screen') === 'granted'
  })

  ipcMain.on('open-settings', () => {
    shell.openExternal(
      'x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture'
    )
  })

  ipcMain.on('copy-to-clipboard', (_event, text: string) => {
    clipboard.writeText(text)
  })

  ipcMain.on(
    'select-color',
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
        historyWindow.webContents.send('history-updated', updated)
      }

      if (pickerWindow) {
        pickerWindow.close()
      }

      new Notification({
        title: 'Cor Copiada!',
        body: `${textToCopy} copiado para a área de transferência.`,
        silent: true
      }).show()
    }
  )

  ipcMain.on('cancel-selection', () => {
    if (pickerWindow) {
      pickerWindow.close()
    }
  })
}

//Main
app.whenReady().then(function () {
  HISTORY_FILE_PATH = join(app.getPath('userData'), 'history.json')
  setupIpcHandlers()
  createHistoryWindow()

  registerGlobalShortcut('CommandOrControl+Shift+C', function () {
    startColorPicker()
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createHistoryWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  unregisterAllShortcuts()
})
