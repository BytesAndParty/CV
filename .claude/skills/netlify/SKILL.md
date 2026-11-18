---
name: netlify
description: Netlify build and deploy setup via CLI and MCP — linking a repo, reading what Netlify actually runs (build command, publish dir, production branch, env var names, latest deploys), Bun and Node version handling (`bun.lock`, `BUN_VERSION`, `.nvmrc`, `NODE_VERSION`), `netlify.toml`. Load before changing Netlify build settings, when a deploy fails or looks stale, or when asked what Netlify really builds for a project.
---

## Wofür dieser Skill da ist

Er klärt zwei Dinge: **was Netlify für ein Projekt tatsächlich ausführt** (Build-Befehl, Node-/Bun-Version und Env-Variablen stehen oft nur in der UI, nicht im Repo, und lassen sich nicht aus Dateien erraten) und **wie man Bun und Node dort festnagelt**. Er arbeitet standardmäßig **lesend**. Deploys, Env-Änderungen und Neu-Verknüpfungen nur auf ausdrücklichen Zuruf.

## Site lesend prüfen

Ziel: Build-Befehl, Publish-Verzeichnis, Production-Branch, Env-Variablen-**Namen** und die letzten Deploys kennen, ohne Geheimnisse auszugeben. Die fertigen Befehle stehen in [reference.md](reference.md), Abschnitt „Rezepte". Reihenfolge:

1. `netlify status` — eingeloggt? Wenn nicht: `netlify login` ist interaktiv, den User bitten.
2. Fehlt `.netlify/state.json`: `netlify link --git-remote-url <https-Repo-URL>` (nicht-interaktiv; trägt `.netlify` selbst in die `.gitignore` ein).
3. `getSite` → `build_settings.cmd`, `dir`, `base`, `repo_branch`, `build_image`.
4. `listSiteDeploys` → `commit_ref` des Production-Deploys gegen `git rev-parse origin/<production-branch>` halten. **Ungleich heißt: Die Live-Seite ist veraltet**, egal wie aktuell das Repo ist.
5. `env:list --json` → nur Namen ausgeben, Werte nur für `NODE_VERSION`/`BUN_VERSION`.

Geprüft ist die Auswertung erst, wenn Build-Befehl, Production-Branch und Deploy-Stand benannt sind. Nicht aus Repo-Dateien auf die UI-Einstellungen schließen: `CLAUDE.md` nannte `bun build`, in der UI stand `bun run build`.

## Bun und Node auf Netlify

Stand 2026-11-18, Quellen in [reference.md](reference.md):

- **Node:** Standard im Build-Image ist `24`. `.nvmrc`, `.node-version` oder die Env-Variable `NODE_VERSION` überschreiben die UI-Einstellung; Major (`24`) oder exakte Version sind erlaubt. Frameworks mit Node-Untergrenze (Astro 7: ≥ 22.23.4) deshalb mit `.nvmrc` absichern.
- **Bun:** Ist vorinstalliert („1.x", exakte Version steht nirgends), mit `BUN_VERSION` pinnbar. Netlify führt `bun install` aus, wenn eine Lockfile erkannt wird. Die Doku nennt nur `bun.lockb`; das Text-Lockfile `bun.lock` (Bun ≥ 1.2, Standard) wird laut Netlify-Forum ebenfalls erkannt — **Sekundärquelle, in keinem Build selbst belegt**. Im Deploy-Log nachsehen, ob `bun install` lief, sonst fällt Netlify auf `npm install` ohne Lockfile zurück (andere Versionen als lokal getestet).
- **Build-Befehl und Publish-Verzeichnis** sind getrennt von der Installation. Sie gehören in eine versionierte `netlify.toml` (`[build] command`, `publish`), damit sie nicht nur in der UI leben.

## MCP-Server

Offizielle Empfehlung (Netlify-Doku): Remote-Server über HTTP, ohne Token in der Config.

```bash
claude mcp add --transport http netlify https://mcp.netlify.com/mcp   # Standard-Scope "local": privat, nicht im Repo
claude mcp list                                                        # "! Needs authentication" bis zum Login
```

Der Login läuft im Browser über `/mcp` in einer Session; die Tools erscheinen erst nach einem Neustart der Session. Ausweichen auf stdio nur, wenn der Remote-Server blockiert ist (`claude mcp add netlify -- bunx -y @netlify/mcp`, braucht Tokens als Env — nie ins Repo, nie kopieren). **Status 2026-11-18:** im Projekt CV registriert, noch nicht benutzt; die CLI-Rezepte sind verifiziert, der MCP-Weg nicht.

## Leitplanken

- Werte von Env-Variablen und Tokens nie ausgeben oder in Dateien schreiben; `env:list` ohne Filter druckt sie im Klartext.
- Nichts verändern ohne Auftrag: kein `netlify deploy`, `env:set`, `unlink`, kein Ändern von Build-Einstellungen. Ein Deploy ist öffentlich.
- Netlifys eigene Agent-Skills (`netlify/context-and-tools`) sind Fremdcode und nicht installiert; bei Bedarf erst lesen, dann entscheiden.
- Ein Push auf einen Branch erzeugt nur dann einen Deploy, wenn Branch-Deploys aktiv sind. Fehlt der Deploy, ist das kein Fehler des Builds.

## Related skills

- `astro`: Node-Untergrenze und Build-Verhalten von Astro 7; dieser Skill sagt, wie man sie auf Netlify absichert.
- `gitleaks`, `infisical`: wenn Tokens oder Env-Werte in Dateien auftauchen. Hier liegt nur die Netlify-Seite.

## References

- `reference.md` — Rezepte (copy-paste, geprüft), Quellen, Praxis-Befunde.
