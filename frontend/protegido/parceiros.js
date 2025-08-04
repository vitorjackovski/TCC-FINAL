document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('tokenAdmin');
  if (!token) {
    alert('Você precisa estar logado para acessar essa página.');
    window.location.href = '../pagins/login.html';
    return;
  }

  const form = document.getElementById('parceiroForm');
  const listaParceiros = document.getElementById('listaParceiros');
  const btnSalvar = document.getElementById('btnSalvar');
  const btnCancelar = document.getElementById('btnCancelar');
  const formTitle = document.getElementById('form-title');

  let editandoId = null;

  async function carregarParceiros() {
    try {
      const res = await fetch('http://localhost:3000/api/parceiros', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Erro ao carregar parceiros');

      const parceiros = await res.json();

      listaParceiros.innerHTML = '';

      if (parceiros.length === 0) {
        listaParceiros.textContent = 'Nenhum parceiro cadastrado.';
        return;
      }

      parceiros.forEach(parceiro => {
        const div = document.createElement('div');
        div.classList.add('parceiro-item');

        div.innerHTML = `
          <div class="parceiro-info">
            <h3>${parceiro.nome}</h3>
            <p><strong>CNPJ:</strong> ${parceiro.cnpj}</p>
            <p><strong>Endereço:</strong> ${parceiro.endereco}</p>
            <p><strong>Contato:</strong> ${parceiro.contato}</p>
          </div>
          <div class="parceiro-actions">
            <button class="edit-btn">Editar</button>
            <button class="delete-btn">Excluir</button>
          </div>
        `;

        // Botões
        const btnEditar = div.querySelector('.edit-btn');
        const btnExcluir = div.querySelector('.delete-btn');

        btnEditar.addEventListener('click', () => {
          preencherFormulario(parceiro);
        });

        btnExcluir.addEventListener('click', async () => {
          if (confirm(`Deseja realmente excluir o parceiro "${parceiro.nome}"?`)) {
            try {
              const resDel = await fetch(`http://localhost:3000/api/parceiros/${parceiro.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
              });
              if (!resDel.ok) throw new Error('Erro ao excluir parceiro');

              alert('Parceiro excluído com sucesso.');
              if (editandoId === parceiro.id) {
                resetarFormulario();
              }
              carregarParceiros();
            } catch (err) {
              alert('Erro: ' + err.message);
              console.error(err);
            }
          }
        });

        listaParceiros.appendChild(div);
      });
    } catch (err) {
      alert('Erro ao carregar parceiros.');
      console.error(err);
    }
  }

  function preencherFormulario(parceiro) {
    document.getElementById('nome').value = parceiro.nome;
    document.getElementById('cnpj').value = parceiro.cnpj;
    document.getElementById('endereco').value = parceiro.endereco;
    document.getElementById('contato').value = parceiro.contato;

    editandoId = parceiro.id;
    formTitle.textContent = 'Editar Parceiro';
    btnSalvar.textContent = 'Salvar Alterações';
    btnCancelar.hidden = false;
  }

  function resetarFormulario() {
    form.reset();
    editandoId = null;
    formTitle.textContent = 'Cadastrar Parceiro';
    btnSalvar.textContent = 'Cadastrar';
    btnCancelar.hidden = true;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const cnpj = document.getElementById('cnpj').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const contato = document.getElementById('contato').value.trim();

    if (!nome || !cnpj || !endereco || !contato) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const parceiroData = { nome, cnpj, endereco, contato };

    try {
      let res;
      if (editandoId) {
        // Editar parceiro
        res = await fetch(`http://localhost:3000/api/parceiros/${editandoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(parceiroData)
        });
      } else {
        // Criar parceiro
        res = await fetch('http://localhost:3000/api/parceiros', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(parceiroData)
        });
      }

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.erro || 'Erro na operação.');
      }

      alert(editandoId ? 'Parceiro atualizado com sucesso!' : 'Parceiro cadastrado com sucesso!');
      resetarFormulario();
      carregarParceiros();
    } catch (err) {
      alert('Erro: ' + err.message);
      console.error(err);
    }
  });

  btnCancelar.addEventListener('click', () => {
    resetarFormulario();
  });

  carregarParceiros();
});
