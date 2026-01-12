/* ============================================
   Section Interactions - Mais Interatividade entre Seções
   ============================================ */

(function() {
    'use strict';

    // Configurações
    const config = {
        parallaxSpeed: 0.5,
        sectionSpacing: 100,
        enableParallax: true,
        enableSectionTransitions: true,
        enableBlur: false // Desabilitado por padrão - muito sutil se habilitado
    };

    // Seleciona todas as seções principais
    const sections = document.querySelectorAll('section[id]');
    const heroSection = document.querySelector('.hero');
    const welcomeBanner = document.querySelector('.welcome-banner');
    const sobreSection = document.querySelector('.sobre');
    const recursosSection = document.querySelector('.recursos');
    const estudeGratisSection = document.querySelector('.estude-gratis');
    const formSection = document.querySelector('.form-section');

    // ============================================
    // Parallax Effect no Hero
    // ============================================
    if (heroSection && config.enableParallax) {
        const heroBackground = heroSection.querySelector('.hero-background');
        const heroContent = heroSection.querySelector('.hero-content');
        
        function updateHeroParallax() {
            const scrollTop = window.pageYOffset;
            const heroRect = heroSection.getBoundingClientRect();
            const heroHeight = heroSection.offsetHeight;
            
            if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
                // Parallax no background
                if (heroBackground) {
                    const parallaxValue = scrollTop * config.parallaxSpeed;
                    heroBackground.style.transform = `translateY(${parallaxValue}px)`;
                }
                
                // Efeito de fade no conteúdo conforme scroll
                if (heroContent && scrollTop > 0) {
                    const opacity = Math.max(0, 1 - (scrollTop / heroHeight) * 1.5);
                    heroContent.style.opacity = opacity;
                }
            }
        }
        
        window.addEventListener('scroll', updateHeroParallax, { passive: true });
        updateHeroParallax();
    }

    // ============================================
    // Divisores Animados entre Seções
    // ============================================
    function createSectionDividers() {
        // Remove qualquer divisor existente entre hero e welcome-banner
        const heroSection = document.querySelector('.hero, #home');
        const welcomeBanner = document.querySelector('.welcome-banner');
        
        if (heroSection && welcomeBanner) {
            // Remove qualquer divisor entre eles
            const dividerBetween = heroSection.nextElementSibling;
            if (dividerBetween && dividerBetween.classList.contains('section-divider')) {
                dividerBetween.remove();
            }
        }
        
        sections.forEach((section, index) => {
            if (index < sections.length - 1) {
                const nextSection = sections[index + 1];
                const currentId = section.id || '';
                const currentClass = section.className || '';
                const nextId = nextSection.id || '';
                const nextClass = nextSection.className || '';
                
                // Não cria divisor entre hero e welcome-banner (devem estar juntos)
                const isHero = currentId === 'home' || currentClass.includes('hero');
                const isWelcomeBanner = nextClass.includes('welcome-banner');
                
                if (isHero && isWelcomeBanner) {
                    return; // Pula a criação do divisor
                }
                
                // Verifica se já existe um divisor antes de criar
                const existingDivider = section.nextElementSibling;
                if (existingDivider && existingDivider.classList.contains('section-divider')) {
                    return; // Já existe um divisor, não cria outro
                }
                
                // Cria um divisor visual entre seções
                const divider = document.createElement('div');
                divider.className = 'section-divider';
                divider.setAttribute('data-section-divider', '');
                
                // Insere após a seção atual
                section.insertAdjacentElement('afterend', divider);
            }
        });
    }

    // ============================================
    // Efeito de Scroll Progressivo nas Seções
    // ============================================
    function initSectionScrollProgress() {
        sections.forEach(section => {
            const sectionId = section.id;
            if (!sectionId) return;

            function updateSectionProgress() {
                const rect = section.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const sectionHeight = section.offsetHeight;
                
                // Calcula o progresso do scroll na seção (0 a 1)
                let progress = 0;
                
                if (rect.top < windowHeight && rect.bottom > 0) {
                    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
                    progress = visibleHeight / Math.min(sectionHeight, windowHeight);
                }
                
                // Aplica efeitos baseados no progresso
                section.style.setProperty('--scroll-progress', progress);
                
                // Adiciona classe quando a seção está visível
                if (progress > 0.1) {
                    section.classList.add('section-visible');
                } else {
                    section.classList.remove('section-visible');
                }
            }
            
            updateSectionProgress();
            window.addEventListener('scroll', updateSectionProgress, { passive: true });
        });
    }

    // ============================================
    // Efeitos Interativos nos Cards de Recursos
    // ============================================
    function initCardInteractions() {
        const cards = document.querySelectorAll('.recurso-card');
        
        cards.forEach((card, index) => {
            // Efeito de tilt no hover
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                card.style.transform = '';
            });
            
            // Animação sequencial ao entrar na viewport
            card.addEventListener('mouseenter', function() {
                card.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
        });
    }

    // ============================================
    // Efeito de Conectar Seções Visualmente
    // ============================================
    function initSectionConnections() {
        const sectionPairs = [
            { from: '.hero', to: '.welcome-banner' },
            { from: '.welcome-banner', to: '.sobre' },
            { from: '.sobre', to: '.recursos' },
            { from: '.recursos', to: '.estude-gratis' },
            { from: '.estude-gratis', to: '.form-section' }
        ];
        
        function updateConnections() {
            sectionPairs.forEach(pair => {
                const fromSection = document.querySelector(pair.from);
                const toSection = document.querySelector(pair.to);
                
                if (!fromSection || !toSection) return;
                
                const fromRect = fromSection.getBoundingClientRect();
                const toRect = toSection.getBoundingClientRect();
                const scrollTop = window.pageYOffset;
                
                // Calcula quando as seções estão próximas (mais sutil)
                const distance = Math.abs(toRect.top - fromRect.bottom);
                const maxDistance = window.innerHeight * 0.5; // Reduzido para ser mais próximo
                
                if (distance < maxDistance && toRect.top < window.innerHeight) {
                    // Reduz a intensidade máxima da conexão
                    const connectionStrength = (1 - (distance / maxDistance)) * 0.3; // Máximo 30% de opacidade
                    fromSection.style.setProperty('--connection-strength', connectionStrength);
                    toSection.style.setProperty('--connection-strength', connectionStrength);
                } else {
                    fromSection.style.setProperty('--connection-strength', 0);
                    toSection.style.setProperty('--connection-strength', 0);
                }
            });
        }
        
        window.addEventListener('scroll', updateConnections, { passive: true });
        updateConnections();
    }

    // ============================================
    // Efeito de Blur Progressivo entre Seções (mais sutil)
    // ============================================
    function initBlurTransition() {
        sections.forEach(section => {
            function updateBlur() {
                const rect = section.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const sectionTop = rect.top;
                
                // Aplica blur muito sutil apenas quando a seção está bem longe da viewport
                if (sectionTop < -200) {
                    // Blur máximo de apenas 1px, muito mais sutil
                    const blurAmount = Math.min(1, Math.abs(sectionTop) / 800);
                    section.style.filter = `blur(${blurAmount}px)`;
                    // Opacidade mínima de 0.8 ao invés de 0.3
                    section.style.opacity = Math.max(0.8, 1 - (Math.abs(sectionTop) / 2000));
                } else {
                    section.style.filter = '';
                    section.style.opacity = '';
                }
            }
            
            window.addEventListener('scroll', updateBlur, { passive: true });
        });
    }

    // ============================================
    // Animações de Entrada Sequencial
    // ============================================
    function initSequentialAnimations() {
        const benefitItems = document.querySelectorAll('.benefit-item');
        
        benefitItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('animate-on-scroll');
        });
    }

    // ============================================
    // Efeito de Background Dinâmico nas Seções
    // ============================================
    function initDynamicBackgrounds() {
        // Adiciona gradientes dinâmicos baseados no scroll
        sobreSection?.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, #000000 0%, #0a2540 100%)';
        });
        
        recursosSection?.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
        });
    }

    // ============================================
    // Inicialização
    // ============================================
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initializeAll();
            });
        } else {
            initializeAll();
        }
    }
    
    function initializeAll() {
        createSectionDividers();
        initSectionScrollProgress();
        initCardInteractions();
        initSectionConnections();
        initSequentialAnimations();
        initDynamicBackgrounds();
        
        // Blur desabilitado por padrão - pode ser habilitado se necessário
        if (config.enableBlur) {
            setTimeout(() => {
                initBlurTransition();
            }, 100);
        }
    }
    
    init();
    
    // Re-inicializa em resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initializeAll, 250);
    }, { passive: true });

})();

