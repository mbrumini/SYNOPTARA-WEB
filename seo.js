(function () {
  const isSoftwarePage = /\/software(?:\.html)?\/?$/.test(window.location.pathname);
  const organization = {
    '@type': 'Organization',
    '@id': 'https://synoptara.dev/#organization',
    name: 'SYNOPTARA',
    url: 'https://synoptara.dev/',
    logo: 'https://synoptara.dev/assets/synoptara-cover.png',
    email: 'develop@synoptara.dev'
  };
  const page = isSoftwarePage ? {
    '@type': 'SoftwareApplication',
    name: 'SYNOPTARA',
    url: 'https://synoptara.dev/software',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Industrial machine vision software',
    operatingSystem: 'Windows',
    description: 'Industrial vision software for automated quality control, recipe management, AI inspection and real-time diagnostics.',
    publisher: { '@id': organization['@id'] }
  } : {
    '@type': 'WebSite',
    name: 'SYNOPTARA',
    url: 'https://synoptara.dev/',
    description: 'Industrial vision and automated quality control platform.',
    publisher: { '@id': organization['@id'] }
  };

  const schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [organization, page]
  });
  document.head.appendChild(schema);
}());
