import React, { useRef, useMemo, useCallback, useState } from 'react';
import { View, StyleSheet, FlatList, Animated, PanResponder, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';
import { useShowStore } from '../../src/store/useShowStore';
import { useLocation } from '../../src/hooks/useLocation';
import { VenueMarker } from '../../src/components/map/VenueMarker';
import { ShowCard } from '../../src/components/show/ShowCard';
import { Text } from '../../src/components/ui/Text';
import { colors, spacing } from '../../src/theme';
import { Show } from '../../src/api/types';
import { isToday, parseISO } from 'date-fns';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SNAP_LOW = SCREEN_HEIGHT * 0.65;
const SNAP_MID = SCREEN_HEIGHT * 0.35;
const SNAP_HIGH = SCREEN_HEIGHT * 0.1;

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

  const sheetY = useRef(new Animated.Value(SNAP_LOW)).current;
  const lastY = useRef(SNAP_LOW);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
      onPanResponderMove: (_, g) => {
        const newY = Math.max(SNAP_HIGH, Math.min(SNAP_LOW, lastY.current + g.dy));
        sheetY.setValue(newY);
      },
      onPanResponderRelease: (_, g) => {
        const currentY = lastY.current + g.dy;
        let snapTo: number;
        if (currentY < (SNAP_HIGH + SNAP_MID) / 2) snapTo = SNAP_HIGH;
        else if (currentY < (SNAP_MID + SNAP_LOW) / 2) snapTo = SNAP_MID;
        else snapTo = SNAP_LOW;

        lastY.current = snapTo;
        Animated.spring(sheetY, { toValue: snapTo, useNativeDriver: false, speed: 20, bounciness: 4 }).start();
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

  const handleMarkerPress = useCallback((venueId: string) => {
    setSelectedVenueId(venueId);
    lastY.current = SNAP_MID;
    Animated.spring(sheetY, { toValue: SNAP_MID, useNativeDriver: false, speed: 20, bounciness: 4 }).start();
  }, []);

  const sortedShows = useMemo(() => {
    if (!selectedVenueId) return shows;
    const venueShowsList = venueShows.get(selectedVenueId) || [];
    const otherShows = shows.filter((s) => s.venue.id !== selectedVenueId);
    return [...venueShowsList, ...otherShows];
  }, [shows, selectedVenueId, venueShows]);

  const renderShowItem = useCallback(({ item }: { item: Show }) => (
    <ShowCard show={item} />
  ), []);

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
        <View {...panResponder.panHandlers} style={styles.sheetHandleArea}>
          <View style={styles.sheetHandle} />
        </View>
        <View style={styles.sheetHeader}>
          <Text variant="title2">
            {selectedVenueId
              ? venueShows.get(selectedVenueId)?.[0]?.venue.name ?? 'Shows'
              : 'Nearby Shows'
            }
          </Text>
          <Text variant="caption" color="textSecondary">
            {sortedShows.length} show{sortedShows.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <FlatList
          data={sortedShows}
          keyExtractor={(item) => item.id}
          renderItem={renderShowItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
  sheetHandleArea: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textTertiary,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  listContent: {
    paddingBottom: 100,
  },
});
