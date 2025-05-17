-- Șterge tipurile și tabelele existente dacă există
DROP TYPE IF EXISTS categorie_produs;
DROP TYPE IF EXISTS tip_produs;

-- Creează tipuri ENUM pentru categoriile și tipurile de produse
CREATE TYPE categorie_produs AS ENUM('îmbrăcăminte', 'accesorii', 'încălțăminte', 'altele');
CREATE TYPE tip_produs AS ENUM('nou', 'reducere', 'ediție limitată', 'exclusiv', 'standard');

-- Creează tabelul principal pentru produse
CREATE TABLE IF NOT EXISTS produse (
   id SERIAL PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   stoc INT NOT NULL CHECK (stoc >= 0),   
   tip tip_produs DEFAULT 'standard',
   marime VARCHAR(10) NOT NULL CHECK (marime IN ('XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '39', '40', '41', '42', '43', '44', '45')), -- Mărimea produsului
   categorie categorie_produs DEFAULT 'altele',
   etichete VARCHAR[], -- Array de etichete pentru filtrare (ex: "eco-friendly", "handmade")
   este_promovat BOOLEAN NOT NULL DEFAULT FALSE, -- Produs promovat
   imagine_url VARCHAR(300), -- URL-ul imaginii produsului
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

-- Introduce date de exemplu în tabelul produse
INSERT INTO produse (nume, descriere, pret, stoc, marime, tip, categorie, etichete, este_promovat, imagine_url) VALUES
('Hanorac Urban', 'Hanorac confortabil și stilat pentru purtarea zilnică.', 49.99, 100, 'M', 'nou', 'îmbrăcăminte', '{"bumbac", "urban", "hanorac"}', TRUE, 'hanorac-urban.jpg'),
('Rucsac din Piele', 'Rucsac premium din piele pentru muncă și călătorii.', 129.99, 50, 'L', 'exclusiv', 'accesorii', '{"piele", "rucsac", "handmade"}', TRUE, 'rucsac-piele.jpg'),
('Adidași', 'Adidași moderni pentru ieșiri casual.', 79.99, 200, '42', 'reducere', 'încălțăminte', '{"adidași", "casual", "urban"}', FALSE, 'adidasi.jpg'),
('Geantă Eco', 'Geantă reutilizabilă realizată din materiale reciclate.', 14.99, 150, 'One Size', 'nou', 'accesorii', '{"eco-friendly", "reciclat"}', TRUE, 'geanta-eco.jpg'),
('Șapcă Urbană', 'Șapcă stilată pentru zilele însorite.', 19.99, 120, 'Adjustable', 'standard', 'accesorii', '{"șapcă", "urban", "stil"}', FALSE, 'sapca-urbana.jpg'),
('Brățară Handmade', 'Brățară unică realizată manual cu design urban.', 24.99, 80, 'One Size', 'ediție limitată', 'accesorii', '{"handmade", "brățară", "urban"}', TRUE, 'bratara-handmade.jpg'),
('Tricou Grafic', 'Tricou cool cu artă grafică urbană.', 29.99, 150, 'L', 'nou', 'îmbrăcăminte', '{"tricou", "grafic", "urban"}', FALSE, 'tricou-grafic.jpg'),
('Adidași Urban', 'Adidași ediție limitată pentru exploratori urbani.', 149.99, 20, '43', 'ediție limitată', 'încălțăminte', '{"adidași", "urban", "ediție limitată"}', TRUE, 'adidasi-urban.jpg'),
('Geacă Urbană', 'Geacă ușoară pentru aventuri urbane.', 89.99, 70, 'XL', 'exclusiv', 'îmbrăcăminte', '{"geacă", "urban", "ușoară"}', TRUE, 'geaca-urbana.jpg'),
('Ochelari de Soare', 'Ochelari de soare moderni cu protecție UV.', 24.99, 200, 'One Size', 'nou', 'accesorii', '{"ochelari", "modern", "UV"}', FALSE, 'ochelari-soare.jpg'),
('Curea Urbană', 'Curea durabilă cu un design elegant.', 29.99, 50, 'One Size', 'reducere', 'accesorii', '{"curea", "durabil", "urban"}', FALSE, 'curea-urbana.jpg'),