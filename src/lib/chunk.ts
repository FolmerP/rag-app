export function chunkText(text: string): string[] {
    const targetSize = 500;
    const maxSegment = 500;

    //split into sentences at . ! or ? 
    const rawSegments = text
        .split(/\n+/)
        .flatMap((line) => line.split(/(?<=[.!?])\s+/))
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    const segments: string[] = [];
    for (const seg of rawSegments) {
        if (seg.length <= maxSegment) {
            segments.push(seg);
        } else {
            for (let i = 0; i < seg.length; i += maxSegment) {
                segments.push(seg.slice(i, i + maxSegment));
            }
        }
    }

    const chunks: string[] = [];
    let current = "";
    for (const seg of segments) {
        if (current.length > 0 && current.length + seg.length > targetSize) {
            chunks.push(current);
            current = seg;
        } else {
            current = current.length === 0 ? seg : `${current} ${seg}`;
        }
    }
    if (current.length > 0) {
        chunks.push(current);
    }

    return chunks;
}