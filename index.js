const express= require("express");
const path= require("path");
const fs = require("fs");
const sharp = require("sharp");
const sass = require("sass");
const pg = require ("pg");

const Client=pg.Client;

client=new Client({
    database:"proiecttw",
    user:"trifan_iustinian_luca",
    password:"Trifan_Iustinian_Luca", 
    host:"localhost",
    port:5432
})

client.connect()
client.query("select * from produse", function(err, rezultat ){
    console.log(err)    
    console.log(rezultat)
})
client.query("select * from unnest(enum_range(null::categorie_produs))", function(err, rezultat ){
    console.log(err)    
    console.log(rezultat)
})

app= express();

v=[10,27,23,44,15]

nrImpar=v.find(function(elem){return elem % 100 == 1})
console.log(nrImpar)

console.log("Folderul proiectului: ", __dirname)
console.log("Calea fisierului index.js: ", __filename)
console.log("Folderul curent de lucru: ", process.cwd())

app.set("view engine", "ejs");

obGlobal={
    obErori:null,
    obImagini:null,
    folderScss:path.join(__dirname,"Resurse/scss"),
    folderCss:path.join(__dirname,"Resurse/CSS"),
    folderBackup:path.join(__dirname,"Resurse/backup"),
    optiuniMeniu:null,
}

client.query("select * from unnest(enum_range(null::categorie_produs))", function(err, rezultat ){
    console.log(err)    
    console.log(rezultat)
    obGlobal.optiuniMeniu=rezultat.rows;
})


vect_foldere=["temp", "backup", "temp1"]
for (let folder of vect_foldere ){
    let caleFolder=path.join(__dirname,folder)
    if (! fs.existsSync(caleFolder)){
        fs.mkdirSync(caleFolder);
    }
}

function compileazaScss(caleScss, caleCss){
    console.log("cale:",caleCss);
    if(!caleCss){

        let numeFisExt=path.basename(caleScss);
        let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss=numeFis+".css";
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss )
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )
    

    let caleBackup=path.join(obGlobal.folderBackup, "Resurse/CSS");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true})
    }
    
    // la acest punct avem cai absolute in caleScss si  caleCss

    let numeFisCss=path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "Resurse/CSS",numeFisCss ))// +(new Date()).getTime()
    }
    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css)
    //console.log("Compilare SCSS",rez);
}
//compileazaScss("a.scss");
vFisiere=fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}


fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    console.log(eveniment, numeFis);
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
})



function initErori(){
    let continut = fs.readFileSync(path.join(__dirname,"Resurse/json/erori.json")).toString("utf-8");
    console.log(continut)
    obGlobal.obErori=JSON.parse(continut)
    console.log(obGlobal.obErori)
    
    obGlobal.obErori.eroare_default.imagine=path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine)
    for (let eroare of obGlobal.obErori.info_erori){
        eroare.imagine=path.join(obGlobal.obErori.cale_baza, eroare.imagine)
    }
    console.log(obGlobal.obErori)

}

initErori()

function initImagini() {
    const fs = require("fs");
    const path = require("path");
    const sharp = require("sharp");

    const galeriePath = path.join(__dirname, "Resurse/json/galerie.json");
    const galerieContent = fs.readFileSync(galeriePath, "utf-8");
    obGlobal.obImagini = JSON.parse(galerieContent);

    const caleGalerie = path.join(__dirname, obGlobal.obImagini.cale_galerie);
    const caleMediu = path.join(caleGalerie, "mediu");
    const caleMic = path.join(caleGalerie, "mic");

    if (!fs.existsSync(caleMediu)) fs.mkdirSync(caleMediu);
    if (!fs.existsSync(caleMic)) fs.mkdirSync(caleMic);


    /* Vector de imagini     */
    obGlobal.obImagini.imagini.forEach(imag => {
        if (imag.fisier) {
            const [numeFis, ext] = imag.fisier.split(".");
            const caleFisAbs = path.join(caleGalerie, imag.fisier);

            // Imagini medii
            const caleFisMediu = path.join(caleMediu, `${numeFis}.webp`);
            if (!fs.existsSync(caleFisMediu)) {
                sharp(caleFisAbs).resize(800).toFile(caleFisMediu);
            }

            // Imagini mici
            const caleFisMic = path.join(caleMic, `${numeFis}.webp`);
            if (!fs.existsSync(caleFisMic)) {
                sharp(caleFisAbs).resize(400).toFile(caleFisMic);
            }

            
            imag.fisier_mediu = `/Resurse/Imagini/galerie/mediu/${numeFis}.webp`;
            imag.fisier_mic = `/Resurse/Imagini/galerie/mic/${numeFis}.webp`;
            imag.fisier = `/Resurse/Imagini/galerie/${imag.fisier}`;
        }
    });
}
initImagini();
function afisareEroare(res, identificator, titlu, text, imagine){
    let eroare= obGlobal.obErori.info_erori.find(function(elem){ 
                        return elem.identificator==identificator
                    });
    if(eroare){
        if(eroare.status)
            res.status(identificator)
        var titluCustom=titlu || eroare.titlu;
        var textCustom=text || eroare.text;
        var imagineCustom=imagine || eroare.imagine;


    }
    else{
        var err=obGlobal.obErori.eroare_default
        var titluCustom=titlu || err.titlu;
        var textCustom=text || err.text;
        var imagineCustom=imagine || err.imagine;


    }
    res.render("pagini/eroare", { //transmit obiectul locals
        titlu: titluCustom,
        text: textCustom,
        imagine: imagineCustom
})

}


