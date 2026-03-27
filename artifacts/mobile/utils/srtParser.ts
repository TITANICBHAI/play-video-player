export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
}

function timeToSeconds(timeStr: string): number {
  const [time, ms] = timeStr.split(",");
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds + Number(ms) / 1000;
}

export function parseSRT(content: string): SubtitleCue[] {
  const cues: SubtitleCue[] = [];
  const blocks = content.trim().replace(/\r\n/g, "\n").split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length < 3) continue;

    const timeLine = lines[1].trim();
    const match = timeLine.match(
      /(\d{2}:\d{2}:\d{2},\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2},\d{3})/
    );
    if (!match) continue;

    const start = timeToSeconds(match[1]);
    const end = timeToSeconds(match[2]);
    const text = lines
      .slice(2)
      .join("\n")
      .replace(/<[^>]+>/g, "")
      .trim();

    if (text) cues.push({ start, end, text });
  }

  return cues;
}

export function getCurrentSubtitle(
  cues: SubtitleCue[],
  currentTime: number
): string | null {
  const cue = cues.find((c) => currentTime >= c.start && currentTime <= c.end);
  return cue ? cue.text : null;
}
