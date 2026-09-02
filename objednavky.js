/**
 * Pekařství Ludvík & Mistrík - Objednávkový modul
 * Obsahuje: Katalog produktů, 3 cenové hladiny, kalendář svátků, 
 * zakázkové formuláře (Dorty, Chlebíčky, Saláty) a empatickou validaci košíku.
 */

// 1. ČÍSELNÍKY POBOČEK A KONTAKTŮ PRO RYCHLÉ VOLÁNÍ
const POBOČKY_KONTAKTY = {
    "kralupy": {
        id: "kralupy",
        nazev: "Prodejna Kralupy nad Vltavou",
        telefon: "+420 315 000 111",
        telefonLink: "tel:+420315000111",
        otevrenoDny: [1, 2, 3, 4, 5, 6] // Po - So
    },
    "libcice": {
        id: "libcice",
        nazev: "Prodejna Libčice nad Vltavou",
        telefon: "+420 315 000 222",
        telefonLink: "tel:+420315000222",
        otevrenoDny: [1, 2, 3, 4, 5, 6] // Po - So
    },
    "bistro": {
        id: "bistro",
        nazev: "Bistro Libčice nad Vltavou",
        telefon: "+420 315 000 333",
        telefonLink: "tel:+420315000333",
        otevrenoDny: [1, 2, 3, 4, 5, 6, 0] // Po - Ne
    },
    "rozvoz": {
        id: "rozvoz",
        nazev: "Rozvoz (pouze velkoobchod a Bistro)",
        telefon: "+420 315 000 999",
        telefonLink: "tel:+420315000999",
        otevrenoDny: [1, 2, 3, 4, 5] // Po - Pá
    }
};

// 2. STÁTNÍ SVÁTKY (MM-DD) PRO VYŘAZENÍ Z OBJEDNÁVEK
const STATNI_SVATKY_DNY = [
    "01-01", // Den obnovy / Nový rok
    "05-01", // Svátek práce
    "05-08", // Den vítězství
    "07-05", // Cyril a Metoděj
    "07-06", // Jan Hus
    "09-28", // Den české státnosti
    "10-28", // Vznik samostatného státu
    "11-17", // Den boje za svobodu
    "12-24", // Štědrý den
    "12-25", // 1. svátek vánoční
    "12-26"  // 2. svátek vánoční
];

// 3. ROZŠÍŘENÝ KATALOG PRODUKTŮ SE 3 CENAMI A DIVIZEMI
const KATALOG_PRODUKTU = [
    // --- PEKÁRNA LUDVÍK & MISTRÍK (Min. 1 den, uzávěrka 18:00) ---
    {
        kod: "PEK-CHL-01",
        nazev: "Kvasový chléb Šumava",
        divize: "Pekárna Ludvík & Mistrík",
        kategorie: "Chléb",
        leadTimeDny: 1,
        minMnozstvi: 1,
        alergeny: [1], // 1 = Obiloviny obsahující lepek
        foto: "img/chleb-sumava.jpg",
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
        foto: "img/rohlik.jpg",
        dnyVyroby: [1, 2, 3, 4, 5, 6],
        aktivni: true,
        ceny: { koncova: 4.5, velkoobchod: 3.2, prodejna: 2.5 },
        varianty: []
    },
    {
        kod: "PEK-KOL-01",
        nazev: "Svatební vázané koláčky (balení)",
        divize: "Pekárna Ludvík & Mistrík",
        kategorie: "Jemné pečivo",
        leadTimeDny: 2,
        minMnozstvi: 10, // Minimálně 10ks, pak po 1ks
        alergeny: [1, 3, 7], // Lepek, vejce, mléko
        foto: "img/kolacky.jpg",
        dnyVyroby: [4, 5, 6],
        aktivni: true,
        ceny: { koncova: 16, velkoobchod: 12, prodejna: 9.5 },
        varianty: []
    },

    // --- LAHŮDKY LUDVÍK & MISTRÍK (Min. 3 dny) ---
    {
        kod: "LAH-CHL-01",
        nazev: "Chlebíček šunkový na bramborovém salátě",
        divize: "Lahůdky Ludvík & Mistrík",
        kategorie: "Chlebíčky",
        leadTimeDny: 3,
        minMnozstvi: 1,
        alergeny: [1, 3, 7, 9, 10],
        foto: "img/chlebicek-sunka-salat.jpg",
        dnyVyroby: [1, 2, 3, 4, 5, 6],
        aktivni: true,
        ceny: { koncova: 35, velkoobchod: 28, prodejna: 22 },
        varianty: []
    },
    {
        kod: "LAH-CHL-02",
        nazev: "Chlebíček šunkový na čerstvém másle",
        divize: "Lahůdky Ludvík & Mistrík",
        kategorie: "Chlebíčky",
        leadTimeDny: 3,
        minMnozstvi: 1,
        alergeny: [1, 3, 7],
        foto: "img/chlebicek-sunka-maslo.jpg",
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
        foto: "img/salat-vlasky.jpg",
        dnyVyroby: [1, 2, 3, 4, 5, 6],
        aktivni: true,
        ceny: { koncova: 180, velkoobchod: 140, prodejna: 110 }, // Cena za 1 kg
        varianty: [
            { id: "250g", nazev: "Vanička 250 g", koeficient: 0.25 },
            { id: "500g", nazev: "Vanička 500 g", koeficient: 0.5 },
            { id: "1000g", nazev: "Gastro balení 1000 g", koeficient: 1.0 }
        ]
    },

    // --- CUKRÁRNA LUDVÍK & MISTRÍK (Min. 5 dní) ---
    {
        kod: "CUK-DORT-01",
        nazev: "Zakázkový slavnostní dort na míru",
        divize: "Cukrárna Ludvík & Mistrík",
        kategorie: "Dorty",
        leadTimeDny: 5,
        minMnozstvi: 1,
        alergeny: [1, 3, 7, 8],
        foto: "img/dort-zakazkovy.jpg",
        dnyVyroby: [2, 3, 4, 5, 6],
        aktivni: true,
        ceny: { koncova: 470, velkoobchod: 410, prodejna: 360 }, // Cena za 1 kg
        isCustomCake: true
    }
];

