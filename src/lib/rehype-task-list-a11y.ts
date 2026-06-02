import type { Root } from 'hast';
import { visit } from 'unist-util-visit';

/** GFM task-list checkboxes in synced SKILL.md are display-only on this docs site. */
export function rehypeTaskListA11y() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'input' || node.properties?.type !== 'checkbox') {
        return;
      }

      const checked = node.properties.checked !== undefined;
      node.properties.disabled = true;
      node.properties.tabIndex = -1;
      node.properties['aria-label'] = checked
        ? 'Completed checklist item (display only)'
        : 'Incomplete checklist item (display only)';
    });
  };
}
