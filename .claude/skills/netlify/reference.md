# Netlify — Rezepte, Quellen, Praxis-Befunde

Alle Rezepte sind am 2026-11-18 mit `netlify-cli` 26.2.0 unter Node 24.22.3 gelaufen (Projekt CV, Site `robertstickler-cv`).
Sie sind **lesend**. Python filtert die JSON-Antworten, damit keine Env-Werte im Terminal landen.

## Rezepte

```bash
# 0. Eingeloggt?  (zeigt Mail/Team; "not linked" ist ohne Verknüpfung normal)
netlify status

# 1. Einmalig pro Checkout verknüpfen — nicht-interaktiv, matcht die Site über die https-Repo-URL.
#    Schreibt .netlify/state.json und trägt ".netlify" in die .gitignore ein.
netlify link --git-remote-url https://github.com/<owner>/<repo>

SID=$(python3 -c "import json;print(json.load(open('.netlify/state.json'))['siteId'])")

# 2. Was führt Netlify aus?
netlify api getSite --data "{\"site_id\":\"$SID\"}" | python3 -c "
import json,sys
d=json.load(sys.stdin); b=d.get('build_settings') or {}
print('build cmd  :', b.get('cmd'));  print('publish dir:', b.get('dir'));  print('base dir   :', b.get('base'))
print('prod branch:', b.get('repo_branch'));  print('image      :', d.get('build_image'))
print('plugins    :', [p.get('package') for p in b.get('plugins') or []])"

# 3. Letzte Deploys — commit_ref des Production-Deploys gegen den Branch-Kopf halten
netlify api listSiteDeploys --data "{\"site_id\":\"$SID\",\"per_page\":5}" | python3 -c "
import json,sys
for x in json.load(sys.stdin)[:5]:
    print(x['created_at'][:16], x['state'], x['context'], x['branch'], (x.get('commit_ref') or '')[:7], (x.get('error_message') or '')[:80])"
git rev-parse --short origin/main      # Production-Branch einsetzen; ungleich = Live-Seite veraltet

# 3b. Formulare: erkennt Netlify das Formular? (Name, bisherige Einsendungen)
netlify api listSiteForms --data "{\"site_id\":\"$SID\"}" | python3 -c "
import json,sys
for x in json.load(sys.stdin): print(x['name'], 'Einsendungen:', x.get('submission_count'), 'seit', x['created_at'][:10])"
grep -o '<form[^>]*>' dist/de/index.html    # was steht im gebauten HTML (nach bun run build)?

# 4. Env-Variablen: NUR Namen, Werte nur für Node/Bun
netlify env:list --json | python3 -c "
import json,sys
d=json.load(sys.stdin)
for k in (d if isinstance(d,dict) else []): print(k, '=', d[k] if k in ('NODE_VERSION','BUN_VERSION') else '<set>')
print('(keine Variablen gesetzt)' if not d else '')"
```

Ergebnis: `getSite` liefert in `build_settings.env` nur einen Legacy-Marker (`{'DEPRECATED': …}`), die echten Variablen stehen
in `env:list`. Ein leeres `env:list` heißt: weder `NODE_VERSION` noch `BUN_VERSION` ist gesetzt, es gelten Image-Standards bzw. `.nvmrc`.

## `netlify.toml`

Build-Befehl und Publish-Verzeichnis gehören ins Repo statt nur in die UI. Im Projekt CV am 2026-11-18 so angelegt, mit denselben
Werten wie in der UI (die Datei hat Vorrang vor der UI):

```toml
[build]
  command = "bun run build"
  publish = "dist"

# [build.environment]
#   BUN_VERSION = "1.4.4"   # nur setzen, wenn eine exakte Version nötig ist
```

Prüfen, ob Netlify die Datei wirklich benutzt: `netlify build --offline` führt den Build lokal aus und meldet
„build.command from netlify.toml" (statt „from Netlify app"). Für die Syntax allein reicht
`python3 -c "import tomllib; tomllib.load(open('netlify.toml','rb'))"`.

## Quellen

