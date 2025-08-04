document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("tokenAdmin");

  if (!token) {
    alert("Acesso não autorizado. Apenas administradores podem acessar esta página, faça login como administrador e acesse esta pagina.");
    window.location.href = "../pagins/login.html"; // Corrigido caminho
    return;
  }

  console.log("Token de administrador detectado.");

  fetch("http://localhost:3000/api/relatorios", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error("Acesso negado.");
      return res.json();
    })
    .then(data => {
      console.log("Dados do relatório recebidos:", data);

      document.getElementById("resumo").innerHTML = `
        <p>Total de Produtos: ${data.totalProdutos}</p>
        <p>Total de Produções: ${data.totalProducoes}</p>
        <p>Total de Transportes: ${data.totalTransportes}</p>
      `;

      const producoesTbody = document.querySelector("#tabela-producoes tbody");
      producoesTbody.innerHTML = "";
      data.producoes.forEach(p => {
        producoesTbody.innerHTML += `
          <tr>
            <td>${p.id}</td>
            <td>${p.produto}</td>
            <td>${new Date(p.data).toLocaleDateString()}</td>
            <td>${p.quantidade}</td>
          </tr>
        `;
      });

      const transportesTbody = document.querySelector("#tabela-transportes tbody");
      transportesTbody.innerHTML = "";
      data.transportes.forEach(t => {
        transportesTbody.innerHTML += `
          <tr>
            <td>${t.id}</td>
            <td>${t.origem}</td>
            <td>${t.destino}</td>
            <td>${t.status}</td>
          </tr>
        `;
      });
    })
    .catch(err => {
      console.error("Erro ao buscar relatório:", err);
      alert("Você não tem permissão para acessar esta página.");
      window.location.href = "../pagins/home.html"; // Corrigido caminho
    });
});
