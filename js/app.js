/**
 * js/app.js
 * Pekařství Ludvík & Mistrík - Hlavní aplikační kontroler
 */

import { KATALOG_PRODUKTU } from "./catalog/products.js";
import { POBOČKY_KONTAKTY } from "./catalog/holidays.js";
import { validovatDatumVyzvednuti, posunoutDatum } from "./orders/validation.js";

// ==========================================
// 1. ŽIVÉ HODINY A DATUM TERMINÁLU
// ==========================================
const elClock = document.getElementById("attendance-clock");
const elDateDisplay = document.getElementById("terminal-date-display");

function aktualizovatCas() {
    const ted = new Date();
    if (elClock) {
        elClock.textContent = ted.toLocaleTimeString("cs-CZ");
    }
    if (elDateDisplay) {
        elDateDisplay.textContent = ted.toLocaleDateString("cs-CZ");
    }
}
setInterval(aktualizovatCas, 1000);
aktualizovatCas();

// ==========================================
// 2. KONTROLA AUTORIZACE TERMINÁLU
// ==========================================
const headerDeviceText = document.getElementById("header-device-text");
const headerDeviceBadge = document.getElementById("header-device-badge");
const unauthorizedBanner = document.getElementById("device-unauthorized-banner");

function overitAutorizaciZarizeni() {
    const ulozenyKlic = localStorage.getItem("pekarstvi_terminal_token");
    if (ulozenyKlic) {
        headerDeviceText.textContent = "Terminál: Autorizován";
        headerDeviceBadge.className = "inline-flex items-center gap-1 bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700 text-emerald-200";
        unauthorizedBanner.classList.add("hidden");
    } else {
        headerDeviceText.textContent = "Terminál: Neautorizován";
        headerDeviceBadge.className = "inline-flex items-center gap-1 bg-rose-900/80 px-2 py-0.5 rounded border border-rose-700 text-rose-200";
        unauthorizedBanner.classList.remove("hidden");
    }
}
overitAutorizaciZarizeni();

// ==========================================
// 3. PŘEPÍNÁNÍ HLAVNÍCH MODULŮ (TABŮ)
// ==========================================
const navTabs = {
    attendance: { btn: document.getElementById("nav-btn-attendance"), sec: document.getElementById("module-attendance") },
    orders: { btn: document.getElementById("nav-btn-orders"), sec: document.getElementById("module-orders") },
    admin: { btn: document.getElementById("nav-btn-admin"), sec: document.getElementById("module-admin") }
};

Object.keys(navTabs).forEach(key => {
    const tab = navTabs[key];
    if (!tab.btn || !tab.sec) return;

    tab.btn.addEventListener("click", () => {
        Object.values(navTabs).forEach(t => {
            t.sec.classList.remove("active");
            t.btn.className = "nav-tab-btn px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 text-amber-200 hover:text-white hover:bg-amber-800/50";
        });

        tab.sec.classList.add("active");
        tab.btn.className = "nav-tab-btn px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 bg-amber-800 text-white shadow";

        if (key === "orders") {
            vykreslitKatalogObjednavek();
        }
    });
});

// ==========================================
// 4. OBSLUHA PIN KLÁVESNICE A DOCHÁZKY
// ==========================================
let zadanyPin = "";
const pinFeedback = document.getElementById("pin-feedback-msg");
const loggedUserName = document.getElementById("logged-user-name");
const loggedUserRole = document.getElementById("logged-user-role");
const btnLogoutUser = document.getElementById("btn-logout-user");
const headerUserBadge = document.getElementById("header-user-badge");

// Demo databáze personálu pro testování
const ZAMESTNANCI = [
    { pin: "1234", jmeno: "Anna Novotná", role: "Prodavačka (Libčice)" },
    { pin: "8899", jmeno: "Karel Mistrík", role: "Mistr pekař" },
    { pin: "5544", jmeno: "Elena Horáková", role: "Mistrová cukrářka" }
];

let aktivniPracovnik = null;

function aktualizovatPinTecky() {
    for (let i = 0; i < 4; i++) {
        const dot = document.getElementById(`dot-${i}`);
        if (dot) {
            if (i < zadanyPin.length) {
                dot.classList.add("filled");
            } else {
                dot.classList.remove("filled");
            }
        }
    }
}

document.querySelectorAll(".pin-keypad-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        if (zadanyPin.length < 4) {
            zadanyPin += btn.getAttribute("data-number");
            aktualizovatPinTecky();
        }
    });
});

