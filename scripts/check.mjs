// Checks every portal against the catalog's format and file rules. The rules
// a script can't check (whose hosts they are, what the terms allow) are the
// reviewer's: see CONTRIBUTING.md.
//
// With BASE set to a git ref (CI sets the pull request's base), a changed
// config must also raise its version.

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const checkConfig = ajv.compile(JSON.parse(readFileSync("schema/portal-config.schema.json", "utf8")));
const checkEntry = ajv.compile(JSON.parse(readFileSync("schema/catalog.schema.json", "utf8")));

const problems = [];
const say = (portal, problem) => problems.push(`portals/${portal}: ${problem}`);
const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const errors = (check) => check.errors.map((error) => `${error.instancePath || "/"} ${error.message}`).join("; ");
const newer = (a, b) => {
  const [x, y] = [a, b].map((version) => version.split(".").map(Number));
  for (let index = 0; index < 3; index++) if (x[index] !== y[index]) return x[index] > y[index];
  return false;
};

const ids = new Map();
for (const portal of readdirSync("portals").sort()) {
  const folder = join("portals", portal);
  for (const file of ["portal.json", "catalog.json", "README.md"]) if (!existsSync(join(folder, file))) say(portal, `${file} is missing.`);
  if (!existsSync(join(folder, "portal.json")) || !existsSync(join(folder, "catalog.json"))) continue;

  let config;
  let entry;
  try {
    config = read(join(folder, "portal.json"));
    entry = read(join(folder, "catalog.json"));
  } catch (error) {
    say(portal, `a file isn't JSON: ${error.message}`);
    continue;
  }
  if (!checkConfig(config)) say(portal, `portal.json doesn't fit the format: ${errors(checkConfig)}`);
  if (!checkEntry(entry)) say(portal, `catalog.json doesn't fit: ${errors(checkEntry)}`);
  if (typeof config.id !== "string") continue;

  if (portal !== config.id.toLowerCase().replaceAll("_", "-")) say(portal, `the folder for ${config.id} is portals/${config.id.toLowerCase().replaceAll("_", "-")}.`);
  if (ids.has(config.id)) say(portal, `${config.id} is taken by portals/${ids.get(config.id)}.`);
  ids.set(config.id, portal);
  if (!config.termsUrl) say(portal, "termsUrl is missing: link the terms that allow this use.");
  else if (existsSync(join(folder, "README.md")) && !readFileSync(join(folder, "README.md"), "utf8").includes(config.termsUrl)) say(portal, "README.md doesn't link termsUrl.");
  if (entry.access === "unofficial" && entry.builtIn !== true) say(portal, "only a portal Dossier comes with may be unofficial.");

  if (process.env.BASE) {
    let before = null;
    try {
      before = JSON.parse(execFileSync("git", ["show", `${process.env.BASE}:${join(folder, "portal.json")}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
    } catch {
      // A new portal.
    }
    if (before && JSON.stringify(before) !== JSON.stringify(config) && !newer(config.version, before.version)) say(portal, `portal.json changed: raise its version above ${before.version}.`);
  }
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`${ids.size} portals checked.`);