- Dependencies/Bun/Node: https://docs.netlify.com/build/configure-builds/manage-dependencies/ — „If you commit a `bun.lockb` file … Netlify will run the `bun install` command"; `BUN_FLAGS`, `BUN_VERSION`; `NODE_VERSION`, `.node-version`, `.nvmrc` überschreiben die UI-Einstellung (abgefragt 2026-11-18).
- Build-Image: https://docs.netlify.com/configure-builds/available-software-at-build-time/ — Node „Default version: `24`", Bun „Available versions: `1.x`" (abgefragt 2026-11-18). Weder `bun.lock` noch `bun.lockb` steht dort.
- Text-Lockfile: https://answers.netlify.com/t/support-new-bun-lock-text-lockfile-for-bun/134716 — Netlify erkennt `bun.lock`. **Sekundärquelle**; ein Thread „Build crashing after Bun 1.2" existiert (https://answers.netlify.com/t/build-crashing-after-bun-1-2/138329), nicht gelesen.
- MCP: https://docs.netlify.com/build/build-with-ai/agent-setup-guides/set-up-claude-code-for-netlify/ — Remote `claude mcp add --transport http netlify https://mcp.netlify.com/mcp` (empfohlen) oder lokal `npx -y @netlify/mcp`. Die Seite sagt nichts zur Auth-Methode und nichts dazu, ob ein Neustart nötig ist.
- Netlifys Agent-Skills: https://github.com/netlify/context-and-tools (nicht installiert).

## Praxis-Befunde (selbst verifiziert 2026-11-18, Projekt CV)

- **Veraltete Live-Seite:** Der einzige Production-Deploy war von 2026-02-10, Commit `8d14292` = Kopf von `main`; der Arbeitsbranch lag 38 Commits davor
  (u. a. Impressum, Datenschutz, Sprach-Redirects). Ein Push auf den Arbeitsbranch löste keinen Deploy aus (keine Branch-Deploys). Erst der Vergleich
  `commit_ref` ↔ `origin/main` hat das gezeigt; das Repo allein sah aktuell aus.
- **Build-Log nicht per API abrufbar:** `getSiteBuild` liefert nur `done`, `error`, `sha`, `deploy_id`, `deploy_state`; `listSiteDeploys` und
  `getDeploy` enthalten keine Logzeilen, nur `summary.messages` (Upload-Zähler, Redirect-Regeln). `updateSiteBuildLog` ist ein Schreib-Endpunkt für
  Build-Plugins. Ob `bun install` lief, steht deshalb nur im Deploy-Log der Netlify-UI. Die CLI ist dafür nicht geprüft.
- **Formular-Erkennung bei Astro-Inseln (Projekt CV, 2026-11-18):** React-Inseln mit `client:*` rendert Astro beim Build serverseitig, das Formular steht deshalb im
  statischen HTML (`grep '<form' dist/de/index.html`: zwei Treffer, das echte aus `Contact.tsx` und das versteckte aus `Layout.astro`, beide `name="contact"` mit
  `data-netlify="true"`). Netlify führt `contact` trotzdem als **ein** Formular (`listSiteForms`). Das versteckte Duplikat ist vermutlich unnötig (nicht getestet,
  nicht entfernt). `submission_count` 0 heißt nur, dass nie jemand abgeschickt hat, nicht dass der Absendeweg geprüft ist; das belegt erst eine echte Einsendung.
- **Doku-Drift:** Die Projekt-`CLAUDE.md` nannte `bun build` (Buns Bundler, braucht einen Entry), in der UI stand `bun run build`.
- **Node-Pin vorher nicht vorhanden:** kein `.nvmrc`, kein `NODE_VERSION`, keine `netlify.toml`. Es galt der Image-Standard 24.
- **`.netlify` in `.gitignore`:** `netlify link` ergänzt sie selbst; trotzdem vor dem Commit `git status` ansehen.
- **MCP registriert, nicht authentifiziert:** `claude mcp list` zeigt `! Needs authentication`, bis der Browser-Login über `/mcp` erfolgt ist.
- **zsh-Falle bei den Rezepten:** `"$SID"` immer in Anführungszeichen setzen; ungequotete Variablen werden in zsh nicht gesplittet.
