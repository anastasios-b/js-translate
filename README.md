# JS Translate
a. A simple JS library to translate your website.<br>
a. Supports multiple languages and is really simple to install.<br>
a. Can be used with React, Vue, Angular, Laravel and any library and framework that renders HTML.

# Installation steps
a. Download the code.<br>
b. Drag-n-drop the folder inside your website's desired folder.<br>
c. Add a ```<script>``` tag with ```./index.js``` as source in your HTML pages at the end of the <body> element (modify the script tag's path according to the actual script's file path in your codebase).<br>
d. Inside config.json, set the "recognize_language_by" to "url", "url_parameter", "cookie" or "local_storage".<br>
If "url_parameter", "cookie" or "local_storage" are set, add the language_key to the config.json file.<br>
For "url", the language will be recognized from the URL, taking the first URI part as the language code.

# Add or modify languages
a. Go inside the ```translations``` folder.<br>
b. Add a JSON file for each desired language code (e.g. de.json).<br>
c. Inside the file, create a JSON array. Each JSON key is what you will be using in the HTML to identify the element (stays the same in all languages) and the value is the translated text of the key (changes depending on the language).<br>
Example:
```
{
    "welcome message": "Willkommen in meiner neuen Bibliothek für Übersetzungen mit JavaScript!",
    "welcome description": "Einfach zu installieren, zu verwenden und anzupassen"
}
```
d. In your HTML code, mark the desired elements as such: aria-translate="true" aria-translate-key="welcome message". Example:
```
<div aria-translate="true" aria-translate-key="welcome message"></div>
```
e. In your HTML code, add elements to act as language switchers. Make them call the changeLanguage("language_code") when clicked (onClick event). Example:
```
<div class="language-switcher" onClick="changeLanguage('de')">DE</div>
```
f. That's it! Your new language is now added and ready to be used in the frontend.

## Test the library
a. Install [Node.js](https://nodejs.org/en/download).<br>
b. Run ```node .\server.js```.<br>
c. Visit ```http://localhost:3000``` on your browser.
