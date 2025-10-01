# Vehicle Configurator (Angular 17)

## Start
```bash
npm install
ng serve -o
```

## Hinweise
- Proxy aktiv: `proxy.conf.json`
- API-Basis: `/customerpricingapi/route.php`
- Auth-Header `token` wird nach Login automatisch gesetzt (Interceptor).
- VIN-Endpunkte unterstützen Basic-Auth (entweder fertiger Base64-Schlüssel oder User/Pass).
