//Imports
import useI18n from "../../../Lib/Hooks/useI18n"
import styles from "./Permission.module.css"

//Main
function Permission(): React.JSX.Element {
  let { t } = useI18n()

  function handleOpenSettings(): void {
    window.api.openSystemSettings()
  }

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <svg className={styles.icon} viewBox="0 0 24 24">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 16H5V8h9v8z" />
        </svg>
      </div>
      <h1 className={styles.title}>{t.permission.title}</h1>
      <p className={styles.description}>
        {t.permission.description}
      </p>
      <div className={styles.steps}>
        <div className={styles.step}>
          <span className={styles.stepNumber}>1</span>
          <span>{t.permission.step1}</span>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>2</span>
          <span>{t.permission.step2}</span>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>3</span>
          <span>{t.permission.step3}</span>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>4</span>
          <span>{t.permission.step4}</span>
        </div>
      </div>
      <button className={styles.button} onClick={handleOpenSettings}>
        {t.permission.button}
      </button>
      <div className={styles.devTip}>
        <strong>{t.permission.devTipTitle}</strong> {t.permission.devTipText}
      </div>
    </div>
  )
}

export default Permission
