const languages = {
    "en": "Anglais",
    "fr": "Français",
    "es": "Espagnol",
    "de": "Allemand",
    "it": "Italien",
    "zh-CN": "Chinois (Simplifié)",
    "ja": "Japonais",
    "ru": "Russe",
    "pt": "Portugais",
    "ar": "Arabe",
    "nl": "Néerlandais",
    "sv": "Suédois",
    "da": "Danois",
    "fi": "Finnois",
    "pl": "Polonais",
    "tr": "Turc",
    "he": "Hébreu",
    "th": "Thaï",
    "vi": "Vietnamien",
    "ko": "Coréen",
    "cs": "Tchèque",
    "hu": "Hongrois",
    "ro": "Roumain",
    "sk": "Slovaque",
    "bg": "Bulgare",
    "sr": "Serbe",
    "hr": "Croate",
    // Ajouter d'autres langues selon les besoins
};

const sourceLangSelect = document.getElementById('sourceLang');
const targetLangSelect = document.getElementById('targetLang');

Object.keys(languages).forEach(function(code) {
    const option1 = document.createElement('option');
    const option2 = document.createElement('option');
    option1.value = option2.value = code;
    option1.text = option2.text = languages[code];
    sourceLangSelect.add(option1);
    targetLangSelect.add(option2);
});

sourceLangSelect.value = "fr";
targetLangSelect.value = "en";
