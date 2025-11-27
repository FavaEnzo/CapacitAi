document.addEventListener('DOMContentLoaded', () => {
    // 1. Funcionalidade do Menu Hamburguer (para mobile)

    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            // Alterna a classe 'open' na tag <nav>
            nav.classList.toggle('open');
            
            // Alterna o ícone entre '☰' e '✕' (opcional)
            if (nav.classList.contains('open')) {
                menuToggle.textContent = '✕';
                menuToggle.setAttribute('aria-label', 'Fechar Menu');
            } else {
                menuToggle.textContent = '☰';
                menuToggle.setAttribute('aria-label', 'Abrir Menu');
            }
        });

        // 2. Fechar o menu ao clicar em um link (para uma melhor experiência mobile)
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('open')) {
                    nav.classList.remove('open');
                    menuToggle.textContent = '☰';
                    menuToggle.setAttribute('aria-label', 'Abrir Menu');
                }
            });
        });
    }

    // Você poderia adicionar mais funcionalidades aqui, como:
    // - Validação de Formulários
    // - Carrosséis de Imagens
    // - Animações de Scroll
});