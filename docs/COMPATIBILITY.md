# Runtime compatibility

Landing Studio has one [Agent Skills](https://agentskills.io/specification) core. Runtime names below describe discovery and invocation, not separate editions. Compatibility was checked against official documentation on 2026-07-15.

| Runtime | Native discovery | Project location | User location | Invoke / verify |
|---|---|---|---|---|
| Claude Code | Yes | `.claude/skills/` or plugin `skills/` | `~/.claude/skills/` | `/landing-studio:landing-page-build` as a plugin, or `/landing-page-build` as a loose skill |
| OpenAI Codex | Yes | `.agents/skills/` | `~/.agents/skills/` | `$landing-page-build` or the `/skills` picker |
| Gemini CLI | Yes | `.agents/skills/` alias or `.gemini/skills/` | `~/.agents/skills/` alias or `~/.gemini/skills/` | `/skills list`; Gemini asks before activation |
| GitHub Copilot CLI/agents | Yes | `.agents/skills/`, `.github/skills/`, or `.claude/skills/` | `~/.agents/skills/` or `~/.copilot/skills/` | `/skills list` and `/landing-page-build` |
| OpenCode | Yes | `.agents/skills/`, `.opencode/skills/`, or `.claude/skills/` | `~/.agents/skills/` or OpenCode/Claude paths | native `skill` tool |
| Cursor | Yes | `.cursor/skills/` | `~/.cursor/skills/` | slash command or automatic activation |
| Windsurf / Cascade | Yes | `.agents/skills/` or `.windsurf/skills/` | `~/.agents/skills/` or `~/.codeium/windsurf/skills/` | `@landing-page-build` or automatic activation |
| Cline | Yes | `.cline/skills/` or `.claude/skills/` | `~/.cline/skills/` | `/landing-page-build` or automatic activation |
| Other capable agents | Format-dependent | Prefer `.agents/skills/` | Prefer `~/.agents/skills/` | Tell the agent to read `skills/landing-page-build/SKILL.md`; tool capabilities still need checking |

## Install from a clone

```bash
git clone https://github.com/ifitsmanu/landing-studio.git
cd landing-studio
npm install
node scripts/install.mjs --runtime codex --scope user
```

Replace `codex` with `neutral`, `gemini`, `copilot`, `opencode`, `claude`, `cursor`, `windsurf`, or `cline`. Project scope installs into the selected project:

```bash
node scripts/install.mjs --runtime gemini --scope project --project /path/to/project
```

The default uses links to one versioned support tree so all skills share the same scripts, schemas, templates, and browser tools. Use `--copy` only when links are unavailable. The installer refuses to replace an existing skill unless `--force` is explicitly provided.
It installs the pinned root runtime dependencies into that support tree with lifecycle scripts disabled;
nested browser and motion dependencies remain opt-in through their documented install commands. Re-running
an unchanged owned copy is safe. Uninstall removes unchanged owned copies and preserves locally modified
copies with an explicit warning. Treat `--force` as destructive because it authorizes replacement of a
same-named skill after review.

Uninstall only the files owned by that Landing Studio installation:

```bash
node scripts/install.mjs --action uninstall --runtime codex --scope user
```

## Runtime-specific native paths

- [Claude Code skills](https://code.claude.com/docs/en/skills) and [plugins](https://code.claude.com/docs/en/plugins)
- [OpenAI Codex skills](https://developers.openai.com/codex/skills)
- [Gemini CLI Agent Skills](https://geminicli.com/docs/cli/skills/)
- [GitHub Copilot agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [OpenCode skills](https://opencode.ai/docs/skills/)
- [Cursor Agent Skills](https://cursor.com/docs/skills)
- [Windsurf/Cascade skills](https://docs.windsurf.com/windsurf/cascade/skills)
- [Cline skills](https://docs.cline.bot/customization/skills)

## Capability levels

Skill discovery does not prove browser, web search, image/video generation, subagent, or shell access. At run start, `landing-page-build` records each capability as native, fallback, unavailable, or not needed.

- `/browse` is an optional fast interactive adapter, never a hidden dependency.
- The bundled Playwright harness is the reproducible browser fallback.
- Independent red teaming uses a fresh subagent/context where available and a declared fresh-pass review otherwise.
- Image/video generation is optional. Missing generation changes the media direction; it does not stop a truthful static page.
- WebGL is optional and always needs a static or video fallback.

## Tested versus specified

The table records officially documented discovery. A runtime is marked smoke-tested only in `docs/SCORECARD.md` after a retained run. Do not convert documentation compatibility into a cross-model quality claim.
