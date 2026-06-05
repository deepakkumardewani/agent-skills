import CopyableCommand from '../docs/CopyableCommand';

interface Props {
  docsBase: string;
}

export default function QuickstartTools({ docsBase }: Props) {
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
            <code>skills/</code> directory. See{' '}
            <a href={`${docsBase}/cursor-setup.md`}>cursor-setup.md</a>.
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
            persistent context. See{' '}
            <a href={`${docsBase}/gemini-cli-setup.md`}>gemini-cli-setup.md</a>.
          </p>
          <div class="quickstart-tool__step">
            <h3 class="quickstart-tool__step-title">Install from the repo</h3>
            <div class="quickstart-tool__commands">
              <CopyableCommand command="gemini skills install https://github.com/addyosmani/agent-skills.git --path skills" />
            </div>
          </div>
          <div class="quickstart-tool__step">
            <h3 class="quickstart-tool__step-title">Install from a local clone</h3>
            <div class="quickstart-tool__commands">
              <CopyableCommand command="gemini skills install ./agent-skills/skills/" />
            </div>
          </div>
        </div>
      </details>

      <details class="quickstart-tool">
        <summary class="quickstart-tool__summary">
          <span class="quickstart-tool__name">Windsurf</span>
        </summary>
        <div class="quickstart-tool__body">
          <p class="quickstart-tool__prose">
            Add skill contents to your Windsurf rules configuration. See{' '}
            <a href={`${docsBase}/windsurf-setup.md`}>windsurf-setup.md</a>.
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
            tool. See <a href={`${docsBase}/opencode-setup.md`}>opencode-setup.md</a>.
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
            <code>.github/copilot-instructions.md</code>. See{' '}
            <a href={`${docsBase}/copilot-setup.md`}>copilot-setup.md</a>.
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
            instruction files. See <a href={`${docsBase}/getting-started.md`}>getting-started.md</a>
            .
          </p>
        </div>
      </details>
    </div>
  );
}
