# Dossier portals

The job portals [Dossier](https://github.com/AienTech/dossier) can search, as configs anyone can read. Each config describes a portal as data: where Dossier asks for postings, what it sends there and where each part of a posting is in the answer. A config never runs code, can only reach the hosts it lists, and can't read anything from the server it runs on.

Dossier lists these portals under **Settings → Job search → Browse portals**, where one click adds a portal. Every config here was reviewed before it was merged.

## What's here

```
portals/<portal>/portal.json   the config, in the format of schema/portal-config.schema.json
portals/<portal>/catalog.json  what the catalog says about it: official API or public feed
portals/<portal>/README.md     what it covers, its terms, its key and the credit it asks for
schema/                        the JSON Schemas both files are checked against
```

The four portals Dossier comes with (JSearch, Adzuna, FreeHire and the Bundesagentur für Arbeit) live here too, marked `builtIn`. Each Dossier release bundles their current configs, and newer versions reach installs through the catalog between releases.

## How it reaches Dossier

Dossier's backend reads this repository's `main` branch and serves it as the catalog at `https://api.dossier.aien.me/v1/portals`. Installs read the catalog anonymously, at most once a day and when Browse portals opens. An install keeps the copy it added and shows "Update available" when a newer version is merged here. A version that reaches a new host is installed only after the user approves it.

A config that breaks the rules can be withdrawn. Installs that have it pause it, so it's not searched, and show why.

## Adding a portal

Read [CONTRIBUTING.md](CONTRIBUTING.md) first: the catalog takes only official APIs and feeds, or sites whose terms allow automated access.

You don't need this repository to use a portal that isn't here: **Add portal** in Dossier takes a config from a file or a link. It shows every host the config reaches, and warns that it isn't reviewed.

## License

The configs and everything else here are dedicated to the public domain under [CC0 1.0](LICENSE). Copy them for anything.
