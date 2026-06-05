import type { Element, Root } from 'hast';
import { describe, expect, it } from 'vitest';
import { rehypeTaskListA11y } from '../../src/lib/rehype-task-list-a11y';

function checkboxInput(checked?: boolean): Element {
  return {
    type: 'element',
    tagName: 'input',
    properties: {
      type: 'checkbox',
      ...(checked !== undefined ? { checked } : {}),
    },
    children: [],
  };
}

describe('rehypeTaskListA11y', () => {
  it('marks unchecked task-list inputs as disabled display-only controls', () => {
    const input = checkboxInput();
    const tree: Root = { type: 'root', children: [input] };

    rehypeTaskListA11y()(tree);

    expect(input.properties?.disabled).toBe(true);
    expect(input.properties?.tabIndex).toBe(-1);
    expect(input.properties?.['aria-label']).toBe('Incomplete checklist item (display only)');
  });

  it('labels checked task-list inputs as completed display-only controls', () => {
    const input = checkboxInput(true);
    const tree: Root = { type: 'root', children: [input] };

    rehypeTaskListA11y()(tree);

    expect(input.properties?.['aria-label']).toBe('Completed checklist item (display only)');
  });

  it('ignores non-checkbox inputs and other elements', () => {
    const textInput: Element = {
      type: 'element',
      tagName: 'input',
      properties: { type: 'text' },
      children: [],
    };
    const paragraph: Element = {
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [],
    };
    const tree: Root = { type: 'root', children: [textInput, paragraph] };

    rehypeTaskListA11y()(tree);

    expect(textInput.properties?.disabled).toBeUndefined();
    expect(paragraph.properties?.disabled).toBeUndefined();
  });
});
