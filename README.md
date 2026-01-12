# Rede Viva - Landing Page IBB

Landing page responsiva e moderna para a Igreja Batista do Bacacheri (IBB), desenvolvida com HTML, CSS e JavaScript puro.

## 🎯 Características

- ✅ Design responsivo e moderno (mobile-first)
- ✅ Animações fluidas ao scroll
- ✅ Formulário de captura com validação completa
- ✅ Performance otimizada
- ✅ Build system com Webpack

## 📁 Estrutura do Projeto

```
rede-viva-landing-page/
├── index.html              # Página principal
├── css/                    # Estilos
├── js/                     # JavaScript
├── assets/                 # Imagens e logos
├── src/                    # Entry point para Webpack
├── dist/                   # Build de produção (gerado)
└── package.json            # Dependências npm
```

## 🚀 Como Usar

### Desenvolvimento

```bash
# Instale as dependências
npm install

# Servidor local com hot reload
npm run serve
```

### Produção

```bash
# Build de produção (minificado e otimizado)
npm run build
```

Os arquivos de produção estarão na pasta `dist/`.

### Comandos Disponíveis

- `npm run build` → Build de produção
- `npm run build:simple` → Build simples (sem minificar)
- `npm run dev` → Build de desenvolvimento com watch
- `npm run serve` → Servidor local em `http://localhost:9000`

## 📝 Formulário

O formulário inclui os seguintes campos:
- Nome, Email, Celular
- Tipo (pastor/líder)
- Igreja, Estado, Cidade (carregados da API do IBGE)
- Captcha

### Integração com API

Para conectar o formulário com sua API, edite a função `submitToAPI` em `js/main.js`:

```javascript
async function submitToAPI(data) {
    const response = await fetch('https://sua-api.com/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    return response.json();
}
```

## 🎨 Personalização

- **Cores**: Edite as variáveis CSS em `css/style.css`
- **Conteúdo**: Edite textos diretamente no `index.html`
- **Imagens**: Adicione em `assets/images/` e referencie no HTML

## 🌐 GitHub Pages

O projeto está configurado para deploy automático no GitHub Pages.

### Configuração

1. Faça push do código para o GitHub
2. Vá em **Settings** → **Pages** no repositório
3. Em **Source**, selecione **GitHub Actions**
4. O site será publicado automaticamente em cada push na branch `main`

O workflow faz o build automaticamente e publica em: `https://seu-usuario.github.io/rede-viva-landing-page/`

## 🛠️ Tecnologias

- HTML5, CSS3, JavaScript (Vanilla)
- Webpack 5 para build e otimização

## 📄 Licença

Este projeto foi desenvolvido para a Igreja Batista do Bacacheri (IBB).

---

**Desenvolvido com ❤️ para IBB - Rede Viva**
