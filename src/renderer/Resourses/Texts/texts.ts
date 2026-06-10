//Types
type TextResources = {
  app: {
    checkingPermission: string
    shortcutTip: string
  }
  picker: {
    colorCopied: string
  }
  permission: {
    title: string
    description: string
    step1: string
    step2: string
    step3: string
    step4: string
    button: string
    devTipTitle: string
    devTipText: string
  }
  history: {
    copied: string
    back: string
    settings: string
    interfaceTheme: string
    themeLight: string
    themeDark: string
    themeSystem: string
    windowEffect: string
    effectTranslucent: string
    effectSolid: string
    historyTitle: string
    historySubtitle: string
    captureColorTooltip: string
    clearHistoryTooltip: string
    emptyHistory: string
    pressShortcut: string
    captureColorBtn: string
    recentColors: string
    removeFromHistory: string
    copyHex: string
    copyRgb: string
    copyHsl: string
    copyHsv: string
    language: string
  }
}

type Languages = {
  en: TextResources
  pt: TextResources
  es: TextResources
}

//Main
let texts: Languages = {
  en: {
    app: {
      checkingPermission: "Checking permission...",
      shortcutTip: "Press CMD + SHIFT + C to start the capturer."
    },
    picker: {
      colorCopied: "Color Copied!"
    },
    permission: {
      title: "Permission Required",
      description: "To capture colors from anywhere on the screen, the application needs macOS Screen Recording permission.",
      step1: "Open System Settings",
      step2: "Go to Privacy & Security",
      step3: "Select Screen Recording",
      step4: "Enable Mai Color Picker",
      button: "Open System Settings",
      devTipTitle: "Development note:",
      devTipText: "If you are running the app via terminal or editor (e.g. npm run dev), make sure that your Terminal or VS Code/Cursor has Screen Recording permission in macOS System Settings. Otherwise, only the wallpaper (desktop) will be captured."
    },
    history: {
      copied: "Copied: {text}",
      back: "Back",
      settings: "Settings",
      interfaceTheme: "Interface Theme",
      themeLight: "Light Theme",
      themeDark: "Dark Theme",
      themeSystem: "System Default",
      windowEffect: "Window Effect",
      effectTranslucent: "Translucent",
      effectSolid: "Solid Tint",
      historyTitle: "Color History",
      historySubtitle: "Last 20 selected colors",
      captureColorTooltip: "Capture Color (Cmd+Shift+C)",
      clearHistoryTooltip: "Clear History",
      emptyHistory: "No colors in history.",
      pressShortcut: "Press CMD + SHIFT + C",
      captureColorBtn: "Capture Color",
      recentColors: "Recent Colors",
      removeFromHistory: "Remove from history",
      copyHex: "Copy HEX",
      copyRgb: "Copy RGB",
      copyHsl: "Copy HSL",
      copyHsv: "Copy HSV",
      language: "Language"
    }
  },
  pt: {
    app: {
      checkingPermission: "Verificando permissão...",
      shortcutTip: "Pressione CMD + SHIFT + C para iniciar o capturador."
    },
    picker: {
      colorCopied: "Cor Copiada!"
    },
    permission: {
      title: "Permissão Necessária",
      description: "Para capturar cores de qualquer lugar da tela, o aplicativo precisa de permissão de Gravação de Tela do macOS.",
      step1: "Abra os Ajustes do Sistema",
      step2: "Vá em Privacidade e Segurança",
      step3: "Selecione Gravação de Tela",
      step4: "Habilite o Mai Color Picker",
      button: "Abrir Ajustes do Sistema",
      devTipTitle: "Nota de desenvolvimento:",
      devTipText: "Se você estiver rodando o aplicativo via terminal ou editor (ex: npm run dev), certifique-se de que o seu Terminal ou VS Code/Cursor possui a permissão de Gravação de Tela nos Ajustes do Sistema do macOS. Caso contrário, apenas o plano de fundo (mesa) será capturado."
    },
    history: {
      copied: "Copiado: {text}",
      back: "Voltar",
      settings: "Configurações",
      interfaceTheme: "Tema da Interface",
      themeLight: "Tema Claro",
      themeDark: "Tema Escuro",
      themeSystem: "Padrão do Sistema",
      windowEffect: "Efeito da Janela",
      effectTranslucent: "Translúcido",
      effectSolid: "Tonalizado (Sólido)",
      historyTitle: "Histórico de Cores",
      historySubtitle: "Últimas 20 cores selecionadas",
      captureColorTooltip: "Capturar Cor (Cmd+Shift+C)",
      clearHistoryTooltip: "Limpar Histórico",
      emptyHistory: "Nenhuma cor no histórico.",
      pressShortcut: "Pressione CMD + SHIFT + C",
      captureColorBtn: "Capturar Cor",
      recentColors: "Cores Recentes",
      removeFromHistory: "Remover do histórico",
      copyHex: "Copiar HEX",
      copyRgb: "Copiar RGB",
      copyHsl: "Copiar HSL",
      copyHsv: "Copiar HSV",
      language: "Idioma"
    }
  },
  es: {
    app: {
      checkingPermission: "Verificando permiso...",
      shortcutTip: "Presione CMD + SHIFT + C para iniciar el capturador."
    },
    picker: {
      colorCopied: "¡Color Copiado!"
    },
    permission: {
      title: "Permiso Requerido",
      description: "Para capturar colores de cualquier lugar de la pantalla, la aplicación necesita permiso de Grabación de Pantalla de macOS.",
      step1: "Abra la Configuración del Sistema",
      step2: "Vaya a Privacidad y Seguridad",
      step3: "Seleccione Grabación de Pantalla",
      step4: "Habilite Mai Color Picker",
      button: "Abrir Configuración del Sistema",
      devTipTitle: "Nota de desarrollo:",
      devTipText: "Si está ejecutando la aplicación a través de la terminal o del editor (ej: npm run dev), asegúrese de que su Terminal o VS Code/Cursor tenga permiso de Grabación de Pantalla en la Configuración del Sistema de macOS. De lo contrario, solo se capturará el fondo de pantalla (escritorio)."
    },
    history: {
      copied: "Copiado: {text}",
      back: "Volver",
      settings: "Configuraciones",
      interfaceTheme: "Tema de la Interfaz",
      themeLight: "Tema Claro",
      themeDark: "Tema Oscuro",
      themeSystem: "Predeterminado del Sistema",
      windowEffect: "Efecto de Ventana",
      effectTranslucent: "Translúcido",
      effectSolid: "Tono Sólido",
      historyTitle: "Historial de Colores",
      historySubtitle: "Últimas 20 colores seleccionados",
      captureColorTooltip: "Capturar Color (Cmd+Shift+C)",
      clearHistoryTooltip: "Limpiar Historial",
      emptyHistory: "No hay colores en el historial.",
      pressShortcut: "Presione CMD + SHIFT + C",
      captureColorBtn: "Capturar Color",
      recentColors: "Colores Recientes",
      removeFromHistory: "Eliminar del historial",
      copyHex: "Copiar HEX",
      copyRgb: "Copiar RGB",
      copyHsl: "Copiar HSL",
      copyHsv: "Copiar HSV",
      language: "Idioma"
    }
  }
}

export default texts
export { texts }
