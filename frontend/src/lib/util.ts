
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
