# JS Translate
A simple JS library to translate your website.<br>
Supports multiple languages and is really simple to install.<br>
Can be used with React, Vue, Angular, Laravel and any library and framework that renders HTML.

## Installation steps
1. Download the code.
2. Drag-n-drop the folder inside your website's desired folder.
3. Add a ```<script>``` tag with ```./index.js``` as source in your HTML pages at the end of the <body> element (modify the script tag's path according to the actual script's file path in your codebase).

## Add or modify languages
1. Go inside the ```translations``` folder.
2. Add a JSON file for each desired language code (e.g. de.json).
3. Inside the file, create a JSON array. Each JSON key is what you will be using in the HTML to identify the element (stays the same in all languages) and the value is the translated text of the key (changes depending on the language).
Example:
```
{
    "welcome message": "Willkommen in meiner neuen Bibliothek für Übersetzungen mit JavaScript!",
    "welcome description": "Einfach zu installieren, zu verwenden und anzupassen"
}
```
4. In your HTML code, mark the desired elements as such: aria-translate="true" aria-translate-key="welcome message". Example:
```
<div aria-translate="true" aria-translate-key="welcome message"></div>
```
5. In your HTML code, add elements to act as language switchers. Make them call the changeLanguage("language_code") when clicked (onClick event). Example:
```
<div class="language-switcher" onClick="changeLanguage('de')">DE</div>
```
6. That's it! Your new language is now added and ready to be used in the frontend.

## Test the library
1. Install [Node.js](https://nodejs.org/en/download).
2. Run ```node .\server.js```.
3. Visit ```http://localhost:3000``` on your browser.
