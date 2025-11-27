// Função para carregar o conteúdo HTML dinamicamente
function loadHTML(file, elementId) {
    const placeholder = document.getElementById(elementId);
    if (placeholder) {
        fetch(file)
            .then(response => response.text())
            .then(data => {
                placeholder.innerHTML = data;
                if (elementId === 'header-placeholder') {
                    initializeMenuAndLoginToggle();
                } else if (elementId === 'login-placeholder') {
                    initializeLoginModalBehavior();
                }
            })
            .catch(error => {
                console.error("Erro ao carregar o conteúdo:", error);
                placeholder.innerHTML = `<p style="color: red;">Erro ao carregar o conteúdo de ${file}</p>`;
            });
    }
}

// Função para inicializar o menu e o comportamento do modal
function initializeMenuAndLoginToggle() {
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
            e.preventDefault();
            const loginModal = document.getElementById('login-modal');
            if (loginModal) {
                loginModal.style.display = 'block';
            }
        });
    }
}

function initializeLoginModalBehavior() {
    const loginModal = document.getElementById('login-modal');
    const closeLoginBtn = document.querySelector('.modal-content .close-btn');

    if (loginModal && closeLoginBtn) {
        closeLoginBtn.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
            }
        });
    }
}

// Carregar o conteúdo dinâmico do cabeçalho e do modal de login
loadHTML('header.html', 'header-placeholder');
loadHTML('login.html', 'login-placeholder');
