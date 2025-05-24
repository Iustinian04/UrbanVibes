function initOferta(oferta) {
  const sectiune = document.getElementById("sectiune-oferta");
  const textOferta = document.getElementById("text-oferta");
  const timer = document.getElementById("timer-oferta");

  sectiune.classList.remove("d-none");
  timer.style.color = ""; // reset culoare

  textOferta.innerText = `Reducere de ${oferta.reducere}% la categoria ${oferta.categorie}`;

  const tFinal = new Date(oferta["data-finalizare"]);
  const interval = setInterval(() => {
    const tRam = Math.max(0, tFinal - new Date());
    const secunde = Math.floor(tRam / 1000) % 60;
    const minute = Math.floor(tRam / (1000 * 60)) % 60;
    const ore = Math.floor(tRam / (1000 * 60 * 60));

    timer.innerText = `${ore}h ${minute}m ${secunde}s`;

    if (tRam <= 10000) timer.style.color = "red";

    if (tRam <= 0) {
  clearInterval(interval);
  sectiune.innerHTML = "<p class='text-danger'>Oferta a expirat.</p>";
}

  }, 1000);
}

window.addEventListener("DOMContentLoaded", () => {
  fetch("/Resurse/json/oferte.json")
    .then(res => res.json())
    .then(data => {
      const oferta = data.oferte?.[0];
      if (oferta) {
        initOferta(oferta);
      }
    });
});

let ultimaDataFinalizare = null;

function verificaOferta() {
  fetch("/Resurse/json/oferte.json")
    .then(res => res.json())
    .then(data => {
      const oferta = data.oferte?.[0];
      const dataFinal = new Date(oferta["data-finalizare"]).getTime();
      if (ultimaDataFinalizare !== dataFinal) {
        ultimaDataFinalizare = dataFinal;
        initOferta(oferta); // Reafișează oferta
      }
    })
    .catch(err => console.error("Eroare la verificarea ofertei:", err));
}

setInterval(verificaOferta, 1000);
