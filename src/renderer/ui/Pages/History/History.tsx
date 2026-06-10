//Libs
import { useState, useEffect } from "react"

//Imports
import { ColorHistoryItem } from "../../../types"
import useI18n from "../../../Lib/Hooks/useI18n"
import styles from "./History.module.css"

//Main
function History(): React.JSX.Element {
  let { t, locale, changeLanguage } = useI18n()
  let [historyList, setHistoryList] = useState<ColorHistoryItem[]>([])
  let [activeColor, setActiveColor] = useState<ColorHistoryItem | null>(null)
  let [toast, setToast] = useState<{ show: boolean; text: string }>({ show: false, text: "" })
  let [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
  let [theme, setTheme] = useState<string>("system")
  let [effect, setEffect] = useState<string>("system")

  // Fetch initial history and subscribe to changes
  useEffect(function () {
    window.api.getHistory().then(function (initialHistory) {
      setHistoryList(initialHistory)
      if (initialHistory.length > 0) {
        setActiveColor(initialHistory[0])
      }
    })

    window.api.onHistoryUpdated(function (updatedHistory) {
      setHistoryList(updatedHistory)
      if (updatedHistory.length > 0) {
        setActiveColor(function (prev) {
          if (
            prev &&
            updatedHistory.some(function (item) {
              return item.timestamp === prev.timestamp
            })
          ) {
            return prev
          }
          return updatedHistory[0]
        })
      } else {
        setActiveColor(null)
      }
    })
  }, [])

  // Load current settings when settings screen is opened
  useEffect(
    function () {
      let savedTheme = localStorage.getItem("colorpicker-theme") || "system"
      let savedEffect = localStorage.getItem("colorpicker-effect") || "system"
      setTheme(savedTheme)
      setEffect(savedEffect)
    },
    [isSettingsOpen]
  )

  function updateTheme(newTheme: string): void {
    setTheme(newTheme)
    localStorage.setItem("colorpicker-theme", newTheme)
    let root = document.documentElement
    root.classList.remove("theme-light", "theme-dark", "theme-system")
    root.classList.add(`theme-${newTheme}`)
  }

  function updateEffect(newEffect: string): void {
    setEffect(newEffect)
    localStorage.setItem("colorpicker-effect", newEffect)
    let root = document.documentElement
    root.classList.remove("effect-translucent", "effect-solid", "effect-system")
    root.classList.add(`effect-${newEffect}`)
  }

  function handleCopyColor(text: string): void {
    window.api.copyToClipboard(text)
    setToast({ show: true, text: t.history.copied.replace("{text}", text) })
    setTimeout(function () {
      setToast({ show: false, text: "" })
    }, 1500)
  }

  function handleRemoveItem(timestamp: number): void {
    window.api.removeHistoryItem(timestamp).then(function (updated) {
      setHistoryList(updated)
    })
  }

  function handleClearHistory(): void {
    window.api.clearHistory().then(function (updated) {
      setHistoryList(updated)
      setActiveColor(null)
    })
  }

  function handleStartPicker(): void {
    window.api.startPicker()
  }

  if (isSettingsOpen) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.titleContainer}>
            <button
              className={styles.backButton}
              onClick={function () {
                setIsSettingsOpen(false)
              }}
            >
              <svg className={styles.backIcon} viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
              {t.history.back}
            </button>
            <span className={styles.title} style={{ marginTop: "8px" }}>
              {t.history.settings}
            </span>
          </div>
        </header>

        <div className={styles.settingsContent}>
          <div className={styles.settingsGroup}>
            <span className={styles.groupTitle}>{t.history.interfaceTheme}</span>
            <div className={styles.optionsGrid}>
              <button
                className={`${styles.optionCard} ${theme === "light" ? styles.optionActive : ""}`}
                onClick={function () {
                  updateTheme("light")
                }}
              >
                {t.history.themeLight}
              </button>
              <button
                className={`${styles.optionCard} ${theme === "dark" ? styles.optionActive : ""}`}
                onClick={function () {
                  updateTheme("dark")
                }}
              >
                {t.history.themeDark}
              </button>
              <button
                className={`${styles.optionCard} ${theme === "system" ? styles.optionActive : ""}`}
                onClick={function () {
                  updateTheme("system")
                }}
              >
                {t.history.themeSystem}
              </button>
            </div>
          </div>

          <div className={styles.settingsGroup}>
            <span className={styles.groupTitle}>{t.history.windowEffect}</span>
            <div className={styles.optionsGrid}>
              <button
                className={`${styles.optionCard} ${effect === "translucent" ? styles.optionActive : ""}`}
                onClick={function () {
                  updateEffect("translucent")
                }}
              >
                {t.history.effectTranslucent}
              </button>
              <button
                className={`${styles.optionCard} ${effect === "solid" ? styles.optionActive : ""}`}
                onClick={function () {
                  updateEffect("solid")
                }}
              >
                {t.history.effectSolid}
              </button>
              <button
                className={`${styles.optionCard} ${effect === "system" ? styles.optionActive : ""}`}
                onClick={function () {
                  updateEffect("system")
                }}
              >
                {t.history.themeSystem}
              </button>
            </div>
          </div>

          <div className={styles.settingsGroup}>
            <span className={styles.groupTitle}>{t.history.language}</span>
            <div className={styles.optionsGrid}>
              <button
                className={`${styles.optionCard} ${locale === "en" ? styles.optionActive : ""}`}
                onClick={function () {
                  changeLanguage("en")
                }}
              >
                English
              </button>
              <button
                className={`${styles.optionCard} ${locale === "pt" ? styles.optionActive : ""}`}
                onClick={function () {
                  changeLanguage("pt")
                }}
              >
                Português
              </button>
              <button
                className={`${styles.optionCard} ${locale === "es" ? styles.optionActive : ""}`}
                onClick={function () {
                  changeLanguage("es")
                }}
              >
                Español
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleContainer}>
          <span className={styles.title}>{t.history.historyTitle}</span>
          <span className={styles.subtitle}>{t.history.historySubtitle}</span>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.pickerButton}
            onClick={handleStartPicker}
            title={t.history.captureColorTooltip}
          >
            <svg className={styles.pickerIcon} viewBox="0 0 24 24">
              <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            </svg>
          </button>
          {historyList.length > 0 && (
            <button
              className={styles.clearButton}
              onClick={handleClearHistory}
              title={t.history.clearHistoryTooltip}
            >
              <svg className={styles.clearIcon} viewBox="0 0 24 24">
                <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
              </svg>
            </button>
          )}
          <button
            className={styles.settingsButton}
            onClick={function () {
              setIsSettingsOpen(true)
            }}
            title={t.history.settings}
          >
            <svg className={styles.settingsIcon} viewBox="0 0 24 24">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
          </button>
        </div>
      </header>

      {historyList.length === 0 ? (
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
          </svg>
          <div className={styles.emptyText}>
            {t.history.emptyHistory}
            <div className={styles.emptyShortcut}>{t.history.pressShortcut}</div>
          </div>
          <button className={styles.emptyPickerButton} onClick={handleStartPicker}>
            {t.history.captureColorBtn}
          </button>
        </div>
      ) : (
        activeColor && (
          <div className={styles.content}>
            <div className={styles.historySection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>{t.history.recentColors}</span>
                <span className={styles.itemCount}>{historyList.length}/20</span>
              </div>
              <div className={styles.swatchesScroll}>
                {historyList.map(function (item) {
                  let isActive = activeColor.timestamp === item.timestamp
                  return (
                    <div
                      key={item.timestamp}
                      className={`${styles.swatchItem} ${isActive ? styles.activeSwatch : ""}`}
                      style={{ backgroundColor: item.hex }}
                      onClick={function () {
                        setActiveColor(item)
                      }}
                      title={item.hex}
                    />
                  )
                })}
              </div>
            </div>

            <div className={styles.activeColorSection}>
              <div className={styles.activePreviewContainer}>
                <div className={styles.largeSwatch} style={{ backgroundColor: activeColor.hex }} />
                <div className={styles.activeDetails}>
                  <span className={styles.activeHex}>{activeColor.hex}</span>
                  <button
                    className={styles.deleteActiveButton}
                    title={t.history.removeFromHistory}
                    onClick={function () {
                      handleRemoveItem(activeColor.timestamp)
                    }}
                  >
                    <svg className={styles.deleteIcon} viewBox="0 0 24 24">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className={styles.formatsList}>
                <div className={styles.formatCard}>
                  <span className={styles.formatBadge}>HEX</span>
                  <span className={styles.formatValue}>{activeColor.hex}</span>
                  <button
                    className={styles.copyCardButton}
                    title={t.history.copyHex}
                    onClick={function () {
                      handleCopyColor(activeColor.hex)
                    }}
                  >
                    <svg className={styles.copyIcon} viewBox="0 0 24 24">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                    </svg>
                  </button>
                </div>

                <div className={styles.formatCard}>
                  <span className={styles.formatBadge}>RGB</span>
                  <span className={styles.formatValue}>{activeColor.rgb}</span>
                  <button
                    className={styles.copyCardButton}
                    title={t.history.copyRgb}
                    onClick={function () {
                      handleCopyColor(activeColor.rgb)
                    }}
                  >
                    <svg className={styles.copyIcon} viewBox="0 0 24 24">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                    </svg>
                  </button>
                </div>

                <div className={styles.formatCard}>
                  <span className={styles.formatBadge}>HSL</span>
                  <span className={styles.formatValue}>{activeColor.hsl}</span>
                  <button
                    className={styles.copyCardButton}
                    title={t.history.copyHsl}
                    onClick={function () {
                      handleCopyColor(activeColor.hsl)
                    }}
                  >
                    <svg className={styles.copyIcon} viewBox="0 0 24 24">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                    </svg>
                  </button>
                </div>

                {activeColor.hsv && (
                  <div className={styles.formatCard}>
                    <span className={styles.formatBadge}>HSV</span>
                    <span className={styles.formatValue}>{activeColor.hsv}</span>
                    <button
                      className={styles.copyCardButton}
                      title={t.history.copyHsv}
                      onClick={function () {
                        if (activeColor.hsv) {
                          handleCopyColor(activeColor.hsv)
                        }
                      }}
                    >
                      <svg className={styles.copyIcon} viewBox="0 0 24 24">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      )}

      <div className={`${styles.toast} ${toast.show ? styles.show : ""}`}>{toast.text}</div>
    </div>
  )
}

export default History
