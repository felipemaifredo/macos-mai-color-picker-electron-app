//Libs
import { globalShortcut } from "electron"

//Funcs
export function registerGlobalShortcut(shortcut: string, callback: () => void): boolean {
  let isRegistered = globalShortcut.isRegistered(shortcut)

  if (isRegistered) {
    globalShortcut.unregister(shortcut)
  }

  return globalShortcut.register(shortcut, () => {
    callback()
  })
}

export function unregisterAllShortcuts(): void {
  globalShortcut.unregisterAll()
}
