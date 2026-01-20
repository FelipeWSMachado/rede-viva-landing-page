#!/bin/bash

# Script para converter GIFs para MP4 (muito mais leve e melhor qualidade)
# Os MP4s serão otimizados para web com qualidade alta mas tamanho reduzido

echo "Convertendo GIFs para MP4..."

cd assets/images

for gif in *.gif; do
    if [ -f "$gif" ]; then
        # Nome do arquivo sem extensão
        name="${gif%.gif}"
        
        echo "Convertendo $gif..."
        
        # Converte GIF para MP4 com:
        # - CRF 23 (qualidade alta, padrão YouTube)
        # - H.264 codec (compatível com todos navegadores)
        # - Preset slower (melhor compressão)
        # - Loop infinito
        # - Sem áudio
        # - Resolução mantida (ou reduzida se muito grande)
        
        # Primeiro, verifica a resolução do GIF
        width=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of default=noprint_wrappers=1:nokey=1 "$gif" 2>/dev/null || echo "1920")
        height=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of default=noprint_wrappers=1:nokey=1 "$gif" 2>/dev/null || echo "1080")
        
        # Limita resolução máxima a 1920x1080 (Full HD)
        if [ "$width" -gt 1920 ]; then
            scale="-vf scale=1920:-1"
        else
            scale=""
        fi
        
        ffmpeg -i "$gif" \
            -c:v libx264 \
            -preset slower \
            -crf 23 \
            -pix_fmt yuv420p \
            -movflags +faststart \
            -an \
            -tune animation \
            $scale \
            -y \
            "${name}.mp4" 2>/dev/null
        
        if [ -f "${name}.mp4" ]; then
            size_gif=$(ls -lh "$gif" | awk '{print $5}')
            size_mp4=$(ls -lh "${name}.mp4" | awk '{print $5}')
            echo "✅ $gif ($size_gif) -> ${name}.mp4 ($size_mp4)"
        else
            echo "❌ Erro ao converter $gif"
        fi
    fi
done

echo ""
echo "Conversão concluída!"
echo ""
echo "Tamanhos finais:"
ls -lh *.mp4 2>/dev/null | awk '{print $9, "-", $5}'
echo ""
echo "Próximos passos:"
echo "1. Teste os MP4s no navegador"
echo "2. Se estiver bom, atualize o HTML para usar .mp4 em vez de .gif"
echo "3. Os MP4s precisam ter atributos: autoplay, loop, muted, playsinline"
