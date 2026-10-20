import test from 'node:test';
import assert from 'node:assert/strict';
import { generateWeeklyWorkoutPlan, substituteExercise } from './scheduler.ts';
import { UserProfile } from '../../types/index.ts';

const mockProfile: UserProfile = {
  id: 'test-user',
  name: 'Thử Nghiệm',
  age: 22,
  gender: 'male',
  heightCm: 170,
  weightKg: 65,
  goal: 'fat_loss',
  experienceLevel: 'beginner',
  daysPerWeek: 3,
  durationMinutes: 30,
  preferredTimeSlot: '18:00',
  environment: 'home',
  equipment: ['none'],
  quietDormitoryMode: false,
  createdAt: '2026-10-20',
  updatedAt: '2026-10-20'
};

test('Workout plan generator creates 7 days with correct workout and rest distribution', () => {
  const plan = generateWeeklyWorkoutPlan({ profile: mockProfile });
  assert.equal(plan.days.length, 7);

  const workoutDays = plan.days.filter(d => !d.isRestDay);
  assert.equal(workoutDays.length, 3);
  assert.ok(workoutDays[0].exercises.length >= 3);
});

test('Quiet Dormitory Mode enforces quiet exercises without noisy jumping', () => {
  const dormProfile: UserProfile = {
    ...mockProfile,
    environment: 'dormitory',
    quietDormitoryMode: true
  };

  const plan = generateWeeklyWorkoutPlan({ profile: dormProfile });
  assert.equal(plan.quietModeApplied, true);

  // Check that no exercise in any day is jumping_jacks
  for (const day of plan.days) {
    if (!day.isRestDay) {
      assert.equal(day.exercises.some(e => e.exerciseId === 'jumping_jacks'), false);
    }
  }
});

test('Substitute exercise replaces jumping or joint-pain exercises with safe alternatives', () => {
  const altQuiet = substituteExercise('jumping_jacks', 'quiet_mode');
  assert.ok(altQuiet);
  assert.equal(altQuiet.exerciseId, 'step_jacks_quiet');
  assert.ok(altQuiet.notes?.includes('Chế độ ký túc xá'));

  const altJoint = substituteExercise('squat', 'joint_pain');
  assert.ok(altJoint);
  assert.equal(altJoint.exerciseId, 'glute_bridge');
});
