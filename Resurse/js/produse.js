window.onload = function() {
    btn= document.getElementById("filtrare");
    btn.onclick = function() {
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

            let inpCategorie=document.getElementById("inp-categorie").value.trim().toLowerCase();
            
            let produse=document.getElementsByClassName("produs");
            for (let prod of produse){
            prod.style.display="none";

            let nume=prod. getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();

            let cond1=(nume.startsWith(inpNume))

            let stoc=parseInt(prod.getElementsByClassName("val-stoc")[0].innerHTML.trim().toLowerCase());

            let cond2=(inpStoc=="toate")  || (minStoc <= stoc && stoc <= maxStoc);

            let pret=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim().toLowerCase());

            let cond3 = (inpPret <= pret)

            let categorie=prod. getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();
            
            let cond4=(inpCategorie=="toate" || inpCategorie==categorie)

            if(cond1 && cond2 && cond3 && cond4){
    prod.style.display="block";
}
        }
    }


    //Bonus - Filtrare. Pretul se modifica in acelasi timp cu cursorul
    document.getElementById("inp-pret").onmousemove = function() {
        document.getElementById("infoRange").innerHTML=`(${this.value})`;
    }

    document.getElementById("resetare").onclick = function() {
        document.getElementById("inp-nume").value = "";
        document.getElementById("inp-categorie").value = "toate";
        document.getElementById("i_stoc4").checked = true;
        document.getElementById("inp-pret").value = 0;
        document.getElementById("sortCrescNume").value = "";

        let produse = document.getElementsByClassName("produs");
        for (let prod of produse) {
            prod.style.display = "block";
        }
    }

    document.getElementById("sortCrescNume").onclick = function() {
        sorteaza(1);

    }

    document.getElementById("sortDescrescNume").onclick = function() {
        sorteaza(-1);

    }

    function sorteaza(semn) {
        let produse= document.getElementsByClassName("produs");
        let vProduse = Array.from(produse);
        vProduse.sort(function(a, b) {

            let pretA = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML.trim().toLowerCase());
            let pretB = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML.trim().toLowerCase());
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
            let produse= document.getElementsByClassName("produs");
            let sumaPreturi=0;
            for (let prod of produse ){
                if (prod.style.display!="none"){
                    let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim().toLowerCase());
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
}