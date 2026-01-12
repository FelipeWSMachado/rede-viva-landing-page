# Pasta de Logos

Esta pasta contém os arquivos de logo da Rede Viva / IBB.

## Arquivos

- `logo.png` - Logo principal da Rede Viva/IBB

## Formatos Suportados

- **PNG** (recomendado para logos com transparência)
- **SVG** (ideal para logos vetoriais - melhor qualidade)
- **JPG** (use apenas se não houver transparência necessária)
- **WebP** (formato moderno, boa compressão)

## Como Usar

A logo está configurada no header da página. Para alterar:

1. **Substitua o arquivo** `logo.png` por sua logo
2. **Ou atualize o HTML** em `index.html`:
   ```html
   <img src="assets/logos/logo.png" alt="Rede Viva - IBB" class="logo-image" />
   ```

## Tamanhos Recomendados

- **Altura**: 40-60px (para header)
- **Largura**: Proporcional (mantenha proporção original)
- **Resolução**: Mínimo 2x para telas retina (ex: 80-120px de altura)

## Formatos por Uso

- **Header**: PNG ou SVG (40-60px altura)
- **Favicon**: ICO ou PNG 32x32px
- **Footer**: PNG ou SVG (menor, ~30px altura)

## Otimização

- Use ferramentas como [TinyPNG](https://tinypng.com/) para PNGs
- Use [SVGOMG](https://jakearchibald.github.io/svgomg/) para SVGs
- Mantenha arquivos leves (< 50KB idealmente)

---

**Nota**: A logo atual está sendo exibida junto com o texto "Rede Viva". Para usar apenas a imagem, adicione a classe `logo-image-only` no elemento `.logo` no HTML.