app.use("/*", function(req, res,next){
    res.locals.optiuniMeniu=obGlobal.optiuniMeniu;
    next();
})

app.use("/Resurse", express.static(path.join(__dirname, "Resurse")));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname, "Resurse/Imagini/favicon_io/favicon.ico"))
})

app.get(["/","/index","/home"], function(req, res){
    res.render("pagini/index",{ip:req.ip, imagini:obGlobal.obImagini.imagini});
})

app.get("/despre", function(req, res){
    res.render("pagini/despre");
})

app.get("/pagina_galerie", function (req, res) {
    const d = new Date();
    const luna = d.getMonth(); // 0 = Ianuarie, ..., 11 = Decembrie

    let sezon_curent = "";
    if ([11, 0, 1].includes(luna)) sezon_curent = "iarna";
    else if ([2, 3, 4].includes(luna)) sezon_curent = "primavara";
    else if ([5, 6, 7].includes(luna)) sezon_curent = "vara";
    else if ([8, 9, 10].includes(luna)) sezon_curent = "toamna";

    const imagini_filtrate = obGlobal.obImagini.imagini.filter(imag =>
        imag.anotimp && imag.anotimp.includes(sezon_curent)
    );

    res.render("pagini/pagina_galerie", { imagini: imagini_filtrate });
});

app.get("/index/a", function(req, res){
    res.render("pagini/index");
})


app.get("/cerere", function(req, res){
    res.send("<p style='color:blue'>Buna ziua</p>")
})


app.get("/fisier", function(req, res, next){
    res.sendfile(path.join(__dirname,"package.json"));
})


app.get("/abc", function(req, res, next){
    res.write("Data curenta: ")
    next()
})

app.get("/abc", function(req, res, next){
    res.write((new Date())+"")
    res.end()
    next()
})


app.get("/abc", function(req, res, next){
    console.log("------------")
})

app.get("/produse", function (req, res) {
    console.log(req.query);
    var conditieQuery = ""; // TO DO where din parametri

    if (req.query.categorie) {
        conditieQuery=`where categorie='${req.query.categorie}'`;
    }

    queryOptiuni = "select * from unnest(enum_range(null::categorie_produs))";
    client.query(queryOptiuni, function (err, rezOptiuni) {
        if (err) {
            console.log("Error in queryOptiuni:", err);
            afisareEroare(res, 2);
            return;
        }

        console.log("rezOptiuni:", rezOptiuni);

        queryProduse = "select * from produse" + conditieQuery;
        client.query(queryProduse, function (err, rez) {
            if (err) {
                console.log("Error in queryProduse:", err);
                afisareEroare(res, 2);
            } else {
                res.render("pagini/produse", {
                    produse: rez.rows,
                    optiuni: rezOptiuni.rows || [] // Ensure optiuni is iterable
                });
            }
        });
    });
});

app.get("/produs/:id", function(req, res){
    client.query(`select * from produse where id=${req.params.id}`, function(err, rez){
        if (err){
            console.log(err);
            afisareEroare(res, 2);
        }
        else{
            if (rez.rowCount==0){
                afisareEroare(res, 404);
            }
            else{
                res.render("pagini/produs", {prod: rez.rows[0]})
            }
        }
    })
})

app.get(/^\/Resurse\/[a-zA-Z0-9_\/]*$/, function(req, res, next){
    afisareEroare(res,403);
})


app.get("/*.ejs", function(req, res, next){
    afisareEroare(res,400);
})


// Ruta pagian comparatie bonus 20
function obtineProdusDupaId(id) {
    return new Promise((resolve, reject) => {
        client.query("SELECT * FROM produse WHERE id=$1", [id], (err, rez) => {
            if (err) {
                console.error("Eroare DB:", err);
                reject(err);
            } else {
                resolve(rez.rows[0]);
            }
        });
    });
}


app.get("/comparatie/:id1/:id2", async (req, res) => {
    const { id1, id2 } = req.params;
    const [produs1, produs2] = await Promise.all([
        obtineProdusDupaId(id1),
        obtineProdusDupaId(id2)
    ]);
    res.render("pagini/comparatie", { produs1, produs2 });
});

app.get("/*", function(req, res, next){
    try{
        res.render("pagini"+req.url,function (err, rezultatRandare){
            if (err){
                if(err.message.startsWith("Failed to lookup view")){
                    afisareEroare(res,404);
                }
                else{
                    afisareEroare(res);
                }
            }
            else{
                console.log(rezultatRandare);
                res.send(rezultatRandare)
            }
        });
    }
    catch(errRandare){
        if(errRandare.message.startsWith("Cannot find module")){
            afisareEroare(res,404);
        }
        else{
            afisareEroare(res);
        }
    }
})





app.listen(8080);
console.log("Serverul a pornit")


