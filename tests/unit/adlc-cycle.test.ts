import { describe, expect, it } from 'vitest';
import {
  ADLC_COMMAND_ROWS,
  ADLC_PHASE_HINTS,
  buildAdlcCyclePhases,
  buildWheelTicks,
  formatDiagramCommand,
  getAdlcCyclePhases,
  hintPlacementForAngle,
  nodeAlignForAngle,
  nodePositionPercent,
} from '../../src/lib/adlc-cycle';

describe('adlc-cycle', () => {
  it('exposes seven cycle phases in ADLC order', () => {
    expect(getAdlcCyclePhases()).toEqual([
      'define',
      'plan',
      'build',
      'test',
      'review',
      'simplify',
      'ship',
    ]);
  });

  it('builds seven phases with docs anchors and README key principles', () => {
    const phases = buildAdlcCyclePhases();
    expect(phases).toHaveLength(7);
    expect(phases[0]?.href).toBe('/docs#phase-define');
    expect(phases[0]?.command).toBe('/spec');
    expect(phases[0]?.hint).toBe('Spec before code');
    expect(ADLC_PHASE_HINTS.ship).toBe('Faster is safer');
    expect(ADLC_COMMAND_ROWS).toHaveLength(7);
  });

  it('places first node at the top of the ring', () => {
    const top = nodePositionPercent(0, 7);
    expect(top.angleDeg).toBe(-90);
    expect(top.x).toBeCloseTo(50, 1);
    expect(top.y).toBeCloseTo(6, 1);
  });

  it('assigns readable alignment per quadrant', () => {
    expect(nodeAlignForAngle(-90)).toBe('center');
    expect(nodeAlignForAngle(0)).toBe('start');
    expect(nodeAlignForAngle(90)).toBe('center');
    expect(nodeAlignForAngle(180)).toBe('end');
  });

  it('places hints away from the orbit center', () => {
    expect(hintPlacementForAngle(-90)).toBe('bottom');
    expect(hintPlacementForAngle(0)).toBe('left');
    expect(hintPlacementForAngle(90)).toBe('top');
    expect(hintPlacementForAngle(180)).toBe('right');
  });

  it('shortens long commands for fixed-width cards', () => {
    expect(formatDiagramCommand('/code-simplify')).toBe('/simplify');
    expect(formatDiagramCommand('/spec')).toBe('/spec');
  });

  it('includes displayCommand on cycle phases', () => {
    const simplify = buildAdlcCyclePhases().find((phase) => phase.phase === 'simplify');
    expect(simplify?.displayCommand).toBe('/simplify');
    expect(simplify?.command).toBe('/code-simplify');
  });

  it('generates twelve wheel ticks with four cardinals', () => {
    const ticks = buildWheelTicks();
    expect(ticks).toHaveLength(12);
    expect(ticks.filter((tick) => tick.cardinal)).toHaveLength(4);
  });
});
