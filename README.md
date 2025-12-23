# js-translate
A simple JS library to translate your website. Supports multiple languages and is really simple to install!

## Installation Steps
1. Download the code.
2. Drag-n-drop the folder inside your website's desired folder.
3. Call the **index.js** script in your HTML pages at the end of the <body> element.

## Add more languages
1. Go inside the **translations** folder.
2. Add a JSON file for each desired language code e.g. de.json.
3. Inside the file, create a JSON array. Each JSON key is what you will be using in the HTML to identify the element (stays the same in all languages) and the value is the translated text of the key (changes depending on the language).
4. In your HTML code, mark the desired elements as such: aria-translate="true" aria-translate-key="welcome message".
5. In your HTML code, add elements to act as language switchers. Make them call the changeLanguage("language_code") when clicked (onClick event).
