import type { Root } from 'hast';
import { visit } from 'unist-util-visit';

/** GFM task-list checkboxes in synced SKILL.md are display-only on this docs site. */
export function rehypeTaskListA11y() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'input' || node.properties?.type !== 'checkbox') {
        return;
      }

      node.properties['aria-hidden'] = 'true';
      node.properties.tabIndex = -1;
    });
  };
}
