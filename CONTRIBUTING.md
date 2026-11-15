# Adding or changing a portal

Thanks for adding to the catalog. Every pull request is reviewed by the maintainer, by hand, before it's merged.

## The rules

A portal is listed only when all of these hold:

1. **It's allowed.** The portal has an official API or a public feed meant for others to read, or its terms allow automated access. Unofficial APIs, scraping a site whose terms forbid it, and anything behind a login stay out. You can still add those to your own Dossier from a file.
2. **Its terms are linked.** The config's `termsUrl` and the portal's README link the terms that allow this use.
3. **Every host is the portal's own.** Each host in `hosts` is the portal's own domain or the API host its documentation names. No proxies, mirrors or third-party relays.
4. **A key goes only where the documentation says.** A secret field is used only in the request, and the header or parameter, that the portal's documentation names for it.
5. **It credits the portal as asked.** When the terms ask for a credit line or a link back, `credit` says so, and `postingPage` links each posting to its page on the portal when the terms ask for that.
6. **It's polite.** It asks for one page at a time, keeps `minGapSeconds` to what the documentation asks, and uses `localFilter` with a feed that can't be searched, so each search is one download.
7. **The facts are right.** `countries`, `kinds` and `catalog.json`'s `access` say what the portal really covers and how it's read.

## The files

Make a folder under `portals/`, named after the config's `id` in lower case, with dashes for underscores (`REMOTE_OK` → `portals/remote-ok/`):

- **`portal.json`**: the config. Copy the closest existing one: `freehire` for a portal without a key, `adzuna` for one with a key and an ID. The format is in `schema/portal-config.schema.json`; Dossier's [DEVELOPMENT.md](https://github.com/AienTech/dossier/blob/main/DEVELOPMENT.md#portal-configs) explains each part.
- **`catalog.json`**: `{ "access": "official-api" }` or `{ "access": "public-feed" }`.
- **`README.md`**: what it covers, its terms, whether it needs a key and how to get one, and the credit it asks for. Copy the shape of an existing one.

Raise `version` with every change to a config (`1.0.0` → `1.0.1` for a fix, `1.1.0` for something new). Installs see the new version as an update.

## Before you open the pull request

- Add the config to your own Dossier from the file (**Settings → Job search → Add portal**), switch it on, press **Test connection** and run a search. The check here only covers the format; Dossier checks the rest.
- Run the check: `docker run --rm -v "$PWD":/w -w /w node:24 sh -c "npm ci && npm run check"`.
