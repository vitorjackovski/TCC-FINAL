document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = form.nome.value.trim();
    const sobrenome = form.sobrenome.value.trim();
    const email = form.email.value.trim();
    const senha = form.senha.value;
    const aceito = form.aceito.checked;

    if (!aceito) {
      alert('Você precisa aceitar os termos para continuar.');
      return;
    }

    const nomeCompleto = nome + ' ' + sobrenome;

    const dados = {
      nome: nomeCompleto,
      email,
      senha,
      role: 'cliente'  // Ajuste se quiser outro role
    };

    // Pega o token salvo no localStorage
    const tokenAdmin = localStorage.getItem('tokenAdmin'); // Ajuste se sua chave for diferente

    if (!tokenAdmin) {
      alert('Você precisa estar logado como administrador para cadastrar usuários.');
      return;
    }

    try {
      const resposta = await fetch('http://localhost:3000/api/usuarios/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenAdmin}`
        },
        body: JSON.stringify(dados)
      });

      if (resposta.ok) {
        const resultado = await resposta.json();
        alert('Cadastro realizado com sucesso! Bem-vindo, ' + resultado.nome);
        form.reset();
        window.location.href = './login.html'; // Ou outra página após cadastro
      } else {
        const erro = await resposta.json();
        alert('Erro ao cadastrar: ' + (erro.mensagem || erro.erro || 'Erro desconhecido'));
      }
    } catch (error) {
      alert('Erro de conexão: ' + error.message);
    }
  });
});
