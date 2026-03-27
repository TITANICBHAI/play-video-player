import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { VideoPlayer } from "@/components/Player/VideoPlayer";
import { VIDEOS } from "@/data/videos";
import { SubtitleCue, parseSRT } from "@/utils/srtParser";
import { getLocalVideo } from "@/utils/localVideos";
import { addRecentId, getPosition, savePosition } from "@/utils/storage";

interface VideoData {
  id: string;
  uri: string;
  title: string;
  subtitle?: string;
  meta?: {
    size?: number;
    width?: number;
    height?: number;
    mimeType?: string;
    durationSecs?: number;
  };
}

export default function PlayerScreen() {
  const params = useLocalSearchParams<{ id?: string; uri?: string; name?: string }>();
  const insets = useSafeAreaInsets();
  const [video, setVideo] = useState<VideoData | null>(null);
  const [resumeFrom, setResumeFrom] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [subtitleCues, setSubtitleCues] = useState<SubtitleCue[]>([]);
  const lastSavedRef = useRef(0);
  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentTimeRef = useRef(0);

  useEffect(() => {
    async function load() {
      let found: VideoData | null = null;

      if (params.uri) {
        const name = params.name ? decodeURIComponent(params.name) : "Video";
        const videoId = `direct_${encodeURIComponent(params.uri)}`;
        found = {
          id: videoId,
          uri: decodeURIComponent(params.uri),
          title: name,
          subtitle: "Device Video",
        };
      } else if (params.id) {
        const fromLibrary = VIDEOS.find((v) => v.id === params.id);
        if (fromLibrary) {
          found = {
            id: fromLibrary.id,
            uri: fromLibrary.uri,
            title: fromLibrary.title,
            subtitle: fromLibrary.subtitle,
          };
        } else {
          const local = await getLocalVideo(params.id);
          if (local) {
            found = {
              id: local.id,
              uri: local.uri,
              title: local.title,
              subtitle: "Local File",
              meta: {
                size: local.size,
                width: local.width,
                height: local.height,
                mimeType: local.mimeType,
                durationSecs: local.durationSecs,
              },
            };
          }
        }
      }

      if (!found) {
        setNotFound(true);
        setLoaded(true);
        return;
      }

      const videoId = found.id;
      const [pos] = await Promise.all([
        getPosition(videoId),
        addRecentId(videoId),
      ]);

      setVideo(found);
      setResumeFrom(pos);
      setLoaded(true);
    }

    load();
  }, [params.id, params.uri, params.name]);

  useEffect(() => {
    const videoId = video?.id;
    if (!videoId) return;
    saveIntervalRef.current = setInterval(() => {
      if (currentTimeRef.current !== lastSavedRef.current && currentTimeRef.current > 0) {
        savePosition(videoId, currentTimeRef.current);
        lastSavedRef.current = currentTimeRef.current;
      }
    }, 5000);
    return () => {
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
      if (currentTimeRef.current > 0 && videoId) {
        savePosition(videoId, currentTimeRef.current);
      }
    };
  }, [video?.id]);

  const handleTimeUpdate = useCallback((seconds: number) => {
    currentTimeRef.current = seconds;
  }, []);

  const handleSubtitlePress = useCallback(async () => {
    if (subtitleCues.length > 0) {
      Alert.alert("Subtitles", "Clear loaded subtitles?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => setSubtitleCues([]),
        },
      ]);
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/x-subrip", "text/plain", "*/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const response = await fetch(asset.uri);
        const text = await response.text();
        const cues = parseSRT(text);
        if (cues.length === 0) {
          Alert.alert("Invalid file", "No subtitle cues were found. Make sure it's a valid .srt file.");
          return;
        }
        setSubtitleCues(cues);
      }
    } catch {
      Alert.alert("Error", "Could not load the subtitle file.");
    }
  }, [subtitleCues]);

  if (!loaded) {
    return <View style={styles.container} />;
  }

  if (notFound || !video) {
    return (
      <View style={[styles.errorView, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Video not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <VideoPlayer
        uri={video.uri}
        title={video.title}
        subtitle={video.subtitle}
        resumeFrom={resumeFrom}
        onBack={() => router.back()}
        onTimeUpdate={handleTimeUpdate}
        autoPlay
        subtitleCues={subtitleCues}
        onSubtitlePress={handleSubtitlePress}
        videoMeta={video.meta}
      />

      <View style={styles.infoBlock}>
        <Text style={styles.videoTitle}>{video.title}</Text>
        {video.subtitle && (
          <Text style={styles.videoSubtitle}>{video.subtitle}</Text>
        )}
        <Text style={styles.ccHint}>
          Tap the{" "}
          <Text style={{ color: colors.accent }}>CC</Text>
          {" "}button in the player to load a subtitle (.srt) file
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  infoBlock: {
    padding: 16,
    gap: 6,
  },
  videoTitle: {
    color: colors.text,
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 24,
  },
  videoSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  ccHint: {
    color: colors.textTertiary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  errorView: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
});
