import React, { useRef, useMemo, useCallback, useState } from 'react';
import { View, StyleSheet, FlatList, Animated, PanResponder, Dimensions, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, ChevronUp } from 'lucide-react-native';
import { useShowStore } from '../../src/store/useShowStore';
import { useLocation } from '../../src/hooks/useLocation';
import { VenueMarker } from '../../src/components/map/VenueMarker';
import { ShowCard } from '../../src/components/show/ShowCard';
import { Text } from '../../src/components/ui/Text';
import { colors, spacing } from '../../src/theme';
import { Show } from '../../src/api/types';
import { isToday, parseISO } from 'date-fns';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 64;
const SNAP_LOW = SCREEN_HEIGHT - TAB_BAR_HEIGHT - 160;
const SNAP_MID = SCREEN_HEIGHT * 0.4;
const SNAP_HIGH = SCREEN_HEIGHT * 0.08;

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#5a5550' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#252525' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#5a5550' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d0d0d' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
];

export default function MapScreen() {
  const shows = useShowStore((s) => s.shows);
  const { location } = useLocation();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const sheetY = useRef(new Animated.Value(SNAP_LOW)).current;
  const lastY = useRef(SNAP_LOW);

  const snapTo = useCallback((target: number) => {
    lastY.current = target;
    setSheetExpanded(target <= SNAP_MID);
    Animated.spring(sheetY, {
      toValue: target,
      useNativeDriver: false,
      speed: 18,
      bounciness: 3,
    }).start();
  }, [sheetY]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 8,
      onPanResponderMove: (_, g) => {
        const newY = Math.max(SNAP_HIGH, Math.min(SNAP_LOW, lastY.current + g.dy));
        sheetY.setValue(newY);
      },
      onPanResponderRelease: (_, g) => {
        const currentY = lastY.current + g.dy;
        const velocity = g.vy;

        let target: number;
        if (velocity < -0.5) {
          // Fast swipe up
          if (currentY > SNAP_MID) target = SNAP_MID;
          else target = SNAP_HIGH;
        } else if (velocity > 0.5) {
          // Fast swipe down
          if (currentY < SNAP_MID) target = SNAP_MID;
          else target = SNAP_LOW;
        } else {
          // Slow drag, snap to nearest
          const distances = [
            { point: SNAP_HIGH, dist: Math.abs(currentY - SNAP_HIGH) },
            { point: SNAP_MID, dist: Math.abs(currentY - SNAP_MID) },
            { point: SNAP_LOW, dist: Math.abs(currentY - SNAP_LOW) },
          ];
          distances.sort((a, b) => a.dist - b.dist);
          target = distances[0].point;
        }

        snapTo(target);
      },
    })
  ).current;

  const venueShows = useMemo(() => {
    const map = new Map<string, Show[]>();
    shows.forEach((show) => {
      const existing = map.get(show.venue.id) || [];
      existing.push(show);
      map.set(show.venue.id, existing);
    });
    return map;
  }, [shows]);

  const flatListRef = useRef<FlatList<Show>>(null);

  const handleMarkerPress = useCallback((venueId: string) => {
    setSelectedVenueId(venueId);
    snapTo(SNAP_MID);
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
  }, [snapTo]);

  const sortedShows = useMemo(() => {
    if (!selectedVenueId) return shows;
    const venueShowsList = venueShows.get(selectedVenueId) || [];
    const otherShows = shows.filter((s) => s.venue.id !== selectedVenueId);
    return [...venueShowsList, ...otherShows];
  }, [shows, selectedVenueId, venueShows]);

  const selectedVenueShowIds = useMemo(() => {
    if (!selectedVenueId) return new Set<string>();
    return new Set((venueShows.get(selectedVenueId) || []).map((s) => s.id));
  }, [selectedVenueId, venueShows]);

  const renderShowItem = useCallback(({ item, index }: { item: Show; index: number }) => {
    const isVenueMatch = selectedVenueShowIds.has(item.id);
    const isLastMatch = isVenueMatch && index < sortedShows.length - 1 && !selectedVenueShowIds.has(sortedShows[index + 1]?.id);

    return (
      <View>
        {isVenueMatch && (
          <View style={styles.matchIndicator} />
        )}
        <ShowCard show={item} />
        {isLastMatch && (
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text variant="caption" color="textTertiary" style={styles.dividerText}>
              Other shows nearby
            </Text>
            <View style={styles.dividerLine} />
          </View>
        )}
      </View>
    );
  }, [selectedVenueShowIds, sortedShows]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.06,
          longitudeDelta: 0.06,
        }}
        customMapStyle={darkMapStyle}
        showsUserLocation
        showsMyLocationButton={false}
        onPress={() => setSelectedVenueId(null)}
      >
        {Array.from(venueShows.entries()).map(([venueId, vShows]) => {
          const venue = vShows[0].venue;
          const hasTonight = vShows.some((s) => isToday(parseISO(s.date)));
          return (
            <Marker
              key={venueId}
              coordinate={venue.coordinates}
              onPress={() => handleMarkerPress(venueId)}
            >
              <VenueMarker
                isTonight={hasTonight}
                isSelected={selectedVenueId === venueId}
              />
            </Marker>
          );
        })}
      </MapView>

      <View style={[styles.headerOverlay, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.searchBar}>
          <MapPin size={18} color={colors.primary} />
          <Text variant="callout" color="textSecondary" style={{ marginLeft: spacing.sm }}>
            San Francisco Bay Area
          </Text>
        </View>
      </View>

      <Animated.View style={[styles.sheet, { top: sheetY }]}>
        <View {...panResponder.panHandlers} style={styles.dragArea}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View>
              <Text variant="title2">
                {selectedVenueId
                  ? venueShows.get(selectedVenueId)?.[0]?.venue.name ?? 'Shows'
                  : 'Nearby Shows'
                }
              </Text>
              <Text variant="caption" color="textSecondary" style={{ marginTop: 2 }}>
                {sortedShows.length} show{sortedShows.length !== 1 ? 's' : ''}
              </Text>
            </View>
            {!sheetExpanded && (
              <View style={styles.pullHint}>
                <ChevronUp size={16} color={colors.textTertiary} />
                <Text variant="micro" color="textTertiary">Pull up</Text>
              </View>
            )}
          </View>
        </View>
        <FlatList
          ref={flatListRef}
          data={sortedShows}
          keyExtractor={(item) => item.id}
          renderItem={renderShowItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={sheetExpanded}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.92)',
    borderRadius: 14,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  dragArea: {
    paddingTop: 10,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textTertiary,
    alignSelf: 'center',
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  pullHint: {
    alignItems: 'center',
    gap: 2,
  },
  listContent: {
    paddingBottom: 120,
  },
  matchIndicator: {
    position: 'absolute',
    left: 4,
    top: 8,
    bottom: 8,
    width: 3,
    borderRadius: 1.5,
    backgroundColor: colors.primary,
    zIndex: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
  },
});
