let castModule: any = null;
try {
  castModule = require("react-native-google-cast");
} catch {}

export const isCastAvailable = (): boolean => !!castModule;

export interface CastMediaOptions {
  mediaUrl: string;
  title: string;
  contentType?: string;
  playPosition?: number;
}

export async function castMedia(opts: CastMediaOptions): Promise<void> {
  if (!castModule) throw new Error("cast_unavailable");
  await castModule.default.castMedia({
    mediaUrl: opts.mediaUrl,
    title: opts.title,
    contentType: opts.contentType ?? "video/mp4",
    playPosition: opts.playPosition ?? 0,
  });
}

export async function endCastSession(): Promise<void> {
  if (!castModule) return;
  await castModule.default.endSession();
}

export function addCastStateListener(
  cb: (state: string) => void
): (() => void) | undefined {
  if (!castModule) return undefined;
  try {
    const sub = castModule.default.onCastStateChanged(cb);
    return () => sub?.remove?.();
  } catch {
    return undefined;
  }
}
