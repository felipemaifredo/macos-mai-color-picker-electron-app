# Design System: macOS Color Picker (Glassmorphism Dark Theme)

Este documento define os padrões visuais, tokens e componentes do Design System para o aplicativo **macOS Color Picker**. Ele serve como guia para a estilização dos componentes e páginas utilizando CSS Modules.

---

## 1. Cores e Transparências

### Paleta Principal (Dark Theme & Glassmorphism)

- **Overlay de Fundo (Fullscreen)**: `rgba(15, 15, 20, 0.4)` (Escurece levemente a tela mantendo a captura visível ao fundo)
- **Fundo da Lupa/Painéis**: `rgba(28, 28, 36, 0.75)` com `backdrop-filter: blur(16px)`
- **Fundo de Itens Ativos/Hover**: `rgba(255, 255, 255, 0.08)`
- **Bordas Translúcidas**: `rgba(255, 255, 255, 0.1)` (Dá o efeito de vidro/glassmorphism)
- **Sombra de Contorno (Glow)**: `rgba(0, 240, 255, 0.25)`

### Cores de Texto

- **Texto Primário**: `#FFFFFF` (Leitura clara)
- **Texto Secundário**: `rgba(255, 255, 255, 0.6)`
- **Texto Muted**: `rgba(255, 255, 255, 0.38)`

### Acentos Neon

- **Acento Primário (Cyan)**: `#00f0ff`
- **Acento Secundário (Purple)**: `#bd00ff`
- **Sucesso (Copiado)**: `#39ff14` (Green neon)

---

## 2. Tipografia

- **Família de Fontes**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` (Tipografia nativa rápida do macOS)
- **Tamanhos e Pesos**:
  - Títulos/Valores de Cor: `14px`, Semibold (`600`)
  - Subtítulos/Formatos: `10px`, Bold (`700`), Uppercase com `letter-spacing: 0.05em`
  - Texto de Dica/Atalhos: `11px`, Regular (`400`)

---

## 3. Sombras e Bordas

- **Borda Padrão**: `1px solid rgba(255, 255, 255, 0.1)`
- **Raio da Borda (Border Radius)**:
  - Lupa: Circular (`50%`) ou Cantos arredondados (`16px`)
  - Painéis de Informação/Histórico: `12px`
  - Botões/Atalhos: `6px`
- **Box Shadows**:
  - Painel Elevado: `0 8px 32px 0 rgba(0, 0, 0, 0.37)`
  - Glow Ativo: `0 0 12px rgba(0, 240, 255, 0.4)`

---

## 4. Animações e Transições

- **Transição de Hover**: `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`
- **Efeito de Lente da Lupa**: Transição suave de escala de pixels e cor central.
- **Feedback de Cópia**: Micro-animação de scale e fade-in para a notificação de sucesso.

---

## 5. Diretrizes para CSS Modules

1. **Evitar Valores Fixos (Ad-hoc)**: Usar variáveis CSS definidas em um escopo global (`:root`).
2. **Propriedades Específicas do macOS**:
   - Para janelas arrastáveis: `-webkit-app-region: drag` (apenas no cabeçalho do Histórico)
   - Para botões não-arrastáveis: `-webkit-app-region: no-drag`
   - Desativar seleção de texto em overlays de clique: `user-select: none`
