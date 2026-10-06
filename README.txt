Chennai Royal Vacation Pvt. Ltd. website
Open index.html in a browser. No build step needed.

Files
- index.html          page sections
- css/style.css       base styles, colours in the :root block
- css/catalog.css     package catalogue, detail popup, animations
- js/packages.js      ALL package data (states, themes, packages)
- js/scenes.js        illustrated animated scenes used when a package has no photo
- js/catalog.js       renders themes, state tabs, cards, destinations, detail popup
- js/main.js          loader, scroll effects, gallery filter, contact form

Adding or editing a package
Edit js/packages.js. Each package has: id, state, title, days, price,
mrp (optional, shows "% OFF"), themes, scene, route, highlights, itinerary.
The theme counts, destination tiles and "Starting" prices update automatically.

Adding a real photo to a package
Save the photo in images/pkg/ and add  img: 'images/pkg/<file>.jpg'
to that package in js/packages.js. The photo replaces the illustration.

Prices, discounts, itineraries and the 30% advance are demo content
until the client confirms them.
The contact form, Enquire Now and WhatsApp buttons use +91 44 2847 9000;
change PHONE/TEL in js/catalog.js and the number in js/main.js and index.html.
