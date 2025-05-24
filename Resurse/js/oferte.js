const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const caleJson = path.join(__dirname, "Resurse/json/oferte.json");
const client = new Client({
  database: "proiecttw",
  user: "trifan_iustinian_luca",
  password: "Trifan_Iustinian_Luca",
  host: "localhost",
  port: 5432
});

const T = 1 * 60 * 1000;  // 1 minut
const T2 = 2 * 60 * 1000; // 2 minute
const reduceri = [5,10,15,20,25,30,35,40,45,50];

function genereazaOferta() {
  client.connect();

  client.query("SELECT * FROM unnest(enum_range(NULL::categorie_produs))", (err, rez) => {
    if (err) throw err;
    const categorii = rez.rows.map(r => r.unnest);

    let oferte = JSON.parse(fs.readFileSync(caleJson)).oferte || [];
    const ultimaCategorie = oferte[0]?.categorie;
    const categoriiDisponibile = categorii.filter(c => c !== ultimaCategorie);

    const categorieNoua = categoriiDisponibile[Math.floor(Math.random() * categoriiDisponibile.length)];
    const reducereNoua = reduceri[Math.floor(Math.random() * reduceri.length)];

    const dataIncepere = new Date();
    const dataFinalizare = new Date(dataIncepere.getTime() + T);

    oferte = oferte.filter(of => new Date() - new Date(of["data-finalizare"]) < T2);
    oferte.unshift({
      categorie: categorieNoua,
      "data-incepere": dataIncepere,
      "data-finalizare": dataFinalizare,
      reducere: reducereNoua
    });

    fs.writeFileSync(caleJson, JSON.stringify({ oferte }, null, 2));
    client.end();
  });
}

// Rulează la fiecare T
setInterval(genereazaOferta, T);
