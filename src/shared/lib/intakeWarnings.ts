export const WARNING_THRESHOLD = 8000; // 8 liters in ml
export const CRITICAL_THRESHOLD = 10000; // 10 liters in ml

export const INTAKE_STATUS = {
    OK: 'OK',
    WARNING: 'WARNING',
    CRITICAL: 'CRITICAL'
};

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
