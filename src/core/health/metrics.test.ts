import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBmi, calculateTdee, evaluateHealthSafety } from './metrics.ts';

test('BMI calculation: calculates correct value and categorization for Asian standard', () => {
  // 66kg, 172cm -> 66 / (1.72^2) = 22.31 => 22.3 (Cân đối)
  const res = calculateBmi(66, 172);
  assert.equal(res.bmi, 22.3);
  assert.equal(res.category, 'normal');

  // Overweight: 75kg, 170cm -> 75 / (1.7^2) = 25.95 => 26.0 (obese Asian standard)
  const resObese = calculateBmi(75, 170);
  assert.equal(resObese.category, 'obese');

  // Underweight: 45kg, 168cm -> 45 / (1.68^2) = 15.9 => underweight
  const resUnder = calculateBmi(45, 168);
  assert.equal(resUnder.category, 'underweight');

  // Error case for invalid height/weight
  assert.throws(() => calculateBmi(-5, 170), /lớn hơn 0/);
});

test('TDEE calculation: applies Mifflin-St Jeor formula and activity multiplier', () => {
  // Male, 66kg, 172cm, 23yo, 3 days/week (multiplier 1.55)
  // BMR = 10*66 + 6.25*172 - 5*23 + 5 = 660 + 1075 - 115 + 5 = 1625
  // TDEE = 1625 * 1.55 = 2518.75 => 2519
  const res = calculateTdee(66, 172, 23, 'male', 3);
  assert.equal(res.bmr, 1625);
  assert.equal(res.tdee, 2519);
  assert.equal(res.activityMultiplier, 1.55);

  // Female calculation
  const resFemale = calculateTdee(50, 160, 25, 'female', 1);
  // BMR = 10*50 + 6.25*160 - 5*25 - 161 = 500 + 1000 - 125 - 161 = 1214
  assert.equal(resFemale.bmr, 1214);
  assert.equal(resFemale.activityMultiplier, 1.375);
});

test('Health Safety Evaluation: default safe mode when no record provided', () => {
  const assessment = evaluateHealthSafety(null, 22.3);
  assert.equal(assessment.status, 'good');
  assert.equal(assessment.requiresDoctorClearance, false);
  assert.ok(assessment.medicalDisclaimer.includes('tham khảo'));
});

test('Health Safety Evaluation: high blood pressure triggers warning and doctor clearance', () => {
  const assessment = evaluateHealthSafety({
    id: '1',
    userId: 'u1',
    recordedAt: '2026-10-20',
    systolicBp: 165,
    diastolicBp: 102,
    consentForWorkoutAdjustment: true
  }, 23);

  assert.equal(assessment.status, 'high_warning');
  assert.equal(assessment.requiresDoctorClearance, true);
  assert.ok(assessment.warnings.some(w => w.includes('Huyết áp')));
});

test('Health Safety Evaluation: doctor restriction takes top priority', () => {
  const assessment = evaluateHealthSafety({
    id: '2',
    userId: 'u1',
    recordedAt: '2026-10-20',
    doctorExerciseRestrictions: 'Tránh hoàn toàn bài tập gập gối quá 90 độ do thoái hóa sụn chêm',
    doctorAllowedIntensity: 'low',
    consentForWorkoutAdjustment: true
  }, 24);

  assert.equal(assessment.status, 'high_warning');
  assert.ok(assessment.cautions.some(c => c.includes('thoái hóa sụn chêm')));
});
