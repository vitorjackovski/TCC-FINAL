document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('tokenAdmin');
  if (!token) {
    alert('Acesso não autorizado.');
    window.location.href = '../pagins/login.html';
    return;
  }

  const form = document.getElementById('formProduto');
  const container = document.getElementById('tabelaProdutos');
  const selectArmazem = document.getElementById('armazem_id');

  async function carregarArmazens() {
    try {
      const resposta = await fetch('http://localhost:3000/api/armazens', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const armazens = await resposta.json();
      selectArmazem.innerHTML = '<option value="">Selecione um Armazém</option>';

      armazens.forEach(a => {
        const option = document.createElement('option');
        option.value = a.id;
        option.textContent = `${a.nome} (${a.localizacao})`;
        selectArmazem.appendChild(option);
      });
    } catch (err) {
      console.error('Erro ao carregar armazéns:', err);
    }
  }

  async function carregarProdutos() {
    try {
      const resposta = await fetch('http://localhost:3000/api/produtos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const produtos = await resposta.json();

      container.innerHTML = '';
      produtos.forEach(prod => {
        const card = document.createElement('div');
        card.classList.add('card-produto');

        card.innerHTML = `
          <h3>${prod.nome}</h3>
          <p><strong>Descrição:</strong> ${prod.descricao}</p>
          <p><strong>Linha de Produção:</strong> ${prod.linha_producao}</p>
          <div class="botoes">
            <button class="editar" onclick="editar(${prod.id}, '${prod.nome}', '${prod.descricao}', '${prod.linha_producao}', ${prod.id_armazem})">Editar</button>
            <button class="excluir" onclick="excluir(${prod.id})">Excluir</button>
          </div>
        `;

        container.appendChild(card);
      });
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('produto_id').value;
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const linha_producao = document.getElementById('linha_producao').value;
    const armazem_id = selectArmazem.value;

    const dados = { nome, descricao, linha_producao, id_armazem: armazem_id };

    const url = id
      ? `http://localhost:3000/api/produtos/${id}`
      : `http://localhost:3000/api/produtos`;

    const metodo = id ? 'PUT' : 'POST';

    await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(dados)
    });

    form.reset();
    document.getElementById('produto_id').value = '';
    carregarProdutos();
  });

  window.editar = (id, nome, descricao, linha_producao, armazem_id) => {
    document.getElementById('produto_id').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('descricao').value = descricao;
    document.getElementById('linha_producao').value = linha_producao;
    document.getElementById('armazem_id').value = armazem_id;
  };

  window.excluir = async (id) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await fetch(`http://localhost:3000/api/produtos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      carregarProdutos();
    }
  };

  carregarArmazens();
  carregarProdutos();
});
