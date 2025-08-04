document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('tokenAdmin');
  if (!token) {
    alert('Acesso não autorizado. Apenas administradores podem acessar esta página, faça login como administrador e acesse esta pagina.');
    window.location.href = '../pagins/login.html';
    return;
  }

  const form = document.getElementById('formAlerta');
  const lista = document.getElementById('listaAlertas');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const mensagem = document.getElementById('mensagem').value;
    const tipo = document.getElementById('tipo').value;
    const alertaId = form.dataset.editando;

    const url = alertaId
      ? `http://localhost:3000/api/alertas/${alertaId}`
      : 'http://localhost:3000/api/alertas';

    const method = alertaId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, mensagem, tipo })
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.erro || 'Erro ao salvar alerta.');
      }

      alert(alertaId ? 'Alerta atualizado com sucesso.' : 'Alerta criado com sucesso.');
      form.reset();
      delete form.dataset.editando;
      carregarAlertas();
    } catch (err) {
      alert('Erro: ' + err.message);
      console.error(err);
    }
  });

  async function carregarAlertas() {
    try {
      const res = await fetch('http://localhost:3000/api/alertas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error('Formato de dados inválido');
      }

      lista.innerHTML = '';
      data.forEach(mostrarAlerta);
    } catch (err) {
      console.error('Erro ao carregar alertas:', err);
    }
  }

  function mostrarAlerta(alerta) {
    const div = document.createElement('div');
    div.classList.add('card-alerta');

    if (alerta.tipo === 'info') {
      div.classList.add('tipo-info');
    } else if (alerta.tipo === 'aviso') {
      div.classList.add('tipo-aviso');
    } else if (alerta.tipo === 'alerta') {
      div.classList.add('tipo-alerta');
    }

    div.innerHTML = `
      <h3>${alerta.titulo}</h3>
      <p>${alerta.mensagem}</p>
      <div class="tipo">Tipo: ${alerta.tipo}</div>
      <div class="tipo">Criado em: ${new Date(alerta.criado_em).toLocaleString()}</div>
      <div class="botoes">
        <button class="btn-editar">Editar</button>
        <button class="btn-excluir">Excluir</button>
      </div>
    `;

    // Botões
    const btnEditar = div.querySelector('.btn-editar');
    const btnExcluir = div.querySelector('.btn-excluir');

    // Excluir
    btnExcluir.addEventListener('click', async () => {
      if (confirm('Tem certeza que deseja excluir este alerta?')) {
        try {
          const res = await fetch(`http://localhost:3000/api/alertas/${alerta.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!res.ok) throw new Error('Erro ao excluir');

          alert('Alerta excluído com sucesso.');
          carregarAlertas();
        } catch (err) {
          console.error(err);
          alert('Erro ao excluir alerta.');
        }
      }
    });

    // Editar
    btnEditar.addEventListener('click', () => {
      document.getElementById('titulo').value = alerta.titulo;
      document.getElementById('mensagem').value = alerta.mensagem;
      document.getElementById('tipo').value = alerta.tipo;
      form.dataset.editando = alerta.id;
    });

    lista.appendChild(div);
  }

  carregarAlertas();
});
