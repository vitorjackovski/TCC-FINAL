document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('tokenAdmin');
  if (!token) {
    alert('Acesso não autorizado.');
    window.location.href = '../pagins/login.html';
    return;
  }

  const form = document.getElementById('formArmazem');
  const lista = document.getElementById('listaArmazens');

  async function carregarProdutosDoArmazem(idArmazem) {
    const container = document.getElementById(`produtos-${idArmazem}`);
    try {
      const resposta = await fetch(`http://localhost:3000/api/armazens/${idArmazem}/produtos`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!resposta.ok) throw new Error('Erro ao buscar produtos');

      const produtos = await resposta.json();

      if (produtos.length === 0) {
        container.innerHTML = '<p><em>Nenhum produto neste armazém.</em></p>';
        return;
      }

      const listaProdutos = produtos.map(prod => `
        <li>${prod.nome} - ${prod.descricao}</li>
      `).join('');

      container.innerHTML = `
        <p><strong>Produtos Armazenados:</strong></p>
        <ul>${listaProdutos}</ul>
      `;
    } catch (erro) {
      container.innerHTML = `<p style="color: red;">Erro ao carregar produtos</p>`;
      console.error(erro);
    }
  }

  async function carregarArmazens() {
    const resposta = await fetch('http://localhost:3000/api/armazens', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const armazens = await resposta.json();

    lista.innerHTML = '';
    armazens.forEach(armazem => {
      const div = document.createElement('div');
      div.className = 'cartao';
      div.innerHTML = `
        <h3>${armazem.nome}</h3>
        <p><strong>Localização:</strong> ${armazem.localizacao}</p>
        <p><strong>Capacidade:</strong> ${armazem.capacidade}</p>
        <div class="produtos-armazem" id="produtos-${armazem.id}">
          <em>Carregando produtos...</em>
        </div>
        <div class="botoes">
          <button onclick="editar(${armazem.id}, '${armazem.nome}', '${armazem.localizacao}', ${armazem.capacidade})">Editar</button>
          <button class="excluir" onclick="excluir(${armazem.id})">Excluir</button>
        </div>
      `;
      lista.appendChild(div);

      carregarProdutosDoArmazem(armazem.id);
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('armazem_id').value;
    const nome = document.getElementById('nome').value;
    const localizacao = document.getElementById('localizacao').value;
    const capacidade = document.getElementById('capacidade').value;

    const dados = { nome, localizacao, capacidade };

    if (id) {
      await fetch(`http://localhost:3000/api/armazens/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dados)
      });
    } else {
      await fetch('http://localhost:3000/api/armazens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dados)
      });
    }

    form.reset();
    document.getElementById('armazem_id').value = '';
    carregarArmazens();
  });

  window.editar = (id, nome, localizacao, capacidade) => {
    document.getElementById('armazem_id').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('localizacao').value = localizacao;
    document.getElementById('capacidade').value = capacidade;
  };

  window.excluir = async (id) => {
    if (confirm('Tem certeza que deseja excluir este armazém?')) {
      await fetch(`http://localhost:3000/api/armazens/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      carregarArmazens();
    }
  };

  carregarArmazens();
});
