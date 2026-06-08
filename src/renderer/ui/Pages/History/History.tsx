//Libs
import { useState, useEffect } from "react"

//Imports
import { ColorHistoryItem } from "../../../types"
import styles from "./History.module.css"

//Main
function History(): React.JSX.Element {
  let [historyList, setHistoryList] = useState<ColorHistoryItem[]>([])
  let [toast, setToast] = useState<{ show: boolean; text: string }>({ show: false, text: "" })

  // Fetch initial history and subscribe to changes
  useEffect(function() {
    window.api.getHistory().then(function(initialHistory) {
      setHistoryList(initialHistory)
    })

    window.api.onHistoryUpdated(function(updatedHistory) {
      setHistoryList(updatedHistory)
    })
  }, [])

  let handleCopyColor = function(text: string) {
    window.api.copyToClipboard(text)
    setToast({ show: true, text: `Copiado: ${text}` })
    setTimeout(function() {
      setToast({ show: false, text: "" })
    }, 1500)
  }

  let handleRemoveItem = function(event: React.MouseEvent, timestamp: number) {
    event.stopPropagation() // Prevent triggering copy row click
    window.api.removeHistoryItem(timestamp).then(function(updated) {
      setHistoryList(updated)
    })
  }

  let handleClearHistory = function() {
    window.api.clearHistory().then(function(updated) {
      setHistoryList(updated)
    })
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleContainer}>
          <span className={styles.title}>Histórico de Cores</span>
          <span className={styles.subtitle}>Últimas 20 cores selecionadas</span>
        </div>
        {historyList.length > 0 && (
          <button className={styles.clearButton} onClick={handleClearHistory}>
            Limpar tudo
          </button>
        )}
      </header>

      {historyList.length === 0 ? (
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
          </svg>
          <div className={styles.emptyText}>
            Nenhuma cor no histórico.
            <div className={styles.emptyShortcut}>Pressione CMD + SHIFT + C</div>
          </div>
        </div>
      ) : (
        <div className={styles.list}>
          {historyList.map(function(item) {
            return (
              <div
                key={item.timestamp}
                className={styles.item}
                onClick={function() {
                  handleCopyColor(item.hex)
                }}
              >
                <div
                  className={styles.swatch}
                  style={{ backgroundColor: item.hex }}
                />
                <div className={styles.colorDetails}>
                  <span className={styles.hexCode}>{item.hex}</span>
                  <span className={styles.otherFormats}>
                    {item.rgb} | {item.hsl}
                  </span>
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.actionButton}
                    title="Copiar HEX"
                    onClick={function(e) {
                      e.stopPropagation()
                      handleCopyColor(item.hex)
                    }}
                  >
                    <svg className={styles.icon} viewBox="0 0 24 24">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                    </svg>
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.delete}`}
                    title="Remover"
                    onClick={function(e) {
                      handleRemoveItem(e, item.timestamp)
                    }}
                  >
                    <svg className={styles.icon} viewBox="0 0 24 24">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className={`${styles.toast} ${toast.show ? styles.show : ""}`}>
        {toast.text}
      </div>
    </div>
  )
}

export default History