document.getElementById("pin-btn-clear").addEventListener("click", () => {
    zadanyPin = "";
    aktualizovatPinTecky();
    pinFeedback.textContent = "Zadejte kód a stiskněte Potvrdit";
    pinFeedback.className = "text-center text-xs font-semibold text-stone-500 min-h-[1.5rem] flex items-center justify-center";
});

document.getElementById("pin-btn-enter").addEventListener("click", () => {
    if (zadanyPin.length !== 4) {
        pinFeedback.textContent = "Zadejte kompletní 4místný PIN!";
        pinFeedback.className = "text-center text-xs font-semibold text-rose-600 min-h-[1.5rem] flex items-center justify-center";
        return;
    }

    const nalezeny = ZAMESTNANCI.find(z => z.pin === zadanyPin);
    if (nalezeny) {
        aktivniPracovnik = nalezeny;
        loggedUserName.textContent = nalezeny.jmeno;
        loggedUserRole.textContent = nalezeny.role;
        headerUserBadge.textContent = `${nalezeny.jmeno} (${nalezeny.role})`;
        btnLogoutUser.classList.remove("hidden");
        
        pinFeedback.textContent = `Vítejte, ${nalezeny.jmeno}! Zvolte akci docházky.`;
        pinFeedback.className = "text-center text-xs font-semibold text-emerald-700 min-h-[1.5rem] flex items-center justify-center";
        
        zadanyPin = "";
        aktualizovatPinTecky();
    } else {
        pinFeedback.textContent = "Neplatný PIN. Zkuste to znovu.";
        pinFeedback.className = "text-center text-xs font-semibold text-rose-600 min-h-[1.5rem] flex items-center justify-center";
        zadanyPin = "";
        aktualizovatPinTecky();
    }
});

btnLogoutUser.addEventListener("click", () => {
    aktivniPracovnik = null;
    loggedUserName.textContent = "Nepřihlášeno";
    loggedUserRole.textContent = "Zadejte PIN na levém panelu";
    headerUserBadge.textContent = "Nepřihlášen";
    btnLogoutUser.classList.add("hidden");
    pinFeedback.textContent = "Uživatel byl odhlášen.";
});

// Zápis docházkových akcí do tabulky
const tableBodyAttendance = document.getElementById("attendance-records-table-body");

function zaznamenatUdalost(nazevUdalosti, barvaBadge) {
    if (!aktivniPracovnik) {
        alert("Nejprve se prosím přihlaste zadáním PINu na číselníku.");
        return;
    }

    const nyni = new Date();
    const casStr = nyni.toLocaleTimeString("cs-CZ");
    
    // Odstranění prázdného řádku
    if (tableBodyAttendance.querySelector("td[colspan='5']")) {
        tableBodyAttendance.innerHTML = "";
    }

    const radek = document.createElement("tr");
    radek.className = "hover:bg-stone-50 transition-colors";
    radek.innerHTML = `
        <td class="py-2.5 px-3 font-mono font-bold text-stone-900">${casStr}</td>
        <td class="py-2.5 px-3 font-semibold text-stone-800">${aktivniPracovnik.jmeno}</td>
        <td class="py-2.5 px-3 text-stone-500">${aktivniPracovnik.role}</td>
        <td class="py-2.5 px-3"><span class="${barvaBadge} px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">${nazevUdalosti}</span></td>
        <td class="py-2.5 px-3 text-stone-400">Terminál Libčice</td>
    `;
    tableBodyAttendance.prepend(radek);
}

document.getElementById("act-btn-arrival").addEventListener("click", () => zaznamenatUdalost("Příchod", "bg-emerald-100 text-emerald-800"));
document.getElementById("act-btn-departure").addEventListener("click", () => zaznamenatUdalost("Odchod", "bg-rose-100 text-rose-800"));
document.getElementById("act-btn-break").addEventListener("click", () => zaznamenatUdalost("Pauza", "bg-amber-100 text-amber-800"));
document.getElementById("act-btn-doctor").addEventListener("click", () => zaznamenatUdalost("Lékař", "bg-sky-100 text-sky-800"));

// ==========================================
// 5. OBJEDNÁVKOVÝ SYSTÉM & EMPATICKÁ VALIDACE
// ==========================================
const selectBranch = document.getElementById("order-select-branch");
const inputDate = document.getElementById("order-input-date");
const selectPriceTier = document.getElementById("order-select-price-tier");
const catalogGrid = document.getElementById("catalog-products-grid");
const validationBox = document.getElementById("validation-notice-box");

// Výchozí datum na zítřek
const zitra = new Date();
zitra.setDate(zitra.getDate() + 1);
inputDate.value = zitra.toISOString().slice(0, 10);

