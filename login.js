document.addEventListener('submit', async (event) => {
    if (event.target && event.target.id === 'form-login') {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        try {
            const response = await fetch('https://capacitai.onrender.com/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
                credentials: 'include' 
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