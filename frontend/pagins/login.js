document.addEventListener('DOMContentLoaded', () => {
  const botaoEntrar = document.querySelector('.buton');

  botaoEntrar.addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      const resposta = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const resultado = await resposta.json();

      if (resposta.ok) {
        const { token, usuario } = resultado;

        if (usuario.role === 'admin') {
          localStorage.setItem('tokenAdmin', token);
        } else {
          localStorage.setItem('tokenCliente', token);
        }

        window.location.href = './home.html'; // Redireciona todos para home
      } else {
        alert(resultado.mensagem || resultado.erro || 'Falha no login');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor');
      console.error(error);
    }
  });
});
