/**
 * js/catalog/products.js
 * Pekařství Ludvík & Mistrík - Kompletní katalog 3 divizí
 */

export const KATALOG_PRODUKTU = [
    // --- PEKÁRNA LUDVÍK & MISTRÍK ---
    {
        kod: "PEK-CHL-01",
        nazev: "Kvasový chléb Šumava",
        divize: "Pekárna Ludvík & Mistrík",
        kategorie: "Chléb",
        leadTimeDny: 1,
        minMnozstvi: 1,
        alergeny: [1],
        foto: "assets/img/chleb-sumava.jpg",
        dnyVyroby: [1, 2, 3, 4, 5, 6],
        aktivni: true,
        ceny: { koncova: 58, velkoobchod: 42, prodejna: 35 },
        varianty: [
            { id: "cely", nazev: "Celý bochník", priplatek: 0 },
            { id: "krajeny", nazev: "Krájený a balený", priplatek: 4 }
        ]
    },
    {
        kod: "PEK-ROH-01",
        nazev: "Tradiční rohlík tukový",
        divize: "Pekárna Ludvík & Mistrík",
        kategorie: "Běžné pečivo",
        leadTimeDny: 1,
        minMnozstvi: 5,
        alergeny: [1],
        foto: "assets/img/rohlik.jpg",
        dnyVyroby: [1, 2, 3, 4, 5, 6],
        aktivni: true,
        ceny: { koncova: 4.5, velkoobchod: 3.2, prodejna: 2.5 },
        varianty: []
    },
    {
        kod: "PEK-KOL-01",
        nazev: "Svatební vázané koláčky",
        divize: "Pekárna Ludvík & Mistrík",
        kategorie: "Jemné pečivo",
        leadTimeDny: 2,
        minMnozstvi: 10,
        alergeny: [1, 3, 7],
        foto: "assets/img/kolacky.jpg",
        dnyVyroby: [4, 5, 6],
        aktivni: true,
        ceny: { koncova: 16, velkoobchod: 12, prodejna: 9.5 },
        varianty: []
    },

    // --- LAHŮDKY LUDVÍK & MISTRÍK ---
    {
        kod: "LAH-CHL-01",
        nazev: "Chlebíček šunkový na bramborovém salátě",
        divize: "Lahůdky Ludvík & Mistrík",
        kategorie: "Chlebíčky",
        leadTimeDny: 3,
        minMnozstvi: 1,
        alergeny: [1, 3, 7, 9, 10],
        foto: "assets/img/chlebicek-sunka-salat.jpg",
        dnyVyroby: [1, 2, 3, 4, 5, 6],
        aktivni: true,
        ceny: { koncova: 35, velkoobchod: 28, prodejna: 22 },
        varianty: []
    },
    {
        kod: "LAH-SAL-01",
        nazev: "Vlašský salát výběrový",
        divize: "Lahůdky Ludvík & Mistrík",
        kategorie: "Saláty",
        leadTimeDny: 3,
        minMnozstvi: 1,
        alergeny: [3, 7, 9, 10],
        foto: "assets/img/salat-vlasky.jpg",
        dnyVyroby: [1, 2, 3, 4, 5, 6],
        aktivni: true,
        ceny: { koncova: 180, velkoobchod: 140, prodejna: 110 },
        varianty: [
            { id: "250g", nazev: "Vanička 250 g", koeficient: 0.25 },
            { id: "500g", nazev: "Vanička 500 g", koeficient: 0.5 },
            { id: "1000g", nazev: "Gastro balení 1000 g", koeficient: 1.0 }
        ]
    },

    // --- CUKRÁRNA LUDVÍK & MISTRÍK ---
    {
        kod: "CUK-DORT-01",
        nazev: "Zakázkový slavnostní dort",
        divize: "Cukrárna Ludvík & Mistrík",
        kategorie: "Dorty",
        leadTimeDny: 5,
        minMnozstvi: 1,
        alergeny: [1, 3, 7, 8],
        foto: "assets/img/dort-zakazkovy.jpg",
        dnyVyroby: [2, 3, 4, 5, 6],
        aktivni: true,
        ceny: { koncova: 470, velkoobchod: 410, prodejna: 360 },
        isCustomCake: true
    }
];