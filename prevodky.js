/**
 * Modul pro vnitrofiremní převodky mezi středisky:
 * Pekárna Kralupy, Knedlíkárna Libčice, Bistro Libčice, Vedení společnosti
 */

// Seznam platných středisek pro validaci
const POVOLENA_STREDISKA = [
    "pekarna-kralupy",
    "knedlikarna-libcice",
    "bistro-libcice",
    "vedeni-spolecnosti"
];

// Simulovaná databáze převodek v paměti
const databazePrevodek = [];

/**
 * Vytvoření nové převodky
 * @param {string} odesilatelId - ID výchozího střediska
 * @param {string} prijemceId - ID cílového střediska
 * @param {Array<{polozkaId: string, nazev: string, mnozstvi: number, jednotka: string}>} polozky - Položky převodky
 * @param {string} uzivatelId - Kdo převodku založil
 * @returns {Object} Vytvořená převodka
 */
function vytvoritPrevodku(odesilatelId, prijemceId, polozky, uzivatelId) {
    if (!POVOLENA_STREDISKA.includes(odesilatelId) || !POVOLENA_STREDISKA.includes(prijemceId)) {
        throw new Error("Neplatné středisko odesílatele nebo příjemce.");
    }

    if (odesilatelId === prijemceId) {
        throw new Error("Nelze převádět položky v rámci stejného střediska.");
    }

    if (!Array.isArray(polozky) || polozky.length === 0) {
        throw new Error("Převodka musí obsahovat alespoň jednu položku.");
    }

    const novaPrevodka = {
        id: `PREV-${Date.now()}`,
        odesilatelId,
        prijemceId,
        polozky,
        stav: "NOVA", // Životní cyklus: NOVA -> ODESLANA -> PRIJATA (případně STORNOVANO)
        vytvorenoDne: new Date().toISOString(),
        historiePohybu: [
            {
                stav: "NOVA",
                cas: new Date().toISOString(),
                uzivatelId,
                zprava: "Převodka vytvořena"
            }
        ]
    };

    databazePrevodek.push(novaPrevodka);
    return novaPrevodka;
}

/**
 * Změna stavu převodky (expedice / převzetí / storno)
 * @param {string} prevodkaId - Identifikátor převodky
 * @param {'ODESLANA' | 'PRIJATA' | 'STORNOVANO'} cilovyStav - Nový stav
 * @param {string} uzivatelId - ID pracovníka provádějícího změnu
 * @param {string} [poznamka=""] - Volitelná poznámka
 * @returns {Object} Aktualizovaná převodka
 */
function zmenitStavPrevodky(prevodkaId, cilovyStav, uzivatelId, poznamka = "") {
    const prevodka = databazePrevodek.find(p => p.id === prevodkaId);

    if (!prevodka) {
        throw new Error(`Převodka ${prevodkaId} nebyla nalezena.`);
    }

    const pravidlaPrechodu = {
        NOVA: ["ODESLANA", "STORNOVANO"],
        ODESLANA: ["PRIJATA", "STORNOVANO"],
        PRIJATA: [],
        STORNOVANO: []
    };

    if (!pravidlaPrechodu[prevodka.stav].includes(cilovyStav)) {
        throw new Error(`Nepovolená změna stavu z ${prevodka.stav} na ${cilovyStav}.`);
    }

    prevodka.stav = cilovyStav;
    prevodka.historiePohybu.push({
        stav: cilovyStav,
        cas: new Date().toISOString(),
        uzivatelId,
        zprava: poznamka
    });

    return prevodka;
}

/**
 * Filtrování převodek pro konkrétní středisko
 * @param {string} strediskoId - ID střediska
 * @returns {Array<Object>}
 */
function vypsatPrevodkyStrediska(strediskoId) {
    return databazePrevodek.filter(
        p => p.odesilatelId === strediskoId || p.prijemceId === strediskoId
    );
}

export {
    POVOLENA_STREDISKA,
    databazePrevodek,
    vytvoritPrevodku,
    zmenitStavPrevodky,
    vypsatPrevodkyStrediska
};