let kosik = [];
let aktivniFiltrDivize = "vse";

// Přepínání filtrů divizí
document.querySelectorAll(".filter-div-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-div-btn").forEach(b => {
            b.classList.remove("active", "bg-white", "text-stone-900", "shadow-sm");
            b.classList.add("text-stone-600");
        });
        btn.classList.add("active", "bg-white", "text-stone-900", "shadow-sm");
        btn.classList.remove("text-stone-600");
        aktivniFiltrDivize = btn.getAttribute("data-divize");
        vykreslitKatalogObjednavek();
    });
});

selectPriceTier.addEventListener("change", vykreslitKatalogObjednavek);
inputDate.addEventListener("change", spustitValidaciTerminu);
selectBranch.addEventListener("change", spustitValidaciTerminu);

function vykreslitKatalogObjednavek() {
    if (!catalogGrid) return;
    const cenovaHladina = selectPriceTier.value;
    catalogGrid.innerHTML = "";

    const polozky = KATALOG_PRODUKTU.filter(p => {
        if (aktivniFiltrDivize === "vse") return true;
        return p.divize.includes(aktivniFiltrDivize);
    });

    polozky.forEach(prod => {
        const karta = document.createElement("div");
        karta.className = "bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between hover:shadow-md transition";

        const cena = prod.ceny[cenovaHladina] || prod.ceny.koncova;
        const alergenyInfo = prod.alergeny && prod.alergeny.length ? `Alergeny: ${prod.alergeny.join(", ")}` : "Bez alergenů";

        karta.innerHTML = `
            <div>
                <div class="flex justify-between items-center mb-1">
                    <span class="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">${prod.divize}</span>
                    <span class="text-[10px] text-stone-400 font-mono">${prod.kod}</span>
                </div>
                <h4 class="font-bold text-base text-stone-900 mt-2">${prod.nazev}</h4>
                <div class="text-xs text-stone-500 mt-1">${alergenyInfo}</div>
                <div class="text-xs text-stone-600 mt-3 bg-stone-50 p-2.5 rounded-lg border border-stone-100 flex justify-between">
                    <span>Min. množství: <strong>${prod.minMnozstvi} ks</strong></span>
                    <span>Předstih: <strong>${prod.leadTimeDny} dny</strong></span>
                </div>
            </div>
            <div class="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                    <span class="text-xs text-stone-400 block leading-none">Cena / ks</span>
                    <span class="text-xl font-bold text-stone-900">${cena} Kč</span>
                </div>
                <button class="btn-pridat-kosik bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm" data-kod="${prod.kod}">
                    + Přidat do košíku
                </button>
            </div>
        `;

        karta.querySelector(".btn-pridat-kosik").addEventListener("click", () => {
            pridatDoKosiku(prod);
        });

        catalogGrid.appendChild(karta);
    });

    spustitValidaciTerminu();
}

function pridatDoKosiku(produkt) {
    const existujici = kosik.find(k => k.kod === produkt.kod);
    if (existujici) {
        existujici.pocet += 1;
    } else {
        kosik.push({ kod: produkt.kod, nazev: produkt.nazev, pocet: produkt.minMnozstvi || 1 });
    }
    vykreslitKosik();
    spustitValidaciTerminu();
}

function vykreslitKosik() {
    const container = document.getElementById("cart-items-container");
    const summaryPrice = document.getElementById("order-summary-price");
    const cenovaHladina = selectPriceTier.value;

    if (kosik.length === 0) {
        container.innerHTML = `<div class="text-center py-6 text-stone-400 text-xs italic">V košíku zatím nemáte vybrané žádné zboží.</div>`;
        summaryPrice.textContent = "0 Kč";
        return;
    }

    container.innerHTML = "";
    let celkem = 0;

    kosik.forEach((polozka, index) => {
        const prod = KATALOG_PRODUKTU.find(p => p.kod === polozka.kod);
        const cenaKus = prod ? (prod.ceny[cenovaHladina] || prod.ceny.koncova) : 0;
        const radekCena = cenaKus * polozka.pocet;
        celkem += radekCena;

        const row = document.createElement("div");
        row.className = "flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs";
        row.innerHTML = `
            <div>
                <strong class="text-stone-900 text-sm">${polozka.nazev}</strong>
                <div class="text-stone-500">${cenaKus} Kč / ks</div>
            </div>
            <div class="flex items-center gap-3">
                <div class="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                    <button class="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 btn-minus" data-idx="${index}">-</button>
                    <span class="px-3 font-bold text-stone-800">${polozka.pocet}</span>
                    <button class="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 btn-plus" data-idx="${index}">+</button>
                </div>
                <div class="font-bold text-stone-900 w-16 text-right">${radekCena} Kč</div>
            </div>
        `;

        row.querySelector(".btn-minus").addEventListener("click", () => {
            if (polozka.pocet > (prod.minMnozstvi || 1)) {
                polozka.pocet -= 1;
            } else {
                kosik.splice(index, 1);
            }
            vykreslitKosik();
            spustitValidaciTerminu();
        });

        row.querySelector(".btn-plus").addEventListener("click", () => {
            polozka.pocet += 1;
            vykreslitKosik();
            spustitValidaciTerminu();
        });

        container.appendChild(row);
    });

    summaryPrice.textContent = `${celkem} Kč`;
}

