//Imports
import styles from "./Permission.module.css"

//Main
function Permission(): React.JSX.Element {
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
      <h1 className={styles.title}>Permissão Necessaria</h1>
      <p className={styles.description}>
        Para capturar cores de qualquer lugar da tela, o aplicativo precisa de permissão de Gravação
        de Tela do macOS.
      </p>
      <div className={styles.steps}>
        <div className={styles.step}>
          <span className={styles.stepNumber}>1</span>
          <span>Abra os Ajustes do Sistema</span>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>2</span>
          <span>Vá em Privacidade e Segurança</span>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>3</span>
          <span>Selecione Gravação de Tela</span>
        </div>
        <div className={styles.step}>
          <span className={styles.stepNumber}>4</span>
          <span>Habilite o Mai Color Picker</span>
        </div>
      </div>
      <button className={styles.button} onClick={handleOpenSettings}>
        Abrir Ajustes do Sistema
      </button>
      <div className={styles.devTip}>
        <strong>Nota de desenvolvimento:</strong> Se você estiver rodando o aplicativo via terminal
        ou editor (ex: npm run dev), certifique-se de que o seu <strong>Terminal</strong> ou{" "}
        <strong>VS Code/Cursor</strong> possui a permissão de Gravação de Tela nos Ajustes do
        Sistema do macOS. Caso contrário, apenas o plano de fundo (mesa) será capturado.
      </div>
    </div>
  )
}

export default Permission
