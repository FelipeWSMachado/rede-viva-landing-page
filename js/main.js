/* ============================================
   Main JavaScript
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = menuToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    }

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // ============================================
    // Header Scroll Effect
    // ============================================
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty hash
            if (href === '#') {
                return;
            }

            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Form Sanitization & Validation
    // ============================================
    
    /**
     * Sanitiza e valida dados do formulário
     */
    const FormSanitizer = {
        // Remove caracteres perigosos e HTML tags
        sanitizeString: function(str) {
            if (!str || typeof str !== 'string') return '';
            
            return str
                .trim()
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .replace(/[<>\"']/g, '') // Remove caracteres perigosos
                .replace(/\s+/g, ' ') // Normaliza espaços
                .substring(0, 255); // Limita tamanho
        },

        // Sanitiza nome próprio
        sanitizeName: function(name) {
            if (!name) return '';
            
            let sanitized = this.sanitizeString(name);
            
            // Capitaliza primeira letra de cada palavra
            sanitized = sanitized.toLowerCase().replace(/\b\w/g, function(char) {
                return char.toUpperCase();
            });
            
            // Remove números e caracteres especiais (exceto espaços e hífens)
            sanitized = sanitized.replace(/[^a-zA-ZÀ-ÿ\s\-]/g, '');
            
            return sanitized.trim();
        },

        // Sanitiza e valida email
        sanitizeEmail: function(email) {
            if (!email) return '';
            
            let sanitized = email.trim().toLowerCase();
            
            // Remove caracteres perigosos mas mantém formato de email
            sanitized = sanitized.replace(/[<>\"']/g, '');
            
            // Valida formato básico de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(sanitized)) {
                return null; // Email inválido
            }
            
            return sanitized;
        },

        // Sanitiza telefone brasileiro
        sanitizePhone: function(phone) {
            if (!phone) return '';
            
            // Remove tudo exceto números
            let sanitized = phone.replace(/\D/g, '');
            
            // Valida formato brasileiro (10 ou 11 dígitos)
            if (sanitized.length < 10 || sanitized.length > 11) {
                return null; // Telefone inválido
            }
            
            // Formata para padrão brasileiro
            if (sanitized.length === 10) {
                sanitized = sanitized.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else {
                sanitized = sanitized.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }
            
            return sanitized;
        },

        // Sanitiza texto genérico (igreja)
        sanitizeText: function(text) {
            if (!text) return '';
            
            let sanitized = this.sanitizeString(text);
            
            // Capitaliza primeira letra
            sanitized = sanitized.charAt(0).toUpperCase() + sanitized.slice(1).toLowerCase();
            
            return sanitized;
        },

        // Sanitiza estado (select)
        sanitizeEstado: function(estado) {
            if (!estado) return '';
            
            // Valida sigla do estado (2 letras maiúsculas)
            const estadoRegex = /^[A-Z]{2}$/;
            if (!estadoRegex.test(estado)) {
                return null;
            }
            
            return estado.toUpperCase();
        },

        // Sanitiza cidade (select)
        sanitizeCidade: function(cidade) {
            if (!cidade) return '';
            
            // Remove HTML e caracteres perigosos
            let sanitized = this.sanitizeString(cidade);
            
            // Capitaliza primeira letra de cada palavra
            sanitized = sanitized.toLowerCase().replace(/\b\w/g, function(char) {
                return char.toUpperCase();
            });
            
            return sanitized;
        },

        // Valida tipo (select)
        validateType: function(type) {
            const validTypes = ['nao', 'lider', 'pastor'];
            return validTypes.includes(type) ? type : null;
        },

        // Valida captcha
        validateCaptcha: function(captcha) {
            const value = captcha.trim();
            return value === '2' || value === '2.0' || parseInt(value) === 2;
        }
    };

    // ============================================
    // Notification System (definido antes para uso em outras funções)
    // ============================================
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Styles
        const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            font-size: 14px;
            line-height: 1.5;
        `;

        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(function() {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // Estados e Cidades - API IBGE
    // ============================================
    const estadoSelect = document.getElementById('estado');
    const cidadeSelect = document.getElementById('cidade');

    // Lista de estados brasileiros (fallback caso API falhe)
    const estadosBrasil = [
        { id: 12, sigla: 'AC', nome: 'Acre' },
        { id: 27, sigla: 'AL', nome: 'Alagoas' },
        { id: 16, sigla: 'AP', nome: 'Amapá' },
        { id: 13, sigla: 'AM', nome: 'Amazonas' },
        { id: 29, sigla: 'BA', nome: 'Bahia' },
        { id: 23, sigla: 'CE', nome: 'Ceará' },
        { id: 53, sigla: 'DF', nome: 'Distrito Federal' },
        { id: 32, sigla: 'ES', nome: 'Espírito Santo' },
        { id: 52, sigla: 'GO', nome: 'Goiás' },
        { id: 21, sigla: 'MA', nome: 'Maranhão' },
        { id: 51, sigla: 'MT', nome: 'Mato Grosso' },
        { id: 50, sigla: 'MS', nome: 'Mato Grosso do Sul' },
        { id: 31, sigla: 'MG', nome: 'Minas Gerais' },
        { id: 15, sigla: 'PA', nome: 'Pará' },
        { id: 25, sigla: 'PB', nome: 'Paraíba' },
        { id: 41, sigla: 'PR', nome: 'Paraná' },
        { id: 26, sigla: 'PE', nome: 'Pernambuco' },
        { id: 22, sigla: 'PI', nome: 'Piauí' },
        { id: 33, sigla: 'RJ', nome: 'Rio de Janeiro' },
        { id: 24, sigla: 'RN', nome: 'Rio Grande do Norte' },
        { id: 43, sigla: 'RS', nome: 'Rio Grande do Sul' },
        { id: 11, sigla: 'RO', nome: 'Rondônia' },
        { id: 14, sigla: 'RR', nome: 'Roraima' },
        { id: 42, sigla: 'SC', nome: 'Santa Catarina' },
        { id: 35, sigla: 'SP', nome: 'São Paulo' },
        { id: 28, sigla: 'SE', nome: 'Sergipe' },
        { id: 17, sigla: 'TO', nome: 'Tocantins' }
    ];

    // Carregar estados ao carregar a página
    function loadEstados() {
        if (!estadoSelect) return;

        // Mostra estado de carregamento
        estadoSelect.innerHTML = '<option value="">Carregando estados...</option>';
        estadoSelect.disabled = true;

        // Tenta buscar da API do IBGE
        fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na resposta da API');
                }
                return response.json();
            })
            .then(estados => {
                estadoSelect.innerHTML = '<option value="">Selecione o estado</option>';
                
                estados.forEach(estado => {
                    const option = document.createElement('option');
                    option.value = estado.sigla;
                    option.textContent = estado.nome;
                    option.dataset.id = estado.id;
                    estadoSelect.appendChild(option);
                });

                estadoSelect.disabled = false;
            })
            .catch(error => {
                console.warn('Erro ao carregar estados da API, usando lista local:', error);
                // Fallback para lista local
                estadoSelect.innerHTML = '<option value="">Selecione o estado</option>';
                
                estadosBrasil.forEach(estado => {
                    const option = document.createElement('option');
                    option.value = estado.sigla;
                    option.textContent = estado.nome;
                    option.dataset.id = estado.id;
                    estadoSelect.appendChild(option);
                });

                estadoSelect.disabled = false;
            });
    }

    // Carregar cidades quando estado for selecionado
    function loadCidades(estadoId) {
        if (!cidadeSelect) return;

        // Limpa cidades anteriores
        cidadeSelect.innerHTML = '<option value="">Carregando cidades...</option>';
        cidadeSelect.disabled = true;

        // Busca cidades da API do IBGE
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios?orderBy=nome`)
            .then(response => response.json())
            .then(cidades => {
                cidadeSelect.innerHTML = '<option value="">Selecione a cidade</option>';
                
                cidades.forEach(cidade => {
                    const option = document.createElement('option');
                    option.value = cidade.nome;
                    option.textContent = cidade.nome;
                    cidadeSelect.appendChild(option);
                });

                cidadeSelect.disabled = false;
            })
            .catch(error => {
                console.error('Erro ao carregar cidades:', error);
                cidadeSelect.innerHTML = '<option value="">Erro ao carregar cidades</option>';
                showNotification('Erro ao carregar cidades. Tente novamente.', 'error');
            });
    }

    // Event listener para mudança de estado
    if (estadoSelect) {
        estadoSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const estadoId = selectedOption.dataset.id;
            
            if (estadoId) {
                loadCidades(estadoId);
            } else {
                cidadeSelect.innerHTML = '<option value="">Primeiro selecione o estado</option>';
                cidadeSelect.disabled = true;
            }
        });
    }

    // ============================================
    // Form Validation & Submission
    // ============================================
    const registrationForm = document.getElementById('registrationForm');

    // Phone mask
    const celularInput = document.getElementById('celular');
    if (celularInput) {
        celularInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
                e.target.value = value;
            }
        });
    }

    // ============================================
    // Multi-Step Form Navigation
    // ============================================
    let currentStep = 1;
    const totalSteps = 3;
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLines = document.querySelectorAll('.progress-line');
    const nextButtons = document.querySelectorAll('.btn-next');
    const backButtons = document.querySelectorAll('.btn-back');

    // Function to validate step
    function validateStep(step) {
        const stepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        if (!stepElement) return false;

        const inputs = stepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;
        const errors = [];

        inputs.forEach(function(input) {
            const errorSpan = input.closest('.form-group').querySelector('.field-error');
            
            // Skip disabled inputs
            if (input.disabled) {
                input.classList.remove('error');
                if (errorSpan) errorSpan.classList.remove('show');
                return;
            }

            // Remove previous states
            input.classList.remove('error', 'success');
            if (errorSpan) errorSpan.classList.remove('show');

            // Validate based on field type
            let fieldValid = true;
            let errorMessage = '';

            if (input.type === 'email') {
                const email = FormSanitizer.sanitizeEmail(input.value);
                if (!email) {
                    fieldValid = false;
                    errorMessage = 'Email inválido';
                }
            } else if (input.type === 'tel') {
                const phone = FormSanitizer.sanitizePhone(input.value);
                if (!phone) {
                    fieldValid = false;
                    errorMessage = 'Telefone inválido';
                }
            } else if (input.type === 'text') {
                if (input.id === 'nome') {
                    const name = FormSanitizer.sanitizeName(input.value);
                    if (!name || name.length < 3) {
                        fieldValid = false;
                        errorMessage = 'Nome deve ter pelo menos 3 caracteres';
                    }
                } else if (input.id === 'igreja') {
                    const igreja = FormSanitizer.sanitizeText(input.value);
                    if (!igreja || igreja.length < 2) {
                        fieldValid = false;
                        errorMessage = 'Nome da igreja inválido';
                    }
                }
            } else if (input.tagName === 'SELECT') {
                if (input.id === 'tipo') {
                    const tipo = FormSanitizer.validateType(input.value);
                    if (!tipo) {
                        fieldValid = false;
                        errorMessage = 'Selecione uma opção válida';
                    }
                } else if (input.id === 'estado') {
                    const estado = FormSanitizer.sanitizeEstado(input.value);
                    if (!estado) {
                        fieldValid = false;
                        errorMessage = 'Selecione um estado válido';
                    }
                } else if (input.id === 'cidade') {
                    const cidade = FormSanitizer.sanitizeCidade(input.value);
                    if (!cidade || cidade.length < 2) {
                        fieldValid = false;
                        errorMessage = 'Selecione uma cidade válida';
                    }
                }
            } else if (!input.value.trim()) {
                fieldValid = false;
                errorMessage = 'Este campo é obrigatório';
            }

            if (!fieldValid) {
                isValid = false;
                input.classList.add('error');
                if (errorSpan) {
                    errorSpan.textContent = errorMessage;
                    errorSpan.classList.add('show');
                }
            } else {
                input.classList.add('success');
            }
        });

        // Special validation for step 3 (ALTCHA)
        if (step === 3) {
            const altchaWidget = document.getElementById('altcha-widget');
            if (altchaWidget) {
                // Check if ALTCHA is verified by checking the hidden input value
                const formData = new FormData(registrationForm);
                const altchaValue = formData.get('altcha');
                const isVerified = altchaWidget.getAttribute('data-verified') === 'true' || altchaValue;
                
                if (!isVerified) {
                    isValid = false;
                    const errorSpan = altchaWidget.closest('.form-group').querySelector('.field-error');
                    if (errorSpan) {
                        errorSpan.textContent = 'Por favor, complete a verificação de segurança';
                        errorSpan.classList.add('show');
                    }
                } else {
                    const errorSpan = altchaWidget.closest('.form-group').querySelector('.field-error');
                    if (errorSpan) {
                        errorSpan.classList.remove('show');
                    }
                }
            }
        }

        return isValid;
    }

    // Function to show step
    function showStep(step) {
        // Hide all steps
        formSteps.forEach(function(stepEl) {
            stepEl.classList.remove('active');
        });

        // Show current step
        const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }

        // Update progress indicator
        progressSteps.forEach(function(progressStep, index) {
            const stepNum = index + 1;
            progressStep.classList.remove('active', 'completed');
            
            if (stepNum < step) {
                progressStep.classList.add('completed');
            } else if (stepNum === step) {
                progressStep.classList.add('active');
            }
        });

        // Update progress lines
        progressLines.forEach(function(line, index) {
            line.classList.remove('completed');
            if (index + 1 < step) {
                line.classList.add('completed');
            }
        });

        currentStep = step;
    }

    // Next button handlers
    nextButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                if (currentStep < totalSteps) {
                    showStep(currentStep + 1);
                }
            }
        });
    });

    // Back button handlers
    backButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (currentStep > 1) {
                showStep(currentStep - 1);
            }
        });
    });

    // Initialize first step
    if (formSteps.length > 0) {
        showStep(1);
    }

    // ALTCHA verification handler
    const altchaWidget = document.getElementById('altcha-widget');
    if (altchaWidget) {
        // Listen for ALTCHA verification
        altchaWidget.addEventListener('verify', function(event) {
            if (event.detail && event.detail.verified) {
                altchaWidget.setAttribute('data-verified', 'true');
                const errorSpan = altchaWidget.closest('.form-group').querySelector('.field-error');
                if (errorSpan) {
                    errorSpan.classList.remove('show');
                }
            }
        });

        // Also check on form submission
        altchaWidget.addEventListener('change', function() {
            const formData = new FormData(registrationForm);
            const altchaValue = formData.get('altcha');
            if (altchaValue) {
                altchaWidget.setAttribute('data-verified', 'true');
            }
        });
    }

    // Form submission
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Coleta dados brutos do formulário
            const formData = new FormData(registrationForm);
            const rawData = Object.fromEntries(formData);

            // Sanitiza e valida todos os campos
            const sanitizedData = {
                nome: FormSanitizer.sanitizeName(rawData.nome),
                email: FormSanitizer.sanitizeEmail(rawData.email),
                celular: FormSanitizer.sanitizePhone(rawData.celular),
                tipo: FormSanitizer.validateType(rawData.tipo),
                igreja: FormSanitizer.sanitizeText(rawData.igreja),
                estado: FormSanitizer.sanitizeEstado(rawData.estado),
                cidade: FormSanitizer.sanitizeCidade(rawData.cidade)
            };

            // Validação final
            let hasErrors = false;
            const errors = [];

            if (!sanitizedData.nome || sanitizedData.nome.length < 3) {
                errors.push('Nome deve ter pelo menos 3 caracteres');
                hasErrors = true;
            }

            if (!sanitizedData.email) {
                errors.push('Email inválido');
                hasErrors = true;
            }

            if (!sanitizedData.celular) {
                errors.push('Telefone inválido');
                hasErrors = true;
            }

            if (!sanitizedData.tipo) {
                errors.push('Selecione uma opção válida');
                hasErrors = true;
            }

            if (!sanitizedData.igreja || sanitizedData.igreja.length < 2) {
                errors.push('Nome da igreja inválido');
                hasErrors = true;
            }

            if (!sanitizedData.estado) {
                errors.push('Selecione um estado válido');
                hasErrors = true;
            }

            if (!sanitizedData.cidade || sanitizedData.cidade.length < 2) {
                errors.push('Selecione uma cidade válida');
                hasErrors = true;
            }

            // Validate ALTCHA
            const altchaWidget = document.getElementById('altcha-widget');
            const formDataForAltcha = new FormData(registrationForm);
            const altchaValue = formDataForAltcha.get('altcha');
            const isAltchaVerified = altchaWidget && (altchaWidget.getAttribute('data-verified') === 'true' || altchaValue);
            
            if (!isAltchaVerified) {
                errors.push('Por favor, complete a verificação de segurança');
                hasErrors = true;
                // Show step 3 if not visible
                if (currentStep !== 3) {
                    showStep(3);
                }
                const errorSpan = altchaWidget ? altchaWidget.closest('.form-group').querySelector('.field-error') : null;
                if (errorSpan) {
                    errorSpan.textContent = 'Por favor, complete a verificação de segurança';
                    errorSpan.classList.add('show');
                }
            }

            // Se houver erros, exibe notificação
            if (hasErrors) {
                showNotification('Por favor, corrija os erros no formulário: ' + errors.join(', '), 'error');
                return;
            }

            // ALTCHA is validated separately, not sent to API

            // Show loading state
            const submitButton = registrationForm.querySelector('.btn-submit');
            const originalText = submitButton.textContent;
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            // ============================================
            // API CALL - Substitua esta função pela sua API
            // ============================================
            async function submitToAPI(data) {
                try {
                    // EXEMPLO: Substitua pela URL da sua API
                    // const response = await fetch('https://api.exemplo.com/cadastro', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //     },
                    //     body: JSON.stringify(data)
                    // });
                    
                    // if (!response.ok) {
                    //     throw new Error('Erro ao enviar dados');
                    // }
                    
                    // const result = await response.json();
                    // return result;

                    // SIMULAÇÃO (remover quando integrar API real)
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve({ success: true, message: 'Cadastro realizado com sucesso!' });
                        }, 1500);
                    });
                } catch (error) {
                    throw new Error('Erro ao processar cadastro: ' + error.message);
                }
            }

            // Envia dados sanitizados
            submitToAPI(sanitizedData)
                .then(function(result) {
                    // Reset form
                    registrationForm.reset();
                    
                    // Reset ALTCHA
                    if (altchaWidget) {
                        altchaWidget.removeAttribute('data-verified');
                        // Reset ALTCHA widget if it has a reset method
                        if (altchaWidget.reset) {
                            altchaWidget.reset();
                        }
                    }
                    
                    // Reset to step 1
                    showStep(1);
                    
                    // Show success message
                    showNotification('Cadastro realizado com sucesso! Em breve você receberá um email com as instruções.', 'success');
                    
                    // Reset button
                    submitButton.classList.remove('loading');
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;

                    // Log dados sanitizados (remover em produção)
                    console.log('Dados sanitizados enviados:', sanitizedData);
                })
                .catch(function(error) {
                    // Show error message
                    showNotification(error.message || 'Erro ao processar cadastro. Tente novamente.', 'error');
                    
                    // Reset button
                    submitButton.classList.remove('loading');
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                });
        });
    }


    // ============================================
    // GIF Speed Control
    // ============================================
    function controlGifSpeed() {
        const gifImage = document.querySelector('.hero-image[src$=".gif"]');
        if (!gifImage) return;

        // Função para ajustar velocidade do GIF
        // Nota: Para mudanças significativas, é melhor reprocessar o GIF
        // Este método funciona melhor para ajustes sutis usando múltiplas versões
        
        // Opção 1: Trocar entre diferentes versões do GIF (se existirem)
        // hero-background-slow.gif, hero-background-normal.gif, hero-background-fast.gif
        
        // Opção 2: Usar CSS para criar efeito de velocidade (limitado)
        // A velocidade real do GIF não pode ser alterada via CSS/JS diretamente
        // Mas podemos criar um sistema para trocar entre versões pré-processadas
        
        // Exemplo de uso:
        // setGifSpeed('slow');   // 0.5x velocidade
        // setGifSpeed('normal'); // 1x velocidade (padrão)
        // setGifSpeed('fast');   // 2x velocidade
    }

    // Função para definir velocidade do GIF
    function setGifSpeed(speed) {
        const gifImage = document.querySelector('.hero-image[src$=".gif"]');
        if (!gifImage) return;

        const basePath = 'assets/images/hero-background';
        const speedMap = {
            'slow': basePath + '-slow.gif',
            'normal': basePath + '.gif',
            'fast': basePath + '-fast.gif'
        };

        // Se existir versão com velocidade específica, usa ela
        if (speedMap[speed]) {
            // Verifica se o arquivo existe antes de trocar
            const img = new Image();
            img.onload = function() {
                gifImage.src = speedMap[speed];
            };
            img.onerror = function() {
                console.log('Versão do GIF não encontrada:', speedMap[speed]);
            };
            img.src = speedMap[speed];
        }
    }

    // Expor função globalmente (opcional, para uso no console)
    window.setGifSpeed = setGifSpeed;

    // ============================================
    // Update Copyright Year Automatically
    // ============================================
    function updateCopyrightYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            const currentYear = new Date().getFullYear();
            yearElement.textContent = currentYear;
        }
    }

    // ============================================
    // Initialize on DOM Load
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        // Add fade-in animation to body
        document.body.style.opacity = '0';
        setTimeout(function() {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);

        // Initialize GIF speed control
        controlGifSpeed();

        // Update copyright year
        updateCopyrightYear();

        // Load estados
        loadEstados();
    });

})();

