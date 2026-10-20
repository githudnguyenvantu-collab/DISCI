import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateWorkoutStreak } from './streak.ts';

test('calculateWorkoutStreak: returns 0 when no dates provided', () => {
  const result = calculateWorkoutStreak([]);
  assert.equal(result.currentStreak, 0);
  assert.equal(result.isMilestone, false);
});

test('calculateWorkoutStreak: calculates 3-day consecutive streak correctly', () => {
  const dates = ['2026-10-18', '2026-10-19', '2026-10-20'];
  const result = calculateWorkoutStreak(dates, '2026-10-20');
  assert.equal(result.currentStreak, 3);
  assert.equal(result.isMilestone, true);
  assert.equal(result.streakTitle, 'Đang Bứt Phá');
  assert.ok(result.milestoneMessage.includes('3 ngày liên tiếp'));
});

test('calculateWorkoutStreak: calculates 7-day milestone streak', () => {
  const dates = [
    '2026-10-14',
    '2026-10-15',
    '2026-10-16',
    '2026-10-17',
    '2026-10-18',
    '2026-10-19',
    '2026-10-20'
  ];
  const result = calculateWorkoutStreak(dates, '2026-10-20');
  assert.equal(result.currentStreak, 7);
  assert.equal(result.streakTitle, 'Chiến Binh 7 Ngày');
  assert.ok(result.milestoneMessage.includes('7 ngày liên tiếp'));
  assert.equal(result.nextMilestone, 14);
});
