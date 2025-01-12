
export const fuzzyMatch = (query: string, target: string) => {
    let queryIndex = 0;
    for (const char of target.toLowerCase()) {
        if (char === query[queryIndex]) {
            queryIndex++;
        }
        if (queryIndex === query.length) {
            return true;
        }
    }
    return false;
};
