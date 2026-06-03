import type { Phase } from '../data/skills-data';
import { getPhaseMeta, groupSkillsByPhase, PHASE_ORDER } from './skills';

/** Short copy for landing diagram nodes and the mobile list. */
export const ADLC_PHASE_HINTS: Readonly<Record<Exclude<Phase, 'meta'>, string>> = {
  define: 'Shape the problem before you write code.',
  plan: 'Break work into ordered, shippable steps.',
  build: 'Implement incrementally against the plan.',
  test: 'Prove behavior with tests that fail first.',
  review: 'Check quality across multiple axes before merge.',
  simplify: 'Remove complexity that does not earn its keep.',
  ship: 'Launch with checklist, monitoring, and rollback in mind.',
};

export type NodeAlign = 'center' | 'start' | 'end';
export type HintPlacement = 'top' | 'bottom' | 'left' | 'right';

/** Fixed diagram card width — keeps all orbit nodes visually equal. */
export const ADLC_NODE_CARD_WIDTH_REM = 10.5;

export interface AdlcCyclePhase {
  phase: Exclude<Phase, 'meta'>;
  index: number;
  label: string;
  command: string;
  displayCommand: string;
  hint: string;
  href: string;
  x: number;
  y: number;
  angleDeg: number;
  align: NodeAlign;
  hintPlacement: HintPlacement;
  revealDelayMs: number;
}

export interface WheelTick {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cardinal: boolean;
}

const CYCLE_PHASES = PHASE_ORDER.filter(
  (phase): phase is Exclude<Phase, 'meta'> => phase !== 'meta',
);

export function getAdlcCyclePhases(): readonly Exclude<Phase, 'meta'>[] {
  return CYCLE_PHASES;
}

/** Short label for the fixed-width orbit card; full command stays in `command` + hint. */
export function formatDiagramCommand(command: string): string {
  if (command === '/code-simplify') {
    return '/simplify';
  }
  return command;
}

export function hintPlacementForAngle(angleDeg: number): HintPlacement {
  const normalized = ((angleDeg % 360) + 360) % 360;
  if (normalized >= 225 && normalized < 315) {
    return 'bottom';
  }
  if (normalized >= 45 && normalized < 135) {
    return 'top';
  }
  if (normalized >= 315 || normalized < 45) {
    return 'left';
  }
  return 'right';
}

export function nodeAlignForAngle(angleDeg: number): NodeAlign {
  const normalized = ((angleDeg % 360) + 360) % 360;
  if (normalized >= 225 && normalized < 315) {
    return 'center';
  }
  if (normalized >= 315 || normalized < 45) {
    return 'start';
  }
  if (normalized >= 45 && normalized < 135) {
    return 'center';
  }
  return 'end';
}

/** Place nodes on a ring in percent coordinates (0–100 viewBox). */
export function nodePositionPercent(
  index: number,
  total: number,
  ringRadius = 44,
  center = 50,
): { x: number; y: number; angleDeg: number } {
  const angleDeg = (360 / total) * index - 90;
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: center + ringRadius * Math.cos(angleRad),
    y: center + ringRadius * Math.sin(angleRad),
    angleDeg,
  };
}

export function buildAdlcCyclePhases(ringRadius = 44, center = 50): AdlcCyclePhase[] {
  const groups = groupSkillsByPhase().filter((g) => g.phase !== 'meta');
  const total = groups.length;

  return groups.map((group, index) => {
    const phase = group.phase as Exclude<Phase, 'meta'>;
    const meta = getPhaseMeta(phase);
    const { x, y, angleDeg } = nodePositionPercent(index, total, ringRadius, center);

    return {
      phase,
      index,
      label: meta.label,
      command: meta.command,
      displayCommand: formatDiagramCommand(meta.command),
      hint: ADLC_PHASE_HINTS[phase],
      href: `/docs#phase-${phase}`,
      x,
      y,
      angleDeg,
      align: nodeAlignForAngle(angleDeg),
      hintPlacement: hintPlacementForAngle(angleDeg),
      revealDelayMs: index * 70,
    };
  });
}

export function buildWheelTicks(tickCount = 12, ringRadius = 44, center = 50): WheelTick[] {
  return Array.from({ length: tickCount }, (_, index) => {
    const angleDeg = (360 / tickCount) * index - 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    const cardinal = index % (tickCount / 4) === 0;
    const innerOffset = cardinal ? 2.8 : 1.8;
    const outerOffset = cardinal ? 0.4 : 0.15;
    const r1 = ringRadius - innerOffset;
    const r2 = ringRadius + outerOffset;

    return {
      x1: center + r1 * Math.cos(angleRad),
      y1: center + r1 * Math.sin(angleRad),
      x2: center + r2 * Math.cos(angleRad),
      y2: center + r2 * Math.sin(angleRad),
      cardinal,
    };
  });
}

export function flowArcPath(startDeg: number, endDeg: number, radius: number, center = 50): string {
  const startRad = (startDeg * Math.PI) / 180;
  const endRad = (endDeg * Math.PI) / 180;
  const x1 = center + radius * Math.cos(startRad);
  const y1 = center + radius * Math.sin(startRad);
  const x2 = center + radius * Math.cos(endRad);
  const y2 = center + radius * Math.sin(endRad);
  const sweep = endDeg - startDeg > 0 ? 1 : 0;
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${x2} ${y2}`;
}
