const inputLanguageDropdown = document.querySelector("#input-language");
const outputLanguageDropdown = document.querySelector("#output-language");
const inputTextElem = document.querySelector("#input-text");
const outputTextElem = document.querySelector("#output-text");
const swapBtn = document.querySelector("#swap-languages");
const charCount = document.querySelector("#char-count");

// List of languages (for simplicity)
const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
];

// Populate dropdowns with languages
function populateDropdown(dropdown, options) {
  const dropdownMenu = dropdown.querySelector(".dropdown-menu");
  dropdownMenu.innerHTML = ""; // Clear previous options
  options.forEach((option) => {
    const li = document.createElement("li");
    li.textContent = `${option.name} (${option.native})`;
    li.dataset.value = option.code;
    dropdownMenu.appendChild(li);
  });
}

populateDropdown(inputLanguageDropdown, languages);
populateDropdown(outputLanguageDropdown, languages);

// Toggle dropdown visibility
function setupDropdown(dropdown) {
  const button = dropdown.querySelector(".dropdown-button");
  const menu = dropdown.querySelector(".dropdown-menu");

  button.addEventListener("click", () => {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  });

  menu.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      button.textContent = e.target.textContent;
      button.dataset.value = e.target.dataset.value;
      menu.style.display = "none";
    }
  });

  // Close the menu if clicking outside
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      menu.style.display = "none";
    }
  });
}

setupDropdown(inputLanguageDropdown);
setupDropdown(outputLanguageDropdown);

// Character counter
inputTextElem.addEventListener("input", () => {
  charCount.textContent = inputTextElem.value.length;
  if (inputTextElem.value.length > 5000) {
    inputTextElem.value = inputTextElem.value.slice(0, 5000);
  }
});

// Swap languages
swapBtn.addEventListener("click", () => {
  const inputLangButton = inputLanguageDropdown.querySelector(".dropdown-button");
  const outputLangButton = outputLanguageDropdown.querySelector(".dropdown-button");

  const tempText = inputLangButton.textContent;
  const tempValue = inputLangButton.dataset.value;

  inputLangButton.textContent = outputLangButton.textContent;
  inputLangButton.dataset.value = outputLangButton.dataset.value;

  outputLangButton.textContent = tempText;
  outputLangButton.dataset.value = tempValue;

  // Swap text as well
  const tempInputText = inputTextElem.value;
  inputTextElem.value = outputTextElem.value;
  outputTextElem.value = tempInputText;

  translateText();
});

// Translate function using the Google Translate API (unofficial)
function translateText() {
  const inputText = inputTextElem.value.trim();
  if (!inputText) return;

  const inputLanguage = inputLanguageDropdown.querySelector(".dropdown-button").dataset.value;
  const outputLanguage = outputLanguageDropdown.querySelector(".dropdown-button").dataset.value;

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURIComponent(
    inputText
  )}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      outputTextElem.value = data[0].map((item) => item[0]).join("");
    })
    .catch((error) => {
      console.error("Error:", error);
      outputTextElem.value = "Translation failed. Please try again.";
    });
}

// Translate on input change
inputTextElem.addEventListener("input", translateText);
