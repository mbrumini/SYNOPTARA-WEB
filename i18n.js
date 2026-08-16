(function () {
  const supportedLanguages = ['it', 'en', 'fr', 'de'];
  const requestedLanguage = new URLSearchParams(window.location.search).get('lang') || 'en';
  const language = supportedLanguages.includes(requestedLanguage) ? requestedLanguage : 'en';
  const selector = document.getElementById('language-select');

  document.documentElement.lang = language;
  if (selector) selector.value = language;
  updatePageUrls(language);
  if (language === 'it') return;

  const translationScript = document.createElement('script');
  translationScript.src = `translations/${language}.js?v=2`;
  translationScript.onload = () => {
    const pageScript = document.createElement('script');
    pageScript.src = `translations/pages/${language}.js?v=2`;
    pageScript.onload = () => window.synoptaraApplyTranslations?.(language);
    pageScript.onerror = () => window.synoptaraApplyTranslations?.(language);
    document.head.appendChild(pageScript);
  };
  document.head.appendChild(translationScript);
}());

function updatePageUrls(language) {
  const fileName = window.location.pathname.split('/').pop() || '';
  const pageName = fileName.replace(/\.html$/, '');
  const pagePath = !pageName || pageName === 'index' ? '/' : `/${pageName}`;
  const canonicalUrl = language === 'en'
    ? `https://synoptara.dev${pagePath}`
    : `https://synoptara.dev${pagePath}?lang=${language}`;

  document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
}

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

  const pageName = (window.location.pathname.split('/').pop() || 'index').replace(/\.html$/, '') || 'index';
  const pageMeta = translation.pages?.[pageName];
  const pageTitle = document.title;
  if (translation.text[pageTitle]) {
    document.title = translation.text[pageTitle];
  } else if (pageMeta?.title || translation.meta.title) {
    document.title = pageMeta?.title || translation.meta.title;
  }

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const descContent = metaDesc.getAttribute('content');
    if (translation.text[descContent]) {
      metaDesc.setAttribute('content', translation.text[descContent]);
    } else if (pageMeta?.description || translation.meta.description) {
      metaDesc.setAttribute('content', pageMeta?.description || translation.meta.description);
    }
  }

  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', translation.meta.locale);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    const ogTitleContent = ogTitle.getAttribute('content');
    if (translation.text[ogTitleContent]) {
      ogTitle.setAttribute('content', translation.text[ogTitleContent]);
    } else if (pageMeta?.title || translation.meta.title) {
      ogTitle.setAttribute('content', pageMeta?.title || translation.meta.title);
    }
  }

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    const ogDescContent = ogDesc.getAttribute('content');
    if (translation.text[ogDescContent]) {
      ogDesc.setAttribute('content', translation.text[ogDescContent]);
    } else if (pageMeta?.description || translation.meta.ogDescription) {
      ogDesc.setAttribute('content', pageMeta?.description || translation.meta.ogDescription);
    }
  }

  Object.entries(translation.attributes).forEach(([selector, attributes]) => {
    const element = document.querySelector(selector);
    if (!element) return;
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  });
};
