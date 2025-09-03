/**
 * @file Contains utility functions and constants for water intake warnings.
 * @licence MIT
 */

export const WARNING_THRESHOLD = 8000; // 8 liters in ml
export const CRITICAL_THRESHOLD = 10000; // 10 liters in ml

export const INTAKE_STATUS = {
  OK: 'OK',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL'
};

/**
 * Checks the daily water intake against warning and critical thresholds.
 * @param dailyIntake - The total daily intake in milliliters.
 * @returns An object with the status and a corresponding message.
 */
export function checkWaterIntake(dailyIntake: number) {
  if (dailyIntake >= CRITICAL_THRESHOLD) {
    return {
      status: INTAKE_STATUS.CRITICAL,
      message: "CRITICAL WARNING: Your water intake has reached a potentially dangerous level. Stop drinking water immediately and seek medical advice if you feel unwell (e.g., headache, nausea).",
      threshold: CRITICAL_THRESHOLD
    };
  } else if (dailyIntake >= WARNING_THRESHOLD) {
    return {
      status: INTAKE_STATUS.WARNING,
      message: "Warning: Your daily water intake is high. Exceeding 10 liters can be dangerous. Please be mindful.",
      threshold: WARNING_THRESHOLD
    };
  } else {
    return {
      status: INTAKE_STATUS.OK,
      message: "",
      threshold: null
    };
  }
}
