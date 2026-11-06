# Tastes of Africa

Tastes of Africa is a responsive, multi-page website that celebrates the
ingredients, recipes, cooking techniques, and cultural stories of African
cuisine. It is built with semantic HTML5, modern CSS, and dependency-free
JavaScript.

## What to expect

Visitors can:

- Explore a welcoming home page with featured dishes, food trends, regional
  links, and an introductory video.
- Browse five recipes: Jollof Rice, Injera, Chicken Tagine, Bunny Chow, and
  Isombe.
- Filter recipes by culinary region without reloading the page.
- Save favorite recipes in the browser using `localStorage`.
- Adjust ingredient quantities with the serving scaler on recipe pages.
- Switch between light and dark themes; the preference is remembered.
- Read about West, North, and East African culinary traditions.
- Send a message through the validated contact form.
- Subscribe to the newsletter form for an immediate confirmation message.

## Site map

| Area | Pages |
| --- | --- |
| Main | [Home](index.html), [Recipes](recipes.html), [Regions](regions.html), [About](about.html), [Contact](contact.html) |
| Recipes | [Jollof Rice](jollof-rice.html), [Injera](injera.html), [Chicken Tagine](tagine.html), [Bunny Chow](bunny-chow.html), [Isombe](isombe.html) |
| Regions | [West Africa](west-africa.html), [North Africa](north-africa.html), [East Africa](east-africa.html) |

## Technical overview

- **HTML:** Semantic page structure, accessible labels, figures, lists,
  expandable instructions, nutrition tables, embedded videos, and maps.
- **CSS:** Shared responsive styling in `styles.css`, including the spice-
  inspired color palette, cards, forms, focus states, mobile navigation, and
  light/dark theme variables.
- **JavaScript:** Shared behavior in `script.js`, including filtering,
  favorites, theme persistence, ingredient scaling, form validation,
  newsletter feedback, mobile navigation, and scroll-reveal effects.
- **Media:** Recipe photography is stored in `images/`. YouTube videos use
  privacy-friendly `youtube-nocookie.com` embeds, with direct YouTube links as
  fallbacks.

## Running locally

This is a static website and does not require a build tool, package manager, or
backend. Open `index.html` in a modern browser, or serve the project directory
with any static file server for the best browser compatibility.

All pages load the shared assets using relative paths, so keep the HTML files,
`styles.css`, `script.js`, and the `images/` directory together.

## Accessibility and responsive behavior

The site includes descriptive image `alt` text, semantic headings, keyboard
focus styles, a skip link, accessible form labels, ARIA states for interactive
controls, and reduced-motion support. Layouts use responsive grids, flexible
media, and mobile navigation to support smaller screens.

## Content and media notes

The `<mark>` element is used where the page calls attention to ingredients,
spices, or cultural influences. Its visual treatment is defined centrally in
`styles.css`, so it can be adjusted without editing every page.

Before publishing, confirm that all photographs and embedded media are
properly licensed or credited for the intended use. Replace files in
`images/` while preserving the referenced filenames, or update the relevant
image paths and alternative text together.
