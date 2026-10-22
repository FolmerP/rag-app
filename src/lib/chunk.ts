
export function chunkText(text: string): string[] {
      const chunkSize = 275;
      const overlap = 65;
      const step = chunkSize - overlap;

      const chunks: string[] = []

      for (let i = 0; i < text.length; i += step ){
            let curChunk = text.slice(i, i + chunkSize);
            curChunk = curChunk.trim();

            if (curChunk.length > 0){
            chunks.push(curChunk)
            }
      }

      return chunks

} 

