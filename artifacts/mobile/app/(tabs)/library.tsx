import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as MediaLibrary from "expo-media-library";
import { router, useFocusEffect } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Animated,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { VideoCard } from "@/components/VideoCard";
import { VideoItem, VIDEOS } from "@/data/videos";
import {
  CustomSort,
  LocalVideoItem,
  addCustomSort,
  addLocalVideo,
  applyScript,
  deleteCustomSort,
  getCustomSorts,
  getLocalVideos,
  removeLocalVideo,
  updateCustomSort,
} from "@/utils/localVideos";
import {
  addRecentId,
  clearRecent,
  getRecentIds,
  removeRecentId,
} from "@/utils/storage";

interface SortableVideo {
  id: string;
  title: string;
  uri: string;
  addedAt: number;
  size?: number;
  durationSecs?: number;
  width?: number;
  height?: number;
  mimeType?: string;
  source: "local" | "device";
}

function localToSortable(v: LocalVideoItem): SortableVideo {
  return {
    id: v.id,
    title: v.title,
    uri: v.uri,
    addedAt: v.addedAt,
    size: v.size,
    durationSecs: v.durationSecs,
    width: v.width,
    height: v.height,
    mimeType: v.mimeType,
    source: "local",
  };
}

function assetToSortable(a: MediaLibrary.Asset): SortableVideo {
  return {
    id: `asset_${a.id}`,
    title: a.filename.replace(/\.[^.]+$/, ""),
    uri: a.uri,
    addedAt: a.creationTime,
    durationSecs: a.duration,
    width: a.width,
    height: a.height,
    mimeType: "video",
    source: "device",
  };
}

