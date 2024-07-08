## Xata

Initialize Xata schemas and seed initial location data into dev branch

1. Create a new database in [Xata](https://xata.io/)
2. Create a new `XATA_API_KEY` by visiting https://app.xata.io/settings
3. Change directory into `libs/xata`

```
cd libs/xata
```

4. Create a `.env` file with following values

```
XATA_BRANCH=dev
XATA_API_KEY='generate from https://app.xata.io/settings'
XATA_DATABASE_URL='https://{workspace-slug}.{region}.xata.sh/db/{database}'
```

5. Allow direnv to read the .env file within the directory

```
direnv allow
```

6. Create dev branch

```
pnpm -s dlx @xata.io/cli@latest branch create dev
```

7. Upload the schema to dev branch

```
pnpm -s dlx @xata.io/cli@latest schema upload xata-schema.json --branch dev
```

8. Seed location data into dev branch

```
node scripts/seed-locations.mjs dev
```
