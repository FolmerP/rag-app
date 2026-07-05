
export function chunkText(text: string): string[] {

      const chunks = text.split("\n").filter((chunk) => chunk.length > 0)

      return chunks

} 
