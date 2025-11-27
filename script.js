// Variável para controlar se o modal deve abrir automaticamente após carregar
let shouldOpenModal = false;

// Função para carregar o conteúdo HTML dinamicamente
function loadHTML(file, elementId, callback) {
    const placeholder = document.getElementById(elementId);
    if (placeholder) {
        fetch(file)
            .then(response => response.text())
            .then(data => {
                placeholder.innerHTML = data;
                
                // Reinicializa comportamentos baseados no elemento carregado
                if (elementId === 'header-placeholder') {
                    initializeMenuAndLoginTrigger();
                } else if (elementId === 'login-placeholder') {
                    initializeModalBehavior();
                }

                // Executa callback extra se houver
                if (callback) callback();
            })
            .catch(error => {
                console.error("Erro ao carregar o conteúdo:", error);
            });
    }
}

// Inicializa o menu e o botão de "Login" do Header
function initializeMenuAndLoginTrigger() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    // Menu Mobile
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('open');
        });
    }

    // Botão "Login" no Header
    const openLoginBtn = document.getElementById('open-login');
    if (openLoginBtn) {
        openLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.querySelector('.modal');
            if (modal) {
                modal.style.display = 'block';
            } else {
                // Se o modal ainda não carregou, sinaliza para abrir assim que carregar
                shouldOpenModal = true;
            }
        });
    }
}

// Inicializa o comportamento do Modal (Fechar, Trocar entre Login/Register)
function initializeModalBehavior() {
    const modal = document.querySelector('.modal');
    const closeBtn = document.querySelector('.close-btn');

    // Se a flag estiver ativa, abre o modal imediatamente (útil na troca de telas)
    if (shouldOpenModal && modal) {
        modal.style.display = 'block';
        shouldOpenModal = false; // Reseta flag
    }

    // Botão de fechar (X)
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Fechar ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Lógica para trocar para CADASTRO
    const linkCadastro = document.getElementById('link-para-cadastro');
    if (linkCadastro) {
        linkCadastro.addEventListener('click', (e) => {
            e.preventDefault();
            shouldOpenModal = true; // Mantém modal aberto ao recarregar
            loadHTML('register.html', 'login-placeholder');
        });
    }

    // Lógica para trocar para LOGIN
    const linkLogin = document.getElementById('link-para-login');
    if (linkLogin) {
        linkLogin.addEventListener('click', (e) => {
            e.preventDefault();
            shouldOpenModal = true; // Mantém modal aberto ao recarregar
            loadHTML('login.html', 'login-placeholder');
        });
    }
}

// Carregamento inicial
document.addEventListener('DOMContentLoaded', () => {
    loadHTML('header.html', 'header-placeholder');
    loadHTML('login.html', 'login-placeholder');
});