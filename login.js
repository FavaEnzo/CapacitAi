document.addEventListener('submit', async (event) => {
    if (event.target && event.target.id === 'form-login') {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
                credentials: 'include' // Essencial para salvar o cookie
            });

            const result = await response.json();

            if (response.ok) {
                alert('Login realizado com sucesso!');
                window.location.href = 'home.html'; 
            } else {
                alert(result.message || 'Erro ao logar.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão.');
        }
    }
});