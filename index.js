// Load this file in the DOM at the ending of the <body> element to activate the library


// Load config and settings
const loadConfig = async () => {
    try {
        const response = await fetch(`/config.json`);
        if (!response.ok) {
            throw new Error(`Config file is missing. Create a config.json to set up the translation rules.`);
        }

        const config = await response.json();
        console.log(config);
        return config;

    } catch (error) {
        console.error("Error loading config file:", error);
        return null;
    }
}

// Find the file for the current language code (if exists, else leave everything as it is)
const findTranslationsForLanguage = async (languageCode) => {
    try {
        const response = await fetch(`/translations/${languageCode}.json`);
        if (!response.ok) {
            throw new Error(`Translation file for ${languageCode} not found`);
        }

        const translationData = await response.json();
        return translationData;

    } catch (error) {
        console.error("Error loading translation file:", error);
        return null;
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
        
        // Rebind events after translation
        bindLanguageSwitchers();
        
        // Store language code or modify URL based on config
        const config = await loadConfig();
        
        // Only proceed if config loading succeeded
        if (!config) {
            return;
        }
        
        switch (config.recognize_language_by) {
            case "url":
                // Modify URL path to include language code
                const pathSegments = window.location.pathname.split('/').filter(segment => segment);
                // Remove existing language code if present
                if (pathSegments.length > 0 && /^[a-z]{2}$/.test(pathSegments[0])) {
                    pathSegments.shift();
                }
                // Build new URL with language code
                const newPath = '/' + languageCode + (pathSegments.length > 0 ? '/' + pathSegments.join('/') : '/');
                window.history.replaceState({}, '', newPath);
                
                // Rebind events after URL change
                setTimeout(bindLanguageSwitchers, 10);
                break;
            case "url_parameter":
                // Modify URL parameter
                const url = new URL(window.location);
                url.searchParams.set(config.language_key, languageCode);
                window.history.replaceState({}, '', url.toString());
                break;
            case "cookie":
                // Store in cookie
                document.cookie = `${config.language_key}=${languageCode}; path=/; max-age=31536000`; // 1 year expiry
                break;
            case "local_storage":
                // Store in localStorage
                localStorage.setItem(config.language_key, languageCode);
                break;
        }
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

// Change language depending on config.json file rules
const detectLanguage = async () => {
    // Load config data
    const config = await loadConfig();
    
    // Return null if config loading failed
    if (!config) {
        return null;
    }

    console.log(config);

    // Get language code depending on config rules
    var languageKey = null;
    if (config.recognize_language_by == 'cookie' || config.recognize_language_by == 'local_storage') {
        languageKey = config.language_key;
    }
    var languageCode = null;
    switch (config.recognize_language_by) {
        case "url":
            // Extract language code from URL path (e.g., /en/page or /el/page)
            const pathSegments = window.location.pathname.split('/').filter(segment => segment);
            if (pathSegments.length > 0) {
                languageCode = pathSegments[0];
            }
            break;
        case "url_parameter":
            // Extract language code from URL parameter (e.g., ?lang=en or ?lang=el)
            const urlParams = new URLSearchParams(window.location.search);
            languageCode = urlParams.get(config.language_key);
            break;
        case "cookie":
            // Extract language code from cookie
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === languageKey) {
                    languageCode = value;
                    break;
                }
            }
            break;
        case "local_storage":
            // Extract language code from local storage
            languageCode = localStorage.getItem(languageKey);
            break;
    }

    return languageCode;
}

// Function to initiate the library (loads initial language and sets up monitoring)
const initiateLibrary = async () => {
    // Detect language based on config rules
    let currentLanguage = await detectLanguage();
    
    // Fallback to browser language if no language detected from config method
    if (!currentLanguage) {
        currentLanguage = detectBrowserLanguage();
    }
    
    await changeLanguage(currentLanguage);

    // Watch for browser language changes
    monitorBrowserLanguageChange();
}

// Function to bind language switcher events
const bindLanguageSwitchers = () => {
    const switchers = document.querySelectorAll('.language-switcher');
    switchers.forEach(switcher => {
        // Remove existing listeners to prevent duplicates
        switcher.replaceWith(switcher.cloneNode(true));
    });
    
    // Add new listeners
    document.querySelectorAll('.language-switcher').forEach(switcher => {
        switcher.addEventListener('click', (e) => {
            const language = e.target.textContent.toLowerCase();
            changeLanguage(language);
        });
    });
}

// Load the script once the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initiateLibrary();
    
    // Make changeLanguage globally accessible
    window.changeLanguage = changeLanguage;
    
    // Bind language switcher events
    bindLanguageSwitchers();
});