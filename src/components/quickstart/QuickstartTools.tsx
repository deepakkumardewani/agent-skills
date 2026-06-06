import CopyableCommand from '../docs/CopyableCommand';

const SETUP_GUIDE_LINKS = {
  cursor: { href: '/docs/setup/cursor', label: 'Cursor setup guide' },
  geminiCli: { href: '/docs/setup/gemini-cli', label: 'Gemini CLI setup guide' },
  windsurf: { href: '/docs/setup/windsurf', label: 'Windsurf setup guide' },
  opencode: { href: '/docs/setup/opencode', label: 'OpenCode setup guide' },
  copilot: { href: '/docs/setup/copilot', label: 'GitHub Copilot setup guide' },
  gettingStarted: { href: '/docs/setup/getting-started', label: 'Getting started guide' },
} as const;

export default function QuickstartTools() {
  return (
    <div class="quickstart-page__tools">
      <details class="quickstart-tool quickstart-tool--featured" open>
        <summary class="quickstart-tool__summary">
          <span class="quickstart-tool__summary-text">
            <span class="quickstart-tool__name">Claude Code</span>
            <span class="quickstart-tool__badge">Recommended</span>
          </span>
        </summary>
        <div class="quickstart-tool__body">
          <div class="quickstart-tool__step">
            <h3 class="quickstart-tool__step-title">Marketplace install</h3>
            <div class="quickstart-tool__commands">
              <CopyableCommand command="/plugin marketplace add addyosmani/agent-skills" />
              <CopyableCommand command="/plugin install agent-skills@addy-agent-skills" />
            </div>
          </div>

          <aside class="quickstart-tool__note" aria-label="SSH troubleshooting">
            <p class="quickstart-tool__note-title">SSH errors?</p>
            <p class="quickstart-tool__note-text">
              The marketplace clones repos via SSH. If you do not have SSH keys on GitHub,{' '}
              <a href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account">
                add your SSH key
              </a>{' '}
              or force HTTPS cloning:
            </p>
            <div class="quickstart-tool__commands">
              <CopyableCommand command="/plugin marketplace add https://github.com/addyosmani/agent-skills.git" />
              <CopyableCommand command="/plugin install agent-skills@addy-agent-skills" />
            </div>
          </aside>

          <div class="quickstart-tool__step">
            <h3 class="quickstart-tool__step-title">Local / development</h3>
            <div class="quickstart-tool__commands">
              <CopyableCommand command="git clone https://github.com/addyosmani/agent-skills.git" />
              <CopyableCommand command="claude --plugin-dir /path/to/agent-skills" />
            </div>
          </div>
        </div>
      </details>

      <details class="quickstart-tool">
        <summary class="quickstart-tool__summary">
          <span class="quickstart-tool__name">Cursor</span>
        </summary>
        <div class="quickstart-tool__body">
          <p class="quickstart-tool__prose">
            Copy any <code>SKILL.md</code> into <code>.cursor/rules/</code>, or reference the full{' '}
            <code>skills/</code> directory. See the{' '}
            <a href={SETUP_GUIDE_LINKS.cursor.href}>{SETUP_GUIDE_LINKS.cursor.label}</a>.
          </p>
        </div>
      </details>

      <details class="quickstart-tool">
        <summary class="quickstart-tool__summary">
          <span class="quickstart-tool__name">Gemini CLI</span>
        </summary>
        <div class="quickstart-tool__body">
          <p class="quickstart-tool__prose">
            Install as native skills for auto-discovery, or add to <code>GEMINI.md</code> for
            persistent context. See the{' '}
            <a href={SETUP_GUIDE_LINKS.geminiCli.href}>{SETUP_GUIDE_LINKS.geminiCli.label}</a>.
          </p>
        </div>
      </details>

      <details class="quickstart-tool">
        <summary class="quickstart-tool__summary">
          <span class="quickstart-tool__name">Windsurf</span>
        </summary>
        <div class="quickstart-tool__body">
          <p class="quickstart-tool__prose">
            Add skill contents to your Windsurf rules configuration. See the{' '}
            <a href={SETUP_GUIDE_LINKS.windsurf.href}>{SETUP_GUIDE_LINKS.windsurf.label}</a>.
          </p>
        </div>
      </details>

      <details class="quickstart-tool">
        <summary class="quickstart-tool__summary">
          <span class="quickstart-tool__name">OpenCode</span>
        </summary>
        <div class="quickstart-tool__body">
          <p class="quickstart-tool__prose">
            Uses agent-driven skill execution via <code>AGENTS.md</code> and the <code>skill</code>{' '}
            tool. See the{' '}
            <a href={SETUP_GUIDE_LINKS.opencode.href}>{SETUP_GUIDE_LINKS.opencode.label}</a>.
          </p>
        </div>
      </details>

      <details class="quickstart-tool">
        <summary class="quickstart-tool__summary">
          <span class="quickstart-tool__name">GitHub Copilot</span>
        </summary>
        <div class="quickstart-tool__body">
          <p class="quickstart-tool__prose">
            Use agent definitions from <code>agents/</code> as Copilot personas and skill content in{' '}
            <code>.github/copilot-instructions.md</code>. See the{' '}
            <a href={SETUP_GUIDE_LINKS.copilot.href}>{SETUP_GUIDE_LINKS.copilot.label}</a>.
          </p>
        </div>
      </details>

      <details class="quickstart-tool">
        <summary class="quickstart-tool__summary">
          <span class="quickstart-tool__name">Kiro IDE &amp; CLI</span>
        </summary>
        <div class="quickstart-tool__body">
          <p class="quickstart-tool__prose">
            Skills for Kiro live under <code>.kiro/skills/</code> at project or global level. Kiro
            also supports <code>Agents.md</code>. See{' '}
            <a href="https://kiro.dev/docs/skills/">Kiro skills documentation</a>.
          </p>
        </div>
      </details>

      <details class="quickstart-tool">
        <summary class="quickstart-tool__summary">
          <span class="quickstart-tool__name">Codex / Other Agents</span>
        </summary>
        <div class="quickstart-tool__body">
          <p class="quickstart-tool__prose">
            Skills are plain Markdown — they work with any agent that accepts system prompts or
            instruction files. See the{' '}
            <a href={SETUP_GUIDE_LINKS.gettingStarted.href}>
              {SETUP_GUIDE_LINKS.gettingStarted.label}
            </a>
            .
          </p>
        </div>
      </details>
    </div>
  );
}
