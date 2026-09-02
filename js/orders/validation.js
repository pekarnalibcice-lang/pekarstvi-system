/**
 * js/orders/validation.js
 * Pekařství Ludvík & Mistrík - Validační jádro košíku
 */

import { POBOČKY_KONTAKTY, STATNI_SVATKY } from "../catalog/holidays.js";
import { KATALOG_PRODUKTU } from "../catalog/products.js";

export function posunoutDatum(datumVychoziStr, dny) {
    const datum = new Date(datumVychoziStr);
    datum.setDate(datum.getDate() + dny);
    return datum.toISOString().slice(0, 10);
}

export function validovatDatumVyzvednuti(datumStr, pobockaId, polozkyKosiku) {
    const vybraneDatum = new Date(datumStr);
    const nyni = new Date();

    if (isNaN(vybraneDatum.getTime())) {
        return { platne: false, zprava: "Vyberte prosím platné datum vyzvednutí." };
    }

    // 1. Kontrola státních svátků
    const mesicDen = datumStr.slice(5);
    if (STATNI_SVATKY.includes(mesicDen)) {
        return {
            platne: false,
            typ: "svatek",
            zprava: "🌿 V tento den naše pece odpočívají a prodejna je z důvodu státního svátku uzavřena. Rádi vám vše připravíme na den předem nebo po svátku.",
            doporuceneDatum: posunoutDatum(datumStr, -1)
        };
    }

    // 2. Kontrola otevírací doby pobočky
    const pobocka = POBOČKY_KONTAKTY[pobockaId] || POBOČKY_KONTAKTY.kralupy;
    if (!pobocka.otevrenoDny.includes(vybraneDatum.getDay())) {
        return {
            platne: false,
            typ: "zavreno",
            zprava: `Pobočka ${pobocka.nazev} má v tento vybraný den zavřeno. Zvolte prosím jiný den nebo Bistro Libčice s celotýdenním provozem.`,
            telefon: pobocka.telefon,
            telefonLink: pobocka.telefonLink
        };
    }

    // 3. Kontrola technologického předstihu (Lead Time)
    const rozdilDni = Math.floor((vybraneDatum.setHours(12,0,0,0) - nyni.getTime()) / (1000 * 60 * 60 * 24));

    for (const polozka of polozkyKosiku) {
        const produkt = KATALOG_PRODUKTU.find(p => p.kod === polozka.kod);
        if (!produkt) continue;

        // Cukrárna: minimálně 5 dní
        if (produkt.leadTimeDny >= 5 && rozdilDni < 5) {
            return {
                platne: false,
                typ: "cukrarna",
                zprava: "🎂 Každý náš dort je poctivá ruční práce, která potřebuje svůj čas. Aby byl dort čerstvý, proleželý a nazdobený podle vašich představ, potřebují cukrářky alespoň 5 dní.",
                doporuceni: `Potřebujete dort dříve? Zavolejte přímo obsluze na ${pobocka.telefon} – prověříme kapacitu dílny a zkusíme vám vyjít vstříc!`,
                telefon: pobocka.telefon,
                telefonLink: pobocka.telefonLink,
                navrhovaneDatum: posunoutDatum(nyni.toISOString().slice(0, 10), 5)
            };
        }

        // Lahůdky: minimálně 3 dny
        if (produkt.leadTimeDny >= 3 && rozdilDni < 3) {
            return {
                platne: false,
                typ: "lahudky",
                zprava: "🥪 Lahůdky pro vás připravujeme vždy z čerstvě namíchaných salátů. Pro garanci maximální křupavosti přijímáme online objednávky s předstihem 3 dnů.",
                doporuceni: `Plánujete oslavu dříve? Zastavte se za námi nebo zavolejte na ${pobocka.telefon}, personál s vámi prověří expresní přípravu.`,
                telefon: pobocka.telefon,
                telefonLink: pobocka.telefonLink,
                navrhovaneDatum: posunoutDatum(nyni.toISOString().slice(0, 10), 3)
            };
        }

        // Pekárna: po 18:00 na zítřek
        if (produkt.leadTimeDny === 1 && rozdilDni <= 1 && nyni.getHours() >= 18) {
            return {
                platne: false,
                typ: "pekarna_vecer",
                zprava: "🥖 Pekaři už míchají těsta na noční směnu. Po 18. hodině je příjem pro následující den uzavřen.",
                doporuceni: "Ráno máme na prodejnách čerstvě napečeno pro volný prodej, případně rádi objednávku připravíme na další den.",
                navrhovaneDatum: posunoutDatum(nyni.toISOString().slice(0, 10), 2)
            };
        }
    }

    return { platne: true };
}