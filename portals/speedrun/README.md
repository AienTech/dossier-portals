# Speedrun

Open roles from the speedrun talent network, run by the talent team at a16z speedrun, read from its public REST API. The board covers the speedrun cohorts and the wider a16z portfolio, and with **Companies** set to "Every company listed" (the default), every startup the board lists beyond them. Dossier sends your keywords, the place, remote only and how recent to the API, reads the results a page of 50 at a time, newest first, and reads each posting whole from the API when you open it.

- **Terms:** https://speedrun-talent-network.com/developers (a public, read-only API with no sign-in, key or cost; the developers page and the API's description ask integrations to name themselves with `?source=`, which this config sends as `dossier`)
- **Countries:** Every country (most roles are in the US)
- **Kinds of work:** any
- **Access:** Official API
- **Key:** None
- **Credit:** None asked. Each posting links to its page on the speedrun talent network.

Requests are spaced 1.5 seconds apart. Pay is read from the posted band where the company gives one.