function filterBySortable(sort: CustomSort, videos: SortableVideo[]): SortableVideo[] {
  if (sort.script && sort.script.trim()) {
    const matchIds = new Set(applyScript(sort.script, videos as any));
    if (matchIds.size > 0) {
      return videos.filter((v) => matchIds.has(v.id));
    }
  }
  const ids = new Set(sort.videoIds);
  return videos.filter((v) => ids.has(v.id));
}

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [localVideos, setLocalVideos] = useState<LocalVideoItem[]>([]);
  const [deviceAssets, setDeviceAssets] = useState<MediaLibrary.Asset[]>([]);
  const [devicePermission, setDevicePermission] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [sorts, setSorts] = useState<CustomSort[]>([]);
  const [activeSortId, setActiveSortId] = useState<string | null>(null);

  const [showSortModal, setShowSortModal] = useState(false);
  const [editingSort, setEditingSort] = useState<CustomSort | null>(null);
  const [sortName, setSortName] = useState("");
  const [sortSelectedIds, setSortSelectedIds] = useState<Set<string>>(new Set());
  const [sortScript, setSortScript] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const webTop = Platform.OS === "web" ? 67 : insets.top;
  const webBottom = Platform.OS === "web" ? 34 : 0;

  const loadData = useCallback(async () => {
    const [ids, locals, sortList] = await Promise.all([
      getRecentIds(),
      getLocalVideos(),
      getCustomSorts(),
    ]);
    setRecentIds(ids);
    setLocalVideos(locals);
    setSorts(sortList);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const loadDeviceVideos = useCallback(async () => {
    try {
      const { status } = await MediaLibrary.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
        if (newStatus !== "granted") return;
      }
      setDevicePermission(true);
      const { assets } = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.video,
        first: 200,
        sortBy: [MediaLibrary.SortBy.creationTime],
      });
      setDeviceAssets(assets);
    } catch {
      setDevicePermission(false);
    }
  }, []);

  useEffect(() => {
    loadDeviceVideos();
  }, [loadDeviceVideos]);

  useEffect(() => {
    if (!devicePermission) return;
    const interval = setInterval(() => {
      loadDeviceVideos();
    }, 30000);
    return () => clearInterval(interval);
  }, [devicePermission, loadDeviceVideos]);

  const recent = recentIds
    .map((id) => VIDEOS.find((v) => v.id === id))
    .filter(Boolean) as VideoItem[];

  const allSortableVideos: SortableVideo[] = [
    ...localVideos.map(localToSortable),
    ...deviceAssets.map(assetToSortable),
  ];

  const activeSort = sorts.find((s) => s.id === activeSortId) ?? null;
  const filteredVideos = activeSort
    ? filterBySortable(activeSort, allSortableVideos)
    : null;

  const handlePickFile = async () => {
    setIsAdding(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const cleanName = asset.name?.replace(/\.[^.]+$/, "") ?? "Unknown Video";
        const item = await addLocalVideo({
          uri: asset.uri,
          title: cleanName,
          addedAt: Date.now(),
          size: asset.size ?? undefined,
          mimeType: asset.mimeType ?? undefined,
        });
        setLocalVideos((prev) => [item, ...prev]);
        router.push({ pathname: "/player", params: { id: item.id } });
      }
    } catch {
      Alert.alert("Error", "Could not open the video file.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleLocalPress = async (video: LocalVideoItem) => {
    await addRecentId(video.id);
    setRecentIds((prev) => [video.id, ...prev.filter((id) => id !== video.id)]);
    router.push({ pathname: "/player", params: { id: video.id } });
  };

  const handleLocalDelete = async (id: string) => {
    Alert.alert("Remove file", "Remove this video from your local library?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const updated = await removeLocalVideo(id);
          setLocalVideos(updated);
          const updatedRecent = await removeRecentId(id);
          setRecentIds(updatedRecent);
        },
      },
    ]);
  };

  const handleDevicePress = async (asset: MediaLibrary.Asset) => {
    const videoId = `asset_${asset.id}`;
    await addRecentId(videoId);
    setRecentIds((prev) => [videoId, ...prev.filter((id) => id !== videoId)]);
    router.push({
      pathname: "/player",
      params: {
        uri: encodeURIComponent(asset.uri),
        name: encodeURIComponent(asset.filename.replace(/\.[^.]+$/, "")),
      },
    });
  };

  const handleRecentPress = async (video: VideoItem) => {
    const updated = await addRecentId(video.id);
    setRecentIds(updated);
    router.push({ pathname: "/player", params: { id: video.id } });
  };

  const handleRecentDelete = async (id: string) => {
    const updated = await removeRecentId(id);
    setRecentIds(updated);
  };

  const handleClearAll = async () => {
    await clearRecent();
    setRecentIds([]);
  };

  const openSortCreator = (sort?: CustomSort) => {
    if (sort) {
      setEditingSort(sort);
      setSortName(sort.name);
      setSortSelectedIds(new Set(sort.videoIds));
      setSortScript(sort.script ?? "");
      setShowAdvanced(!!(sort.script && sort.script.trim()));
    } else {
      setEditingSort(null);
      setSortName("");
      setSortSelectedIds(new Set());
      setSortScript("");
      setShowAdvanced(false);
    }
    setShowSortModal(true);
  };

  const handleSortLongPress = (sort: CustomSort) => {
    Alert.alert(sort.name, "What would you like to do?", [
      {
        text: "Edit",
        onPress: () => openSortCreator(sort),
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = await deleteCustomSort(sort.id);
          setSorts(updated);
          if (activeSortId === sort.id) setActiveSortId(null);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSaveSortModal = async () => {
    const name = sortName.trim();
    if (!name) {
      Alert.alert("Name required", "Please enter a name for this sort.");
      return;
    }
    const payload: Omit<CustomSort, "id"> = {
      name,
      videoIds: Array.from(sortSelectedIds),
      script: sortScript.trim() || undefined,
    };
    if (editingSort) {
      const updated: CustomSort = { id: editingSort.id, ...payload };
      await updateCustomSort(updated);
      setSorts((prev) => prev.map((s) => (s.id === editingSort.id ? updated : s)));
    } else {
      const created = await addCustomSort(payload);
      setSorts((prev) => [...prev, created]);
    }
    setShowSortModal(false);
  };

  const toggleSortVideo = (id: string) => {
    setSortSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sortPills = (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.sortPillsRow}
    >
      <TouchableOpacity
        style={[styles.pill, !activeSortId && styles.pillActive]}
        onPress={() => setActiveSortId(null)}
      >
        <Text style={[styles.pillText, !activeSortId && styles.pillTextActive]}>All</Text>
      </TouchableOpacity>
      {sorts.map((sort) => (
        <TouchableOpacity
          key={sort.id}
          style={[styles.pill, activeSortId === sort.id && styles.pillActive]}
          onPress={() => setActiveSortId(sort.id)}
          onLongPress={() => handleSortLongPress(sort)}
          delayLongPress={500}
        >
          <Text
            style={[
              styles.pillText,
              activeSortId === sort.id && styles.pillTextActive,
            ]}
          >
            {sort.name}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.pillAdd}
        onPress={() => openSortCreator()}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Feather name="plus" size={14} color={colors.textSecondary} />
      </TouchableOpacity>
    </ScrollView>
  );

  if (activeSort && filteredVideos) {
    return (
      <View style={styles.container}>
        <FlatList
          data={filteredVideos}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => (
            <View>
              <View style={[styles.header, { paddingTop: webTop + 10 }]}>
                <Text style={styles.headerTitle}>Library</Text>
              </View>
              {sortPills}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{activeSort.name}</Text>
                <Text style={styles.sectionCount}>{filteredVideos.length} videos</Text>
              </View>
              {filteredVideos.length === 0 && (
                <View style={styles.emptySort}>
                  <Feather name="folder" size={36} color={colors.textTertiary} />
                  <Text style={styles.emptyLocalTitle}>No videos in this sort</Text>
                  <Text style={styles.emptyLocalSub}>
                    Long-press the sort pill to edit it and add videos
                  </Text>
                </View>
              )}
            </View>
          )}
          renderItem={({ item }) => {
            if (item.source === "local") {
              const localItem = localVideos.find((v) => v.id === item.id);
              if (!localItem) return null;
              return (
                <LocalVideoRow
                  video={localItem}
                  onPress={() => handleLocalPress(localItem)}
                  onDelete={() => handleLocalDelete(localItem.id)}
                />
              );
            }
            const assetId = item.id.replace(/^asset_/, "");
            const asset = deviceAssets.find((a) => a.id === assetId);
            if (!asset) return null;
            return (
              <DeviceVideoRow
                asset={asset}
                onPress={() => handleDevicePress(asset)}
              />
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          contentContainerStyle={{ paddingBottom: insets.bottom + webBottom + 80 }}
          showsVerticalScrollIndicator={false}
        />
        <SortCreatorModal
          visible={showSortModal}
          onClose={() => setShowSortModal(false)}
          onSave={handleSaveSortModal}
          sortName={sortName}
          setSortName={setSortName}
          selectedIds={sortSelectedIds}
          toggleVideo={toggleSortVideo}
          allVideos={allSortableVideos}
          script={sortScript}
          setScript={setSortScript}
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
          isEditing={!!editingSort}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={localVideos}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View>
            <View style={[styles.header, { paddingTop: webTop + 10 }]}>
              <Text style={styles.headerTitle}>Library</Text>
            </View>

            {sortPills}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Local Files</Text>
              <TouchableOpacity
                style={[styles.addBtn, isAdding && styles.addBtnDisabled]}
                onPress={handlePickFile}
                disabled={isAdding}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather
                  name={isAdding ? "loader" : "plus"}
                  size={18}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            {localVideos.length === 0 && (
              <TouchableOpacity
                style={styles.emptyLocal}
                onPress={handlePickFile}
                activeOpacity={0.7}
              >
                <Feather name="folder-plus" size={36} color={colors.textTertiary} />
                <Text style={styles.emptyLocalTitle}>Add your first video</Text>
                <Text style={styles.emptyLocalSub}>
                  Tap + to browse video files from your device
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <LocalVideoRow
            video={item}
            onPress={() => handleLocalPress(item)}
            onDelete={() => handleLocalDelete(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListFooterComponent={() => (
          <View>
            {devicePermission && deviceAssets.length > 0 && (
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Device Videos</Text>
                  <Text style={styles.sectionCount}>{deviceAssets.length} found</Text>
                </View>
                {deviceAssets.map((asset, i) => (
                  <View key={asset.id}>
                    <DeviceVideoRow
                      asset={asset}
                      onPress={() => handleDevicePress(asset)}
                    />
                    {i < deviceAssets.length - 1 && <View style={styles.sep} />}
                  </View>
                ))}
              </View>
            )}

            {recent.length > 0 && (
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recently Watched</Text>
                  <TouchableOpacity onPress={handleClearAll}>
                    <Text style={styles.clearText}>Clear All</Text>
                  </TouchableOpacity>
                </View>
                {recent.map((v) => (
                  <SwipeableVideoCard
                    key={v.id}
                    video={v}
                    onPress={handleRecentPress}
                    onDelete={() => handleRecentDelete(v.id)}
                  />
                ))}
              </View>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: insets.bottom + webBottom + 80 }}
        showsVerticalScrollIndicator={false}
      />

      <SortCreatorModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        onSave={handleSaveSortModal}
        sortName={sortName}
        setSortName={setSortName}
        selectedIds={sortSelectedIds}
        toggleVideo={toggleSortVideo}
        allVideos={allSortableVideos}
        script={sortScript}
        setScript={setSortScript}
        showAdvanced={showAdvanced}
        setShowAdvanced={setShowAdvanced}
        isEditing={!!editingSort}
      />
    </View>
  );
}

function DeviceVideoRow({
  asset,
  onPress,
}: {
  asset: MediaLibrary.Asset;
  onPress: () => void;
}) {
  const durationStr =
    asset.duration > 0
      ? `${Math.floor(asset.duration / 60)}:${String(Math.floor(asset.duration % 60)).padStart(2, "0")}`
      : "";
  const displayName = asset.filename.replace(/\.[^.]+$/, "");

  return (
    <TouchableOpacity style={styles.localRow} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.localThumb, { backgroundColor: "#1a2236" }]}>
        <Feather name="video" size={22} color="#5b8dee" />
      </View>
      <View style={styles.localInfo}>
        <Text style={styles.localTitle} numberOfLines={2}>
          {displayName}
        </Text>
        <Text style={styles.localMeta}>
          {[durationStr, asset.width ? `${asset.width}×${asset.height}` : ""]
            .filter(Boolean)
            .join("  ·  ")}
          {!durationStr && !asset.width ? "Device Video" : ""}
        </Text>
      </View>
      <Feather name="play-circle" size={22} color={colors.textTertiary} />
    </TouchableOpacity>
  );
}

function LocalVideoRow({
  video,
  onPress,
  onDelete,
}: {
  video: LocalVideoItem;
  onPress: () => void;
  onDelete: () => void;
}) {
  const date = new Date(video.addedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const meta = [
    video.durationSecs
      ? `${Math.floor(video.durationSecs / 60)}:${String(Math.floor(video.durationSecs % 60)).padStart(2, "0")}`
      : null,
    video.width && video.height ? `${video.width}×${video.height}` : null,
    `Added ${date}`,
  ]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <TouchableOpacity
      style={styles.localRow}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.localThumb}>
        <Feather name="film" size={22} color={colors.accent} />
      </View>
      <View style={styles.localInfo}>
        <Text style={styles.localTitle} numberOfLines={2}>
          {video.title}
        </Text>
        <Text style={styles.localMeta}>{meta}</Text>
      </View>
      <TouchableOpacity
        style={styles.localDeleteBtn}
        onPress={onDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather name="trash-2" size={18} color={colors.textTertiary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

function SwipeableVideoCard({
  video,
  onPress,
  onDelete,
}: {
  video: VideoItem;
  onPress: (v: VideoItem) => void;
  onDelete: () => void;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const DELETE_WIDTH = 80;
  const isOpen = useRef(false);
  const startX = useRef(0);

  const handleSwipe = useCallback(
    (dx: number) => {
      if (dx < -DELETE_WIDTH * 0.5) {
        Animated.spring(translateX, {
          toValue: -DELETE_WIDTH,
          useNativeDriver: true,
        }).start();
        isOpen.current = true;
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        isOpen.current = false;
      }
    },
    [translateX]
  );

  return (
    <View style={styles.swipeRow}>
      <View style={styles.deleteAction}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={onDelete}
          activeOpacity={0.85}
        >
          <Feather name="trash-2" size={20} color="#fff" />
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[styles.swipeContent, { transform: [{ translateX }] }]}
        onStartShouldSetResponder={() => false}
      >
        <View
          onStartShouldSetResponder={(e) => {
            startX.current = e.nativeEvent.pageX;
            return true;
          }}
          onMoveShouldSetResponder={(e) =>
            Math.abs(e.nativeEvent.pageX - startX.current) > 8
          }
          onResponderMove={(e) => {
            const dx = e.nativeEvent.pageX - startX.current;
            const x = Math.max(
              -DELETE_WIDTH * 1.2,
              Math.min(0, dx + (isOpen.current ? -DELETE_WIDTH : 0))
            );
            translateX.setValue(x);
          }}
          onResponderRelease={(e) => {
            const dx = e.nativeEvent.pageX - startX.current;
            handleSwipe(dx + (isOpen.current ? -DELETE_WIDTH : 0));
          }}
        >
          <VideoCard video={video} layout="compact" onPress={onPress} />
        </View>
      </Animated.View>
    </View>
  );
}

interface SortCreatorModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  sortName: string;
  setSortName: (s: string) => void;
  selectedIds: Set<string>;
  toggleVideo: (id: string) => void;
  allVideos: SortableVideo[];
  script: string;
  setScript: (s: string) => void;
  showAdvanced: boolean;
  setShowAdvanced: (v: boolean) => void;
  isEditing: boolean;
}

const SORT_TEMPLATES = [
  { label: "Long Videos", name: "Long Videos", script: "video.durationSecs > 1200" },
  { label: "Short Clips", name: "Short Clips", script: "video.durationSecs < 300" },
  { label: "HD & Above", name: "HD & Above", script: "video.width >= 1280" },
  { label: "Large Files", name: "Large Files", script: "video.size > 500 * 1024 * 1024" },
  { label: "This Week", name: "This Week", script: `video.addedAt > (Date.now() - 7 * 24 * 3600 * 1000)` },
  { label: "Device Only", name: "Device", script: "video.source === 'device'" },
  { label: "Manual Pick", name: "", script: "" },
];

function SortCreatorModal({
  visible,
  onClose,
  onSave,
  sortName,
  setSortName,
  selectedIds,
  toggleVideo,
  allVideos,
  script,
  setScript,
  showAdvanced,
  setShowAdvanced,
  isEditing,
}: SortCreatorModalProps) {
  const applyTemplate = (t: typeof SORT_TEMPLATES[0]) => {
    if (t.name) setSortName(t.name);
    setScript(t.script);
    if (t.script) setShowAdvanced(true);
    else setShowAdvanced(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{isEditing ? "Edit Sort" : "New Sort"}</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>

            {!isEditing && (
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.fieldLabel}>Start from template</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
                  {SORT_TEMPLATES.map((t) => (
                    <TouchableOpacity
                      key={t.label}
                      style={styles.templateChip}
                      onPress={() => applyTemplate(t)}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.templateChipText}>{t.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput
              style={styles.textInput}
              value={sortName}
              onChangeText={setSortName}
              placeholder="e.g. Favorites, Movies, Work…"
              placeholderTextColor={colors.textTertiary}
              autoFocus={!isEditing}
            />

            <Text style={[styles.fieldLabel, { marginTop: 20 }]}>
              Videos ({selectedIds.size} selected)
            </Text>
            {allVideos.length === 0 ? (
              <Text style={styles.emptyHint}>No videos available. Add some first.</Text>
            ) : (
              allVideos.map((v) => (
                <TouchableOpacity
                  key={v.id}
                  style={styles.videoSelectRow}
                  onPress={() => toggleVideo(v.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      selectedIds.has(v.id) && styles.checkboxChecked,
                    ]}
                  >
                    {selectedIds.has(v.id) && (
                      <Feather name="check" size={12} color="#fff" />
                    )}
                  </View>
                  <View style={styles.videoSelectThumb}>
                    <Feather
                      name={v.source === "device" ? "video" : "film"}
                      size={16}
                      color={v.source === "device" ? "#5b8dee" : colors.accent}
                    />
                  </View>
                  <Text style={styles.videoSelectTitle} numberOfLines={1}>
                    {v.title}
                  </Text>
                </TouchableOpacity>
              ))
            )}

            <TouchableOpacity
              style={styles.advancedToggle}
              onPress={() => setShowAdvanced(!showAdvanced)}
              activeOpacity={0.7}
            >
              <Feather
                name={showAdvanced ? "chevron-up" : "chevron-down"}
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.advancedToggleText}>Advanced (Filter Script)</Text>
            </TouchableOpacity>

            {showAdvanced && (
              <View>
                <Text style={styles.scriptHint}>
                  Write a JavaScript expression using the <Text style={{ color: colors.accent }}>video</Text> object.
                  If it returns true, the video is included.{"\n"}
                  Available: <Text style={{ color: colors.accent }}>title, durationSecs, size, width, height, addedAt, source</Text>
                </Text>
                <TextInput
                  style={styles.scriptInput}
                  value={script}
                  onChangeText={setScript}
                  placeholder={
                    'Ask ChatGPT: "Write a Play sort script that shows only videos longer than 20 minutes using video.durationSecs"\n\ne.g.  video.durationSecs > 1200'
                  }
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Text style={styles.scriptNote}>
                  When a script is set, it overrides manual selection.
                </Text>
              </View>
            )}

            <View style={{ height: 24 }} />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
              <Text style={styles.saveBtnText}>Save Sort</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  sortPillsRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    alignItems: "center",
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  pillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  pillText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  pillTextActive: {
    color: colors.text,
    fontFamily: "Inter_600SemiBold",
  },
  pillAdd: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  sectionTitle: {
    color: colors.textTertiary,
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionCount: {
    color: colors.textTertiary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  clearText: {
    color: colors.accent,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnDisabled: {
    opacity: 0.5,
  },
  emptyLocal: {
    margin: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
    borderStyle: "dashed",
    paddingVertical: 36,
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surfaceElevated,
  },
  emptySort: {
    margin: 16,
    borderRadius: 14,
    paddingVertical: 36,
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surfaceElevated,
  },
  emptyLocalTitle: {
    color: colors.textSecondary,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginTop: 4,
  },
  emptyLocalSub: {
    color: colors.textTertiary,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  sep: {
    height: 1,
    backgroundColor: colors.surfaceBorder,
    marginLeft: 72,
    marginRight: 16,
  },
  localRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  localThumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: colors.accentDim,
    justifyContent: "center",
    alignItems: "center",
  },
  localInfo: {
    flex: 1,
    gap: 3,
  },
  localTitle: {
    color: colors.text,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    lineHeight: 20,
  },
  localMeta: {
    color: colors.textTertiary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  localDeleteBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  swipeRow: {
    overflow: "hidden",
    position: "relative",
  },
  deleteAction: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: "#FF453A",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtn: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  deleteBtnText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  swipeContent: {
    backgroundColor: colors.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: "85%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceBorder,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  modalScroll: {
    flexGrow: 0,
  },
  fieldLabel: {
    color: colors.textTertiary,
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  templateChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  templateChipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  emptyHint: {
    color: colors.textTertiary,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingVertical: 16,
  },
  videoSelectRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  videoSelectThumb: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  videoSelectTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  advancedToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 16,
    marginTop: 8,
  },
  advancedToggleText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  scriptHint: {
    color: colors.textTertiary,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    marginBottom: 10,
  },
  scriptInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    minHeight: 100,
    textAlignVertical: "top",
  },
  scriptNote: {
    color: colors.textTertiary,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
    fontStyle: "italic",
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: "center",
  },
  saveBtnText: {
    color: colors.text,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