document.getElementById("btn-clear-cart").addEventListener("click", () => {
    kosik = [];
    vykreslitKosik();
    spustitValidaciTerminu();
});

function spustitValidaciTerminu() {
    const datum = inputDate.value;
    const pobocka = selectBranch.value;
    const btnSubmit = document.getElementById("btn-submit-order");

    // Pokud je košík prázdný, validujeme termín obecně
    const testPolozky = kosik.length > 0 ? kosik : [{ kod: "CUK-DORT-01" }, { kod: "LAH-CHL-01" }];
    const vysledek = validovatDatumVyzvednuti(datum, pobocka, testPolozky);

    if (!vysledek.platne) {
        validationBox.classList.remove("hidden");
        validationBox.className = "mb-6 p-4 rounded-2xl border bg-amber-50 border-amber-300 text-amber-950 shadow-sm";
        
        let telefonTlacitko = "";
        if (vysledek.telefonLink) {
            telefonTlacitko = `<a href="${vysledek.telefonLink}" class="inline-flex items-center gap-2 mt-3 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold px-3 py-2 rounded-lg transition shadow">📞 Zavolat na prodejnu: ${vysledek.telefon}</a>`;
        }

        let posunTlacitko = "";
        if (vysledek.navrhovaneDatum) {
            posunTlacitko = `<button id="btn-apply-suggested-date" class="inline-flex items-center gap-1 mt-3 ml-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold px-3 py-2 rounded-lg transition">Posunout na ${vysledek.navrhovaneDatum}</button>`;
        }

        validationBox.innerHTML = `
            <div class="font-bold text-sm mb-1">${vysledek.zprava}</div>
            <div class="text-xs text-amber-800">${vysledek.doporuceni || ""}</div>
            <div class="flex flex-wrap items-center">
                ${telefonTlacitko}
                ${posunTlacitko}
            </div>
        `;

        const applyBtn = document.getElementById("btn-apply-suggested-date");
        if (applyBtn) {
            applyBtn.addEventListener("click", () => {
                inputDate.value = vysledek.navrhovaneDatum;
                spustitValidaciTerminu();
            });
        }

        if (btnSubmit) btnSubmit.disabled = true;
    } else {
        validationBox.classList.add("hidden");
        if (btnSubmit) btnSubmit.disabled = false;
    }
}

// ==========================================
// 6. SPRÁVA TERMINÁLŮ (AKTIVACE / ADMIN)
// ==========================================
const btnShowActivateModal = document.getElementById("btn-show-activate-modal");
const modalActivate = document.getElementById("modal-activate-device");
const btnCloseActivateModal = document.getElementById("btn-close-activate-modal");
const btnConfirmActivate = document.getElementById("btn-confirm-activate-device");
const inputActivationKey = document.getElementById("input-modal-activation-key");
const activationError = document.getElementById("modal-activation-error");

if (btnShowActivateModal) {
    btnShowActivateModal.addEventListener("click", () => {
        modalActivate.classList.remove("hidden");
        modalActivate.classList.add("flex");
    });
}

if (btnCloseActivateModal) {
    btnCloseActivateModal.addEventListener("click", () => {
        modalActivate.classList.add("hidden");
        modalActivate.classList.remove("flex");
    });
}

if (btnConfirmActivate) {
    btnConfirmActivate.addEventListener("click", () => {
        const zadanyKlic = inputActivationKey.value.trim();
        if (zadanyKlic.startsWith("LUDVIK-")) {
            localStorage.setItem("pekarstvi_terminal_token", zadanyKlic);
            modalActivate.classList.add("hidden");
            modalActivate.classList.remove("flex");
            overitAutorizaciZarizeni();
            alert("Zařízení bylo úspěšně autorizováno k provozu!");
        } else {
            activationError.textContent = "Neplatný formát aktivačního klíče (musí začínat LUDVIK-).";
            activationError.classList.remove("hidden");
        }
    });
}