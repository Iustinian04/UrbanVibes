window.addEventListener("DOMContentLoaded", () => {
  fetch("/Resurse/json/oferte.json")
    .then(res => res.json())
    .then(data => {
      const oferta = data.oferte?.[0];
      if (!oferta) return;

      const categorieOferta = oferta.categorie.toLowerCase();
      const reducere = parseInt(oferta.reducere);

      const cat = document.querySelector(".art-categorie")?.innerText.trim().toLowerCase();
      const pretSpan = document.querySelector(".art-pret");
      const pretRedusSpan = document.querySelector(".art-pret-redus");

      if (cat === categorieOferta) {
        const pretVechi = parseFloat(pretSpan.dataset.pret);
        const pretNou = (pretVechi * (1 - reducere / 100)).toFixed(2);

        pretSpan.innerHTML = `<s>${pretVechi} RON</s>`;
        pretRedusSpan.innerText = `${pretNou} RON`;
        pretRedusSpan.classList.remove("d-none");
      }
    });
});
