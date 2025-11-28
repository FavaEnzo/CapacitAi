document.addEventListener('submit', async (event) => {
    // Garante que é o form de cadastro
    if (event.target && event.target.id === 'form-cadastro') {
        event.preventDefault();

        const nome = document.getElementById('reg-nome').value;
        const sobrenome = document.getElementById('reg-sobrenome').value;
        const email = document.getElementById('reg-email').value;
        const senha = document.getElementById('reg-senha').value;
        const confirmSenha = document.getElementById('reg-senha-confirm').value;

        // IDADE FIXA (Para o backend aceitar o cadastro)
        const idadeFixa = 18; 

        if (senha !== confirmSenha) {
            alert("As senhas não coincidem!");
            return; 
        }

        const userData = {
            nome,
            sobrenome,
            idade: idadeFixa, 
            email,
            senha
        };

        try {
            const response = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
                credentials: 'include'
            });

            const result = await response.json();

            if (response.ok) {
                alert('Cadastro realizado! Faça login.');
                // Simula clique para trocar pro login
                const link = document.getElementById('link-para-login');
                if(link) link.click();
            } else {
                alert(result.message || 'Erro ao cadastrar.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão com o servidor.');
        }
    }
});