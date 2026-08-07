(function () {
  const supportedLanguages = ['it', 'en', 'fr', 'de'];
  const requestedLanguage = new URLSearchParams(window.location.search).get('lang') || 'it';
  const language = supportedLanguages.includes(requestedLanguage) ? requestedLanguage : 'it';
  const selector = document.getElementById('language-select');

  document.documentElement.lang = language;
  if (selector) selector.value = language;
  if (language === 'it') return;

  const translationScript = document.createElement('script');
  translationScript.src = `translations/${language}.js`;
  translationScript.onload = () => window.synoptaraApplyTranslations?.(language);
  document.head.appendChild(translationScript);
}());

window.synoptaraApplyTranslations = function (language) {
  const translation = window.synoptaraTranslations?.[language];
  if (!translation) return;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    const source = node.nodeValue.trim();
    if (!source || !translation.text[source]) return;
    node.nodeValue = node.nodeValue.replace(source, translation.text[source]);
  });

  const pageTitle = document.title;
  if (translation.text[pageTitle]) {
    document.title = translation.text[pageTitle];
  } else if (translation.meta.title) {
    document.title = translation.meta.title;
  }

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const descContent = metaDesc.getAttribute('content');
    if (translation.text[descContent]) {
      metaDesc.setAttribute('content', translation.text[descContent]);
    } else if (translation.meta.description) {
      metaDesc.setAttribute('content', translation.meta.description);
    }
  }

  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', translation.meta.locale);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    const ogTitleContent = ogTitle.getAttribute('content');
    if (translation.text[ogTitleContent]) {
      ogTitle.setAttribute('content', translation.text[ogTitleContent]);
    } else if (translation.meta.title) {
      ogTitle.setAttribute('content', translation.meta.title);
    }
  }

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    const ogDescContent = ogDesc.getAttribute('content');
    if (translation.text[ogDescContent]) {
      ogDesc.setAttribute('content', translation.text[ogDescContent]);
    } else if (translation.meta.ogDescription) {
      ogDesc.setAttribute('content', translation.meta.ogDescription);
    }
  }

  Object.entries(translation.attributes).forEach(([selector, attributes]) => {
    const element = document.querySelector(selector);
    if (!element) return;
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  });
};
