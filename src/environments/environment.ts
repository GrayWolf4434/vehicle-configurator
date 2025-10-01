// src/environments/environment.ts  (DEV)
export const environment = {
  production: false,
  // bestehende Keys beibehalten/ergänzen
  apiBase: '/customerpricingapi/route.php',

  // Einpreiser-Katalog (für Lookups)
  catalogBaseUrl: '/einpreiser/api/route.php/catalog',
  // Nur den Base64-String OHNE "Basic " davor eintragen:
  catalogBasicAuth: '<<BASIC_BASE64_HERE>>'
};
