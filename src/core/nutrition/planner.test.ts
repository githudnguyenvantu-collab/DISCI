import test from 'node:test';
import assert from 'node:assert/strict';
import { generateNutritionPlan } from './planner.ts';

test('Nutrition plan adjusts calories according to goal', () => {
  const tdee = 2200;
  const weight = 60;

  // Fat loss: TDEE - 400
  const fatLossPlan = generateNutritionPlan(tdee, weight, 'fat_loss');
  assert.equal(fatLossPlan.targetKcal, 1800);
  assert.equal(fatLossPlan.targetProteinGramsMin, Math.round(60 * 1.2));
  assert.equal(fatLossPlan.targetProteinGramsMax, Math.round(60 * 1.6));
  assert.ok(fatLossPlan.dailyMeals.length >= 3);

  // Muscle gain: TDEE + 300
  const musclePlan = generateNutritionPlan(tdee, weight, 'muscle_gain');
  assert.equal(musclePlan.targetKcal, 2500);

  // Disclaimer check
  assert.ok(fatLossPlan.disclaimer.includes('ước tính tham khảo'));
});
