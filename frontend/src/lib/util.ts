
export const safeParseInt = (value: string, defaultValue = 0, radix = 10): number => {
    try {
        const res = parseInt(value, radix);
        if (Number.isNaN(res)) {
            return defaultValue;
        }
        return res;
    } catch (e) {
        return defaultValue;
    }
};

export const safeParseJson = <T>(value: string | undefined |null, defaultValue: T): T => {
    if (!value) return defaultValue;
    try {
        return JSON.parse(value);
    } catch {
        return defaultValue;
    }
};
