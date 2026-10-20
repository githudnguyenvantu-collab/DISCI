import test from 'node:test';
import assert from 'node:assert/strict';
import { getExercisePostureGuide } from './postureGuide.ts';

test('getExercisePostureGuide: returns accurate squat posture angles and phases', () => {
  const guide = getExercisePostureGuide('squat');
  assert.equal(guide.exerciseId, 'squat');
  assert.ok(guide.keySafetyAngle.includes('90°'));
  assert.ok(guide.phases.length >= 3);
  assert.equal(guide.phases[0].phaseName, 'Tư thế bắt đầu');
});

test('getExercisePostureGuide: returns pushup 45-degree elbow safety angle', () => {
  const guide = getExercisePostureGuide('pushup');
  assert.ok(guide.keySafetyAngle.includes('45°'));
  assert.ok(guide.rhythmCadence.includes('hạ ngực'));
});

test('getExercisePostureGuide: returns fallback safe guide for unknown exercises', () => {
  const guide = getExercisePostureGuide('unknown_custom_exercise');
  assert.ok(guide);
  assert.ok(guide.phases.length > 0);
});
