let containerProduse = null;
let produseInitiale = null;

function inputuriValide() {
    let inpNume = document.getElementById("inp-nume").value.trim();
    // let descriere = document.getElementById("inp-descriere").value.trim();
    let radioStoc = document.querySelector('input[name="gr_stoc"]:checked');

    let textarea = document.getElementById("inp-descriere");
let descriere = textarea.value.trim();

    // Verificare nume (nu trebuie sa conțină cifre)
    if (inpNume && /\d/.test(inpNume)) {
        alert("Numele nu trebuie să conțină cifre.");
        return false;
    }

    // Verificare descriere (nu trebuie să fie goală dacă a fost completată)
    if (descriere !== "" && descriere.length < 3) {
    textarea.classList.add("is-invalid");
    alert("Descrierea este prea scurtă.");
    return false;
} else {
    textarea.classList.remove("is-invalid");
}

    // Verificare radio buttons pentru stoc
    if (!radioStoc) {
        alert("Selectați un interval de stoc.");
        return false;
    }

    return true;
}


window.onload = function() {

    containerProduse = document.querySelector(".grid-produse") ;
    produseInitiale = Array.from(document.getElementsByClassName("produs"));
    btn= document.getElementById("filtrare");
    btn.onclick = function() {
        if (!inputuriValide()) return;

        let inpNume=document.getElementById("inp-nume").value.trim().toLowerCase();


        let vectRadio=document.getElementsByName("gr_rad");

            let vectRadioStoc = document.getElementsByName("gr_stoc");
            let inpStoc = null;
            let minStoc = null;
            let maxStoc = null;
            for (let rad of vectRadioStoc) {
                if (rad.checked) {
                    inpStoc = rad.value;
                    if (inpStoc != "toate") {
                        [minStoc, maxStoc] = inpStoc.split(":");
                        minStoc = parseInt(minStoc);
                        maxStoc = parseInt(maxStoc);
                    }
                    break;
                }
            }

            let inpPret = parseFloat(document.getElementById("inp-pret").value);
            let inpPret2 = parseFloat(document.getElementById("inp-pret2").value);

            let inpCategorie=document.getElementById("inp-categorie").value.trim().toLowerCase();
            
            let produse=document.getElementsByClassName("produs");
            for (let prod of produse){
            prod.style.display="none";

            let nume=prod. getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();

            let cond1;
            if (inpNume.includes("*")) {
                let [start, end] = inpNume.split("*");
                start = start ?? "";  
                end = end ?? "";      
                cond1 = nume.startsWith(start) && nume.endsWith(end);
            } else {
                cond1 = nume.includes(inpNume);
            }

            let stoc=parseInt(prod.getElementsByClassName("val-stoc")[0].innerHTML.trim().toLowerCase());

            let cond2=(inpStoc=="toate")  || (minStoc <= stoc && stoc <= maxStoc);

            // Modificare pentru bonus 12
            let pretContainer = prod.getElementsByClassName("val-pret")[0];
            let pretNou = pretContainer.querySelector("span")?.innerText || pretContainer.innerText;
            let pret = parseFloat(pretNou);
            // In cele 3 linii de mai sus am actualiazat programul astfel incat sa ia in considerare pretul redus

            let cond3 = (inpPret <= pret && pret <= inpPret2);

            let categorie=prod. getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();
            
            let cond4=(inpCategorie=="toate" || inpCategorie==categorie)

            let valTip = document.getElementById("inp-tip").value.trim().toLowerCase();
            let valDescriere = document.getElementById("inp-descriere").value.trim().toLowerCase();
            let eticheteSelectate = Array.from(document.getElementById("inp-etichete").selectedOptions).map(opt => opt.value.toLowerCase());

            let descriere = prod.getElementsByClassName("val-descriere")[0].innerHTML.trim().toLowerCase();
            let cond5 = !valTip || descriere.includes(valTip); // tip produs în descriere

            let cond6 = !valDescriere || descriere.includes(valDescriere); // textarea

            let valEticheteText = prod.getElementsByClassName("val-etichete")[0]?.innerHTML.trim().toLowerCase() || "";
            let cond7 = eticheteSelectate.length === 0 || eticheteSelectate.some(et => valEticheteText.includes(et));


            if(cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7) {
    prod.style.display="block";
}
        }
    }


    //Bonus - Filtrare. Pretul se modifica in acelasi timp cu cursorul
    document.getElementById("inp-pret").onmousemove = function() {
        document.getElementById("infoRange").innerHTML=`(${this.value})`;
    }
    document.getElementById("inp-pret2").onmousemove = function() {
        document.getElementById("infoRange2").innerHTML=`(${this.value})`;
    }

    document.getElementById("resetare").onclick = function() {

        if (!confirm("Sigur doriți să resetați filtrele?")) {
        return;
        }
        
        document.getElementById("inp-nume").value = "";
        document.getElementById("inp-categorie").value = "toate";
        document.getElementById("i_stoc4").checked = true;
        document.getElementById("inp-pret").value = 0;
        document.getElementById("inp-pret2").value = 149.99;
        document.getElementById("sortCrescNume").value = "";
        document.getElementById("sortDescrescNume").value = "";
        document.getElementById("infoRange").innerHTML = "(0)";
        document.getElementById("infoRange2").innerHTML = "(149)";

        document.getElementById("inp-tip").value = "";
        document.getElementById("inp-descriere").value = "";
        document.getElementById("inp-etichete").selectedIndex = -1;

        let produse = document.getElementsByClassName("produs");
        for (let prod of produse) {
            prod.style.display = "block";
        }
        if (containerProduse && produseInitiale) {
        produseInitiale.forEach(prod => containerProduse.appendChild(prod));
    }
    }

    document.getElementById("sortCrescNume").onclick = function() {
        if (!inputuriValide()) return;
        sorteaza(1);

    }

    document.getElementById("sortDescrescNume").onclick = function() {
        if (!inputuriValide()) return;
        sorteaza(-1);

    }

    function sorteaza(semn) {
        let produse= document.getElementsByClassName("produs");
        let vProduse = Array.from(produse);
        vProduse.sort(function(a, b) {

            // Modificare bonus 12
            let pretAContainer = a.getElementsByClassName("val-pret")[0];
            let pretBContainer = b.getElementsByClassName("val-pret")[0];

            let pretAText = pretAContainer.querySelector("span")?.innerText || pretAContainer.innerText;
            let pretBText = pretBContainer.querySelector("span")?.innerText || pretBContainer.innerText;

            let pretA = parseFloat(pretAText);
            let pretB = parseFloat(pretBText);
            // Verificăm dacă pretA și pretB sunt NaN

            if (pretA != pretB) {
                return semn*(pretA - pretB);
            }


            let numeA = a.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
            let numeB = b.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
            return semn*numeA.localeCompare(numeB);
        })
        for (let prod of vProduse) {
            prod.parentNode.appendChild(prod);
        }

    }

    window.onkeydown = function(e) {
        
        if(e.key=="c" && e.altKey){
            if (!inputuriValide()) return;
            let produse= document.getElementsByClassName("produs");
            let sumaPreturi=0;
            for (let prod of produse ){
                if (prod.style.display!="none"){
                    // Modificare bonus 12
                    let pretContainer = prod.getElementsByClassName("val-pret")[0];
                    let pretText = pretContainer.querySelector("span")?.innerText || pretContainer.innerText;
                    let pret = parseFloat(pretText);
                    sumaPreturi += pret;
                }
            }

            if (!document.getElementById("suma_preturi")){
                let pRezultat= document.createElement("p");
                pRezultat.innerHTML=sumaPreturi;
                pRezultat.id = "suma_preturi";
                let p=document.getElementById("p-suma");
                p.parentElement.insertBefore(pRezultat, p.nextElementSibling);

                setTimeout(function() {
                    let p1= document.getElementById("suma_preturi");
                    if (p1){
                        p1.remove();
                    }
                }, 2000);
            }
            
        }
    }

    // Bonus 12 
    fetch("/Resurse/json/oferte.json", { cache: "no-store" })
  .then(res => res.json())
  .then(data => {
    const oferta = data.oferte?.[0];
    if (!oferta) return;

    const categorieOferta = oferta.categorie.toLowerCase();
    const reducere = parseInt(oferta.reducere);

    const produse = document.querySelectorAll(".produs");
    for (let prod of produse) {
      const cat = prod.querySelector(".val-categorie").innerText.trim().toLowerCase();
      const pretSpan = prod.querySelector(".val-pret");

      // Adaugăm atributul data-pret-original dacă nu există deja
      if (!pretSpan.dataset.pretOriginal) {
        const pretInitial = parseFloat(pretSpan.innerText);
        pretSpan.dataset.pretOriginal = pretInitial;
      }

      const pretVechi = parseFloat(pretSpan.dataset.pretOriginal);
      if (cat === categorieOferta) {
        const pretNou = (pretVechi * (1 - reducere / 100)).toFixed(2);
        pretSpan.innerHTML = `<s>${pretVechi} RON</s> <span class="text-success fw-bold">${pretNou} RON</span>`;
      } else {
        // Refacem afișarea originală dacă nu mai e în ofertă
        pretSpan.innerText = `${pretVechi} RON`;
      }
    }
  });

    // Bonus 14 - Cel mai ieftin produs
    function evidentiazaCeleMaiIeftine() {
    const produse = Array.from(document.querySelectorAll(".produs"));
    const celeMaiIeftine = {};

    produse.forEach(prod => {
        const cat = prod.querySelector(".val-categorie").innerText.trim().toLowerCase();
        const pretSpan = prod.querySelector(".val-pret");
        const pretText = pretSpan.querySelector("span")?.innerText || pretSpan.innerText;
        const pret = parseFloat(pretText);

        if (!(cat in celeMaiIeftine) || pret < celeMaiIeftine[cat].pret) {
            celeMaiIeftine[cat] = {
                element: prod,
                pret: pret
            };
        }
    });

    for (let cat in celeMaiIeftine) {
        const produs = celeMaiIeftine[cat].element;

        // Adauga elementul de evidențiere
        const categorieAfisata = produs.querySelector(".val-categorie").innerText.trim();
        const badge = document.createElement("div");
        badge.classList.add("badge-ieftin");
        badge.innerHTML = `<i class="bi bi-star-fill"></i> Cel mai ieftin din categoria <strong>${categorieAfisata}</strong>!`;
        produs.querySelector(".produs-info").prepend(badge);
    }
}

evidentiazaCeleMaiIeftine();

    // Bonus 11
    function creeazaModalDinServer(idProdus) {
    fetch(`/api/produs/${idProdus}`)
        .then(resp => resp.json())
        .then(prod => {
            const modalExistent = document.getElementById("modal-produs");
            if (modalExistent) modalExistent.remove();

            const modal = document.createElement("div");
            modal.id = "modal-produs";
            modal.className = "custom-modal";

            const continut = document.createElement("div");
            continut.className = "custom-modal-content";

            const inchideBtn = document.createElement("span");
            inchideBtn.className = "custom-close";
            inchideBtn.innerHTML = "&times;";
            inchideBtn.onclick = () => modal.remove();

            const tabel = document.createElement("table");
            tabel.className = "table table-striped";
            tabel.style.margin = "0 auto";
            tabel.style.textAlign = "left";

            const caption = document.createElement("caption");
            caption.innerText = `Detalii produs: ${prod.nume}`;
            caption.style.fontSize = "1.25em";
            caption.style.textAlign = "center";
            tabel.appendChild(caption);

            const body = document.createElement("tbody");

            const exclude = ["id", "imagine", "imagine_url"];
            for (let [cheie, valoare] of Object.entries(prod)) {
                if (exclude.includes(cheie)) continue;

                const rand = document.createElement("tr");

                const cel1 = document.createElement("td");
                cel1.innerText = cheie.replace(/_/g, " ").replace(/^\w/, c => c.toUpperCase());

                const cel2 = document.createElement("td");
                if (Array.isArray(valoare)) {
                    cel2.innerText = valoare.join(", ");
                } else {
                    cel2.innerText = valoare ?? "—";
                }

                rand.appendChild(cel1);
                rand.appendChild(cel2);
                body.appendChild(rand);
            }

            tabel.appendChild(body);

            // Imagine produs
            const img = document.createElement("img");
            img.src = `/resurse/imagini/produse/${prod.imagine_url}`;
            img.alt = prod.nume;
            img.style.maxWidth = "100%";
            img.style.display = "block";
            img.style.margin = "1rem auto";

            continut.appendChild(inchideBtn);
            continut.appendChild(img);
            continut.appendChild(tabel);
            modal.appendChild(continut);
            document.body.appendChild(modal);

            modal.onclick = function (e) {
                if (e.target === modal) {
                    modal.remove();
                }
            };
        });
}


document.querySelectorAll(".produs a").forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault(); // opreste redirectionarea
        const articol = e.target.closest(".produs");
        const idProdus = articol.dataset.id;
        creeazaModalDinServer(idProdus);
    });
});


}