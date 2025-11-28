let shouldOpenModal = false;

// Função para carregar HTML (Login ou Register) dentro da div placeholder
function loadHTML(file, elementId, callback) {
    const placeholder = document.getElementById(elementId);
    if (placeholder) {
        fetch(file)
            .then(response => response.text())
            .then(data => {
                placeholder.innerHTML = data;
                
                // Se carregamos o placeholder de login, inicia os comportamentos do modal
                if (elementId === 'login-placeholder') {
                    initializeModalBehavior();
                }

                if (callback) callback();
            })
            .catch(error => {
                console.error("Erro ao carregar conteúdo:", error);
            });
    }
}

// Configura os botões do Header
function initializeHeader() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('open');
        });
    }

    const openLoginBtn = document.getElementById('open-login');
    if (openLoginBtn) {
        openLoginBtn.addEventListener('click', (e) => {
            // Se o botão já foi alterado para "Logout" pelo index.html, este evento não roda
            // Se ainda for "Login", abre o modal
            if (openLoginBtn.innerText.includes("Login")) {
                e.preventDefault();
                const modal = document.querySelector('.modal');
                if (modal) {
                    modal.style.display = 'block';
                } else {
                    shouldOpenModal = true;
                }
            }
        });
    }
}

// Configura o Modal (Fechar e Trocar telas)
function initializeModalBehavior() {
    const modal = document.querySelector('.modal');
    const closeBtn = document.querySelector('.close-btn');

    if (shouldOpenModal && modal) {
        modal.style.display = 'block';
        shouldOpenModal = false;
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Trocar para Cadastro
    const linkCadastro = document.getElementById('link-para-cadastro');
    if (linkCadastro) {
        linkCadastro.addEventListener('click', (e) => {
            e.preventDefault();
            shouldOpenModal = true;
            loadHTML('register.html', 'login-placeholder');
        });
    }

    // Trocar para Login
    const linkLogin = document.getElementById('link-para-login');
    if (linkLogin) {
        linkLogin.addEventListener('click', (e) => {
            e.preventDefault();
            shouldOpenModal = true;
            loadHTML('login.html', 'login-placeholder');
        });
    }
}

// Carrega tudo ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o menu mobile direto
    initializeHeader();
    // Carrega o modal de login escondido
    loadHTML('login.html', 'login-placeholder');
});