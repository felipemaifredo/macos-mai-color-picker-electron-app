# macOS Color Picker (Inspirador no PowerToys)

Uma ferramenta premium e nativa para macOS desenvolvida em **Electron**, **React**, **TypeScript** e **Vite**, projetada para capturar e gerenciar cores de qualquer pixel da tela de forma extremamente fluida e com efeitos visuais modernos (Glassmorphism e Neon).

---

## 🚀 Funcionalidades

- **Atalho Global Nativo:** Acione o seletor instantaneamente com `CMD + SHIFT + C`.
- **Overlay Fluido de Captura:** Captura a tela atual uma única vez e escurece-a suavemente, permitindo navegar com precisão sem perda de performance.
- **Lupa com Grade de Pixels:** Lente de aumento com zoom de 13x mostrando a grade de pixels e destaque neon no pixel sob o cursor.
- **Múltiplos Formatos de Cores:** Exibe e converte valores em tempo real nos formatos:
  - **HEX** (`#4285F4`)
  - **RGB** (`rgb(66, 133, 244)`)
  - **HSL** (`hsl(217, 89%, 61%)`)
  - **HSV** (`hsv(217, 73%, 96%)`)
- **Histórico Persistente:** Painel secundário estilizado com as últimas 20 cores capturadas, permitindo copiar novamente, remover itens ou limpar a lista. Salvo localmente em arquivo JSON.
- **Detecção de Permissões macOS:** Detecta se a permissão de Gravação de Tela está ativa e exibe um guia visual passo a passo para ativá-la nos Ajustes do Sistema caso necessário.
- **Design macOS Nativo:** Tema escuro com efeitos translúcidos e suporte a arrastamento de janela (`-webkit-app-region: drag`).

---

## 🎮 Teclas de Atalho (No Modo Seletor)

- `TAB`: Alterna o formato de exibição principal (HEX ➜ RGB ➜ HSL ➜ HSV).
- `ESC`: Cancela a seleção e fecha o seletor.
- `ENTER`: Copia o valor do **formato ativo** para a área de transferência e fecha o seletor.
- `CLIQUE DO MOUSE`: Copia o valor **HEX** padrão para a área de transferência e fecha o seletor.

---

## 🛠️ Arquitetura do Projeto

A organização de pastas segue estritamente as regras de arquitetura:

```text
src/
├── main/               # Código do Processo Principal (Shortcuts, Capture, IPC, Windows)
├── preload/            # IPC Bridges seguros com contextIsolation habilitado
└── renderer/
    ├── Lib/
    │   └── Utils/      # Utilitários de Conversão de Cores
    ├── src/
    │   ├── App.tsx     # Router dinâmico e controle de permissões
    │   └── main.tsx    # Ponto de entrada do React
    └── ui/
        └── Pages/      # Telas estilizadas usando CSS Modules
            ├── Picker/       # Overlay de captura e lente de aumento
            ├── History/      # Lista das últimas cores salvas
            └── Permission/   # Tela de orientações de privacidade
```

---

## 💻 Como Rodar e Testar

### Pré-requisitos

- Node.js (v18 ou superior recomendado)
- macOS (para funcionalidade de atalhos e permissões nativas de captura de tela)

### Instalação

```bash
# Instalar dependências
npm install
```

### Desenvolvimento

```bash
# Iniciar o servidor de desenvolvimento com hot reload
npm run dev
```

### Typecheck (Verificação estática)

```bash
# Rodar checagem do TypeScript para main, preload e renderer
npm run typecheck
```

### Empacotar / Build de Produção

```bash
# Gerar build e compilar os bundles
npm run build

# Gerar o instalador empacotado para macOS (.dmg / .app)
npm run build:mac
```

---

## 🛡️ Segurança e Performance

- **Segurança:** Configuração reforçada com `contextIsolation: true` e `nodeIntegration: false`. Nenhuma função do Node.js é exposta diretamente ao processo do renderer.
- **Performance a 60 FPS:** Lupa renderizada de forma eficiente usando elemento `<canvas>` individual dinâmico, evitando re-renderizações desnecessárias do React durante o movimento rápido do mouse.
- **Mapeamento de DPI:** Lupa e leitura de pixels corrigidos matematicamente baseados na escala de DPI (Retina) para garantir fidelidade de cor idêntica ao que está na tela.
