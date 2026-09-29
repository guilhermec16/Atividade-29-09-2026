const audioPlayer = document.getElementById("audioPlayer");
const tituloAtual = document.getElementById("tituloAtual");
const artistaAtual = document.getElementById("artistaAtual");
const albumAtual = document.getElementById("albumAtual");
const capaAtual = document.getElementById("capaAtual");
const listaMusicas = document.getElementById("listaMusicas");
const inputBusca = document.getElementById("inputBusca");
const btnBuscar = document.getElementById("btnBuscar");

async function buscarMusicas(termo) {
  const termoLimpo = termo.trim();
  if (!termoLimpo) return;

  listaMusicas.innerHTML =
    '<p style="text-align: center; color: #aaa;">Buscando faixas e álbuns...</p>';

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(termoLimpo)}&media=music&entity=song&limit=10`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      listaMusicas.innerHTML =
        '<p style="text-align: center; color: #aaa;">Nenhum resultado encontrado.</p>';
      return;
    }

    renderizarLista(data.results);
  } catch (erro) {
    console.error("Erro na busca:", erro);
    listaMusicas.innerHTML =
      '<p style="text-align: center; color: #f87171;">Erro ao realizar a busca. Tente novamente.</p>';
  }
}

function renderizarLista(músicas) {
  listaMusicas.innerHTML = "";

  músicas.forEach((faixa) => {
    const div = document.createElement("div");
    div.classList.add("musica");

    const titulo = faixa.trackName;
    const artista = faixa.artistName;
    const album = faixa.collectionName || "Álbum Desconhecido";
    const capaPequena = faixa.artworkUrl100;
    const capaGrande = faixa.artworkUrl100.replace("100x100bb", "300x300bb");
    const audioUrl = faixa.previewUrl;

    div.innerHTML = `
            <img src="${capaPequena}" alt="Capa ${album}" class="thumb-album">
            <div class="info-musica">
                <h3>${titulo}</h3>
                <p><strong>${artista}</strong> • <em>${album}</em></p>
            </div>
        `;

    div.addEventListener("click", () => {
      tituloAtual.textContent = titulo;
      artistaAtual.textContent = artista;
      albumAtual.textContent = `Álbum: ${album}`;
      capaAtual.src = capaGrande;

      audioPlayer.src = audioUrl;
      audioPlayer.load();
      audioPlayer.play().catch((e) => console.log("Erro de reprodução:", e));
    });

    listaMusicas.appendChild(div);
  });
}

btnBuscar.addEventListener("click", () => {
  buscarMusicas(inputBusca.value);
});

inputBusca.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    buscarMusicas(inputBusca.value);
  }
});
