document.addEventListener("DOMContentLoaded", function() {
  const sourceLangSelect = document.getElementById('sourceLang');
  const targetLangSelect = document.getElementById('targetLang');
  const voiceSelect = document.getElementById('voiceSelect');

  // Ajouter les langues disponibles
  const defaultLang = "fr";
  const languages = {
      "en": "Anglais",
      "es": "Espagnol",
      "de": "Allemand",
      "fr": "Français",
      "it": "Italien",
      "pt": "Portugais",
      // Ajoutez d'autres langues ici
  };

  Object.keys(languages).forEach(function(code) {
      const option = document.createElement('option');
      option.value = code;
      option.text = languages[code];
      sourceLangSelect.add(option.cloneNode(true));
      targetLangSelect.add(option.cloneNode(true));
  });

  sourceLangSelect.value = defaultLang;
  targetLangSelect.value = "en";

  function translateText() {
      const sourceText = document.getElementById("sourceText").value;
      const sourceLang = sourceLangSelect.value;
      const targetLang = targetLangSelect.value;

      if (sourceText.trim() === "") {
          document.getElementById("translatedText").value = "";
          return;
      }

      fetch(`https://api.mymemory.translated.net/get?q=${sourceText}&langpair=${sourceLang}|${targetLang}`)
          .then(response => response.json())
          .then(data => {
              const translatedText = data.responseData.translatedText;
              document.getElementById("translatedText").value = translatedText;
          })
          .catch(error => console.error('Erreur:', error));
  }

  document.getElementById("sourceText").addEventListener("input", function() {
      translateText();
      if (window.innerWidth <= 600 && !this.value.trim()) {
          document.querySelector(".text-output").style.display = "none";
      } else {
          document.querySelector(".text-output").style.display = "flex";
      }
  });

  function speakText(text, lang) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = lang;
      const selectedVoice = voiceSelect.value;
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) {
          speech.voice = voice;
      }
      window.speechSynthesis.speak(speech);
  }

  document.getElementById("speakSource").addEventListener("click", function() {
      const sourceText = document.getElementById("sourceText").value;
      speakText(sourceText, sourceLangSelect.value);
  });

  document.getElementById("speakOutput").addEventListener("click", function() {
      const translatedText = document.getElementById("translatedText").value;
      speakText(translatedText, targetLangSelect.value);
  });

  function copyToClipboard(text) {
      navigator.clipboard.writeText(text)
          .then(() => alert("Texte copié dans le presse-papier !"))
          .catch(err => console.error('Erreur de copie:', err));
  }

  document.getElementById("copySource").addEventListener("click", function() {
      const sourceText = document.getElementById("sourceText").value;
      copyToClipboard(sourceText);
  });

  document.getElementById("copyOutput").addEventListener("click", function() {
      const translatedText = document.getElementById("translatedText").value;
      copyToClipboard(translatedText);
  });

  document.getElementById("swapLang").addEventListener("click", function() {
      const sourceLang = sourceLangSelect.value;
      const targetLang = targetLangSelect.value;

      sourceLangSelect.value = targetLang;
      targetLangSelect.value = sourceLang;

      translateText();
  });

  function populateVoices() {
      const voices = window.speechSynthesis.getVoices();
      voiceSelect.innerHTML = "";
      
      voices.forEach(voice => {
          const option = document.createElement('option');
          option.value = voice.name;
          option.textContent = `${voice.name} (${voice.lang})`;
          voiceSelect.appendChild(option);
      });
  }

  if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoices;
  } else {
      populateVoices();
  }

  // Bouton partagé
  document.getElementById("shareBtn").addEventListener("click", function() {
      const translatedText = document.getElementById("translatedText").value;
      const url = window.location.href;
      const text = `Découvrez cette traduction : "${translatedText}" sur ${url}`;
      if (navigator.share) {
          navigator.share({
              title: 'Traduction Linguo',
              text: text,
              url: url
          })
          .catch(err => console.error('Erreur de partage:', err));
      } else {
          alert('Le partage n\'est pas pris en charge sur ce navigateur.');
      }
  });
});
