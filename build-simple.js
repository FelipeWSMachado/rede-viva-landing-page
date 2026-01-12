#!/usr/bin/env node

/**
 * Script simples para concatenar CSS e JS sem webpack
 * Use: node build-simple.js
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist-simple');
const cssDir = path.join(distDir, 'css');
const jsDir = path.join(distDir, 'js');

// Cria diretórios se não existirem
[distDir, cssDir, jsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Arquivos CSS para concatenar
const cssFiles = [
  'css/style.css',
  'css/animations.css',
  'css/responsive.css'
];

// Arquivos JS para concatenar
const jsFiles = [
  'js/main.js',
  'js/scroll-reveal.js',
  'js/section-interactions.js'
];

// Concatena CSS
let cssContent = '';
cssFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    cssContent += `\n/* ===== ${file} ===== */\n`;
    cssContent += fs.readFileSync(filePath, 'utf8');
    cssContent += '\n';
  }
});

// Concatena JS
let jsContent = '';
jsFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    jsContent += `\n/* ===== ${file} ===== */\n`;
    jsContent += fs.readFileSync(filePath, 'utf8');
    jsContent += '\n';
  }
});

// Escreve arquivos concatenados
fs.writeFileSync(path.join(cssDir, 'all.css'), cssContent);
fs.writeFileSync(path.join(jsDir, 'all.js'), jsContent);

// Copia assets
const assetsDir = path.join(__dirname, 'assets');
const distAssetsDir = path.join(distDir, 'assets');
if (fs.existsSync(assetsDir)) {
  copyRecursiveSync(assetsDir, distAssetsDir);
}

// Copia HTML e atualiza referências
let htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
htmlContent = htmlContent.replace(
  /<link rel="stylesheet" href="css\/[^"]+">/g,
  '<link rel="stylesheet" href="css/all.css">'
);
htmlContent = htmlContent.replace(
  /<script src="js\/[^"]+"><\/script>/g,
  '<script src="js/all.js"></script>'
);

fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);

console.log('✅ Build simples concluído!');
console.log(`📁 Arquivos em: ${distDir}`);
console.log('📄 CSS unificado: css/all.css');
console.log('📄 JS unificado: js/all.js');

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

