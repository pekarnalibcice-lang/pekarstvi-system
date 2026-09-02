/**
 * js/catalog/holidays.js
 * Pekařství Ludvík & Mistrík - Pobočky a kalendář svátků
 */

export const POBOČKY_KONTAKTY = {
    kralupy: {
        id: "kralupy",
        nazev: "Prodejna Kralupy nad Vltavou",
        telefon: "+420 315 000 111",
        telefonLink: "tel:+420315000111",
        otevrenoDny: [1, 2, 3, 4, 5, 6] // Po - So
    },
    libcice: {
        id: "libcice",
        nazev: "Prodejna Libčice nad Vltavou",
        telefon: "+420 315 000 222",
        telefonLink: "tel:+420315000222",
        otevrenoDny: [1, 2, 3, 4, 5, 6] // Po - So
    },
    bistro: {
        id: "bistro",
        nazev: "Bistro Libčice nad Vltavou",
        telefon: "+420 315 000 333",
        telefonLink: "tel:+420315000333",
        otevrenoDny: [1, 2, 3, 4, 5, 6, 0] // Po - Ne
    },
    rozvoz: {
        id: "rozvoz",
        nazev: "Rozvoz (pouze velkoobchod a Bistro)",
        telefon: "+420 315 000 999",
        telefonLink: "tel:+420315000999",
        otevrenoDny: [1, 2, 3, 4, 5] // Po - Pá
    }
};

export const STATNI_SVATKY = [
    "01-01", "05-01", "05-08", "07-05", 
    "07-06", "09-28", "10-28", "11-17", 
    "12-24", "12-25", "12-26"
];