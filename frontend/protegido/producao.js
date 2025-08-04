document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('tokenAdmin') || localStorage.getItem('tokenOperador');
  if (!token) {
    alert('Acesso não autorizado.');
    window.location.href = '../pagins/login.html';
    return;
  }

  const form = document.getElementById('formProducao');
  const lista = document.getElementById('listaProducoes');

  async function carregarProducoes() {
    const response = await fetch('http://localhost:3000/api/producao', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const producoes = await response.json();

    lista.innerHTML = '';
    producoes.forEach(p => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <strong>ID:</strong> ${p.id}<br>
        <strong>Produto ID:</strong> ${p.produto_id}<br>
        <strong>Quantidade:</strong> ${p.quantidade}<br>
        <strong>Data:</strong> ${new Date(p.data_producao).toLocaleDateString()}<br>
        <button onclick="editarProducao(${p.id}, ${p.produto_id}, ${p.quantidade}, '${p.data_producao}')">Editar</button>
        <button onclick="excluirProducao(${p.id})">Excluir</button>
      `;
      lista.appendChild(div);
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('producao_id').value;
    const produto_id = document.getElementById('produto_id').value;
    const quantidade = document.getElementById('quantidade').value;
    const data_producao = document.getElementById('data_producao').value;

    const producao = { produto_id, quantidade, data_producao };

    if (id) {
      await fetch(`http://localhost:3000/api/producao/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(producao)
      });
    } else {
      await fetch('http://localhost:3000/api/producao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(producao)
      });
    }

    form.reset();
    carregarProducoes();
  });

  window.editarProducao = (id, produto_id, quantidade, data) => {
    document.getElementById('producao_id').value = id;
    document.getElementById('produto_id').value = produto_id;
    document.getElementById('quantidade').value = quantidade;
    document.getElementById('data_producao').value = data.split('T')[0];
  };

  window.excluirProducao = async (id) => {
    if (!confirm('Deseja excluir esta produção?')) return;
    await fetch(`http://localhost:3000/api/producao/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    carregarProducoes();
  };

  carregarProducoes();
});