// 4. VALIDAČNÍ JÁDRO: KONTROLA TERMÍNŮ, SVÁTKŮ A EMPATICKÉ HLÁŠKY
function validovatDatumVyzvednuti(datumStr, vybranaPobockaId, kosikPolozky) {
    const datum = new Date(datumStr);
    const ted = new Date();
    
    // Test na neplatný formát
    if (isNaN(datum.getTime())) {
        return { platne: false, duvod: "Vyberte prosím platné datum vyzvednutí." };
    }

    // A) Kontrola státních svátků
    const mesicDen = datumStr.slice(5); // "MM-DD"
    if (STATNI_SVATKY_DNY.includes(mesicDen)) {
        return {
            platne: false,
            typChyby: "svatek",
            zprava: `🌿 V tento den naše pece odpočívají a prodejna je uzavřena z důvodu státního svátku. Rádi vám vše připravíme na den předem nebo po svátku.`,
            doporuceniDatum: ziskatPosunuteDatum(datumStr, -1)
        };
    }

    // B) Kontrola provozních dnů pobočky
    const pobocka = POBOČKY_KONTAKTY[vybranaPobockaId] || POBOČKY_KONTAKTY["kralupy"];
    const denTydne = datum.getDay();
    if (!pobocka.otevrenoDny.includes(denTydne)) {
        return {
            platne: false,
            typChyby: "zavreno",
            zprava: `Pobočka ${pobocka.nazev} má v tento den zavřeno. Zvolte prosím jiný den nebo naše Bistro Libčice, které má otevřeno denně.`,
            telefonLink: pobocka.telefonLink,
            telefon: pobocka.telefon
        };
    }

    // C) Kontrola technologického předstihu (Lead times) pro položky v košíku
    const rozdilMs = datum.setHours(12,0,0,0) - ted.getTime();
    const rozdilDni = Math.floor(rozdilMs / (1000 * 60 * 60 * 24));
    const aktualniHodina = ted.getHours();

    for (let p of kosikPolozky) {
        const prod = KATALOG_PRODUKTU.find(k => k.kod === p.kod);
        if (!prod) continue;

        // 1. CUKRÁRNA (DORTY): Min. 5 dní (120 hodin)
        if (prod.leadTimeDny >= 5 && rozdilDni < 5) {
            return {
                platne: false,
                typChyby: "cukrarna_termin",
                zprava: `🎂 Každý náš dort je poctivá ruční práce, která potřebuje svůj čas. Aby byl čerstvý, proleželý a nazdobený podle představ, potřebují cukrářky alespoň 5 dní.`,
                doplnkoveInfo: `Potřebujete dort dříve? Zavolejte nám na prodejnu na ${pobocka.telefon} – prověříme kapacitu dílny a zkusíme vám vyjít vstříc!`,
                telefonLink: pobocka.telefonLink,
                telefon: pobocka.telefon,
                navrhovaneDatum: ziskatPosunuteDatum(ted.toISOString().slice(0, 10), 5)
            };
        }

        // 2. LAHŮDKY (CHLEBÍČKY & SALÁTY): Min. 3 dny
        if (prod.leadTimeDny >= 3 && rozdilDni < 3) {
            return {
                platne: false,
                typChyby: "lahudky_termin",
                zprava: `🥪 Lahůdky připravujeme vždy z čerstvě namíchaných salátů. Pro garanci maximální křupavosti přijímáme online objednávky s předstihem 3 dnů.`,
                doplnkoveInfo: `Plánujete oslavu dříve? Zastavte se za námi nebo zavolejte na ${pobocka.telefon}, personál s vámi prověří expresní přípravu.`,
                telefonLink: pobocka.telefonLink,
                telefon: pobocka.telefon,
                navrhovaneDatum: ziskatPosunuteDatum(ted.toISOString().slice(0, 10), 3)
            };
        }

        // 3. PEKÁRNA: Do 18:00 na zítra
        if (prod.leadTimeDny === 1 && rozdilDni <= 1 && aktualniHodina >= 18) {
            return {
                platne: false,
                typChyby: "pekarna_vecer",
                zprava: `🥖 Pekaři už míchají těsta na noční směnu. Po 18. hodině je noční výroba uzavřena.`,
                doplnkoveInfo: `Ráno máme na prodejnách čerstvě napečeno pro volný pultový prodej, případně rádi připravíme objednávku na další den.`,
                navrhovaneDatum: ziskatPosunuteDatum(ted.toISOString().slice(0, 10), 2)
            };
        }
    }

    return { platne: true };
}

// Pomocná funkce pro bezpečný posun data
function ziskatPosunuteDatum(vychoziDatumStr, pocetDni) {
    const d = new Date(vychoziDatumStr);
    d.setDate(d.getDate() + pocetDni);
    return d.toISOString().slice(0, 10);
}

// 5. STRUKTURA ZAKÁZKOVÉHO DORTU (Dle papírového formuláře Cukrárny)
function vytvoritPolozkuZakazkovehoDortu({
    korpus,        // "Světlý" | "Tmavý" | "Ořechový" | "Red Velvet"
    napln,         // "Máslový krém" | "Mascarpone" | "Šlehačka" | "Tvarohový"
    finalniUprava, // "Potahovací hmota" | "Čokoláda" | "Krém" | "Mascarpone"
    ovoceNapln,    // boolean
    ovoceZdobeni,  // boolean
    oslavenecJmeno,// string
    oslavenecVek,  // number/string
    proKolikLidi,  // number/string
    maxCena,       // number
    poznamka,      // string
    zalohaKc,      // number
    paragonCislo   // string (číslo paragonu z kasy)
}) {
    return {
        kod: "CUK-DORT-01",
        nazev: `Zakázkový dort (${korpus}, ${napln})`,
        divize: "Cukrárna Ludvík & Mistrík",
        pocetKusu: 1,
        jednotkovaCena: 470, // Základní cena za kg dle formuláře
        parametryDortu: {
            korpus,
            napln,
            finalniUprava,
            ovoce: { vNaplni: !!ovoceNapln, zdobeni: !!ovoceZdobeni },
            oslavenec: { jmeno: oslavenecJmeno, vek: oslavenecVek },
            proKolikLidi,
            maxCena,
            poznamka
        },
        evidenceZalohy: {
            castka: zalohaKc || 0,
            paragonCislo: paragonCislo || null,
            zaplacenoDne: zalohaKc > 0 ? new Date().toISOString() : null
        }
    };
}