export function generateString(length, rules) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    if (rules.startsWith) {
        result += rules.startsWith[Math.floor(Math.random() * rules.startsWith.length)];
    }
    for (let i = result.length; i < length - (rules.endsWith ? 1 : 0); i++) {
        let randomChar = chars[Math.floor(Math.random() * chars.length)];
        if (rules.noRepeatingChars && result.includes(randomChar)) {
            i--;
            continue;
        }
        result += randomChar;
    }
    if (rules.endsWith) {
        result += rules.endsWith[Math.floor(Math.random() * rules.endsWith.length)];
    }
    if (rules.thirdCharList && result.length >= 3) {
        result = result.substring(0, 2) + rules.thirdCharList[Math.floor(Math.random() * rules.thirdCharList.length)] + result.substring(3);
    }
    if (rules.containsChar && !result.includes(rules.containsChar)) {
        result = result.substring(0, result.length - 1) + rules.containsChar;
    }
    return result;
}
export function generateCode(str) {
    return str.split('').map(char => char.charCodeAt(0).toString(16)).join('');
}
export function verifyCode(code, originalStr, rules) {
    let decodedStr = "";
    for (let i = 0; i < code.length; i += 2) {
        decodedStr += String.fromCharCode(parseInt(code.substring(i, i + 2), 16));
    }
    if (rules.sumMultiple) {
        const sumAscii = decodedStr.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        if (sumAscii % rules.sumMultiple !== 0)
            return false;
    }
    if (rules.thirdCharList && decodedStr.length >= 3 && !rules.thirdCharList.includes(decodedStr[2]))
        return false;
    if (rules.lengthEven && code.length % 2 !== 0)
        return false;
    if (rules.startsWith && !rules.startsWith.includes(decodedStr[0]))
        return false;
    if (rules.endsWith && !rules.endsWith.includes(decodedStr[decodedStr.length - 1]))
        return false;
    if (rules.containsChar && !decodedStr.includes(rules.containsChar))
        return false;
    if (rules.noRepeatingChars && new Set(decodedStr).size !== decodedStr.length)
        return false;
    if (rules.maxVowels) {
        const vowelCount = decodedStr.split('').filter(c => "AEIOU".includes(c)).length;
        if (vowelCount > rules.maxVowels)
            return false;
    }
    return decodedStr === originalStr;
}
export function generateAndVerify(length, rules) {
    let str, code, isValid;
    let attempts = 0, maxAttempts = 1000; // Evitar bucle infinito
    const startTime = performance.now();
    do {
        if (attempts++ > maxAttempts)
            throw new Error("No se pudo generar una cadena válida dentro del límite de intentos");
        str = generateString(length, rules);
        code = generateCode(str);
        isValid = verifyCode(code, str, rules);
    } while (!isValid);
    const endTime = performance.now();
    console.log(`Tiempo de ejecución: ${(endTime - startTime).toFixed(4)} ms`);
    return { str, code, isValid, executionTime: (endTime - startTime).toFixed(4) };
}
