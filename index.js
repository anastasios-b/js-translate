// Load this file in the DOM at the ending of the <body> element to activate the library


// Find the file for the current language code (if exists, else leave everything as it is)
const findTranslationsForLanguage = async (languageCode) => {
    try {
        const response = await fetch(`./translations/${languageCode}.json`);
        if (!response.ok) {
            throw new Error(`Translation file for ${languageCode} not found`);
        }

        const translationData = await response.json();
        return translationData;

    } catch (error) {
        console.error("Error loading translation file:", error);
    }
}

// Get HTML elements marked for translation.
// Then, push their keys to the array of elements to be translated
const scrapeKeysToTranslate = async () => {
    const elementsToTranslate = document.querySelectorAll("[aria-translate='true']");
    const elementsToTranslateKeys = [];
    
    elementsToTranslate.forEach((element) => {
        // Get the translation key from the aria-translate-key attribute
        const key = element.getAttribute('aria-translate-key');
        if (key) {
            elementsToTranslateKeys.push({ element, key });
        }
    });

    return elementsToTranslateKeys;
}

// Apply the translated text to the HTML elements
const applyTranslations = async (translationData) => {
    // Ensure translationData is an object
    if (typeof translationData !== 'object' || Array.isArray(translationData)) {
        console.error("Translation data is not an object:", translationData);
        return;
    }

    const elementsToTranslate = await scrapeKeysToTranslate();

    elementsToTranslate.forEach(({ element, key }) => {
        // Find the translation by key in the translationData object
        const translation = translationData[key]; // Access the translation directly using the key

        // If translation is found, apply it
        if (translation) {
            element.innerHTML = "";
            element.textContent = translation; // Set the translated text to the element
        } else {
            console.warn(`Translation not found for key: ${key}`);
        }
    });
}

// Initiate the language change
const changeLanguage = async (languageCode) => {
    const translationData = await findTranslationsForLanguage(languageCode);
    if (translationData) {
        // Change the lang attribute of the <html> tag for accessibility
        document.documentElement.setAttribute("lang", languageCode);

        // First apply the translations to the elements
        applyTranslations(translationData);
    }
}

// Function to detect the browser's default language
const detectBrowserLanguage = () => {
    // Get the browser's language (e.g., 'en', 'el')
    const language = navigator.language.split('-')[0];
    return language;
}

// Function to monitor language changes in the browser (via `navigator.language`)
const monitorBrowserLanguageChange = () => {
    // Store the current browser language
    let currentLanguage = detectBrowserLanguage();

    // Periodically check if the browser language has changed
    setInterval(() => {
        const newLanguage = detectBrowserLanguage();
        if (newLanguage !== currentLanguage) {
            currentLanguage = newLanguage;
            console.log(`Browser language changed to: ${currentLanguage}`);
            changeLanguage(currentLanguage);  // Re-load translations based on the new language
        }
    }, 1000);  // Check every second (can be adjusted to a longer interval)
}

// Function to initiate the library (loads initial language and sets up monitoring)
const initiateLibrary = async () => {
    let currentLanguage = detectBrowserLanguage();
   await changeLanguage(currentLanguage);

   // Watch for browser language changes
   monitorBrowserLanguageChange();
}

// Load the script once the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initiateLibrary();
});