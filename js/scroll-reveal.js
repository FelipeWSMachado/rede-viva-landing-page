/* ============================================
   Scroll Reveal Animation - Estilo Apple
   ============================================ */

(function() {
    'use strict';

    // Seleciona todos os elementos com data-aos
    const elements = document.querySelectorAll('[data-aos]');
    
    // Configurações avançadas
    const config = {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: '0px 0px -100px 0px',
        once: false, // Permite animação reversível
        duration: 800, // Duração da animação em ms
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' // Easing suave estilo Apple
    };

    // Função para calcular progresso da animação baseado na posição do scroll
    function calculateProgress(entry) {
        const rect = entry.boundingClientRect;
        const windowHeight = window.innerHeight;
        const elementHeight = rect.height;
        
        // Calcula quando o elemento entra na viewport
        const elementTop = rect.top;
        const elementBottom = rect.bottom;
        
        // Ponto de início da animação (quando o elemento está 20% visível)
        const startPoint = windowHeight * 0.8;
        // Ponto de fim da animação (quando o elemento está 100% visível)
        const endPoint = windowHeight * 0.2;
        
        // Calcula o progresso (0 a 1)
        let progress = 0;
        
        if (elementTop < startPoint && elementTop > endPoint) {
            // Elemento está entrando na viewport
            progress = 1 - ((elementTop - endPoint) / (startPoint - endPoint));
        } else if (elementTop <= endPoint) {
            // Elemento está totalmente visível
            progress = 1;
        } else {
            // Elemento ainda não entrou na viewport
            progress = 0;
        }
        
        // Garante que progress está entre 0 e 1
        progress = Math.max(0, Math.min(1, progress));
        
        return progress;
    }

    // Função para aplicar animação progressiva
    function applyAnimation(element, progress, animationType) {
        const opacity = progress;
        let transform = '';
        
        switch(animationType) {
            case 'fade-up':
                transform = `translateY(${40 * (1 - progress)}px)`;
                break;
            case 'fade-down':
                transform = `translateY(${-40 * (1 - progress)}px)`;
                break;
            case 'fade-left':
                transform = `translateX(${40 * (1 - progress)}px)`;
                break;
            case 'fade-right':
                transform = `translateX(${-40 * (1 - progress)}px)`;
                break;
            case 'zoom-in':
                const scale = 0.8 + (0.2 * progress);
                transform = `scale(${scale})`;
                break;
            case 'zoom-out':
                const scaleOut = 1.2 - (0.2 * progress);
                transform = `scale(${scaleOut})`;
                break;
            case 'fade-in':
                transform = 'none';
                break;
            default:
                transform = `translateY(${40 * (1 - progress)}px)`;
        }
        
        element.style.opacity = opacity;
        element.style.transform = transform;
        
        // Adiciona classe quando animação está completa
        if (progress >= 0.9) {
            element.classList.add('aos-animate');
        } else {
            element.classList.remove('aos-animate');
        }
    }

    // Intersection Observer com múltiplos thresholds para animação progressiva
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            const element = entry.target;
            const animationType = element.getAttribute('data-aos') || 'fade-up';
            
            if (entry.isIntersecting) {
                // Calcula progresso baseado na posição do scroll
                const progress = calculateProgress(entry);
                applyAnimation(element, progress, animationType);
            } else {
                // Quando o elemento sai da viewport, reverte a animação
                if (!config.once) {
                    applyAnimation(element, 0, animationType);
                    element.classList.remove('aos-animate');
                }
            }
        });
    }, {
        threshold: config.threshold,
        rootMargin: config.rootMargin
    });

    // Observa todos os elementos
    elements.forEach(element => {
        // Inicializa elementos como invisíveis
        element.style.opacity = '0';
        const animationType = element.getAttribute('data-aos') || 'fade-up';
        
        // Aplica transform inicial baseado no tipo de animação
        switch(animationType) {
            case 'fade-up':
                element.style.transform = 'translateY(40px)';
                break;
            case 'fade-down':
                element.style.transform = 'translateY(-40px)';
                break;
            case 'fade-left':
                element.style.transform = 'translateX(40px)';
                break;
            case 'fade-right':
                element.style.transform = 'translateX(-40px)';
                break;
            case 'zoom-in':
                element.style.transform = 'scale(0.8)';
                break;
            case 'zoom-out':
                element.style.transform = 'scale(1.2)';
                break;
        }
        
        observer.observe(element);
    });

    // Handler de scroll para animação progressiva mais suave
    let ticking = false;
    function updateAnimations() {
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Verifica se o elemento está na viewport ou próximo dela
            if (rect.bottom >= -100 && rect.top <= windowHeight + 100) {
                const animationType = element.getAttribute('data-aos') || 'fade-up';
                const progress = calculateProgress({
                    boundingClientRect: rect,
                    isIntersecting: rect.bottom >= 0 && rect.top <= windowHeight
                });
                applyAnimation(element, progress, animationType);
            }
        });
        
        ticking = false;
    }

    // Throttle do scroll para performance (animação progressiva estilo Apple)
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    }, { passive: true });

    // Verifica elementos na carga inicial e após um pequeno delay
    function initAnimations() {
        updateAnimations();
        // Pequeno delay para garantir que o layout está pronto
        setTimeout(updateAnimations, 100);
    }
    
    if (document.readyState === 'complete') {
        initAnimations();
    } else {
        window.addEventListener('load', initAnimations);
        // Também verifica quando DOM está pronto
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            initAnimations();
        }
    }

    // Fallback para navegadores sem IntersectionObserver
    if (!window.IntersectionObserver) {
        function checkElements() {
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('aos-animate');
                    element.style.opacity = '1';
                    element.style.transform = 'none';
                } else if (!config.once) {
                    element.classList.remove('aos-animate');
                    element.style.opacity = '0';
                }
            });
        }

        window.addEventListener('scroll', checkElements, { passive: true });
        checkElements(); // Verifica no carregamento
    }

    // Handle resize com debounce
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            updateAnimations();
        }, 250);
    }, { passive: true });

})();

