
export function embed(text: string): number[] {

    const vector = new Array(10).fill(0);

    for (const char of text) {

        const code = char.charCodeAt(0);

        const index = code % 10

        vector[index] += code

    }
    return vector;
}