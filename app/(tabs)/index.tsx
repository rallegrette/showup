import React, { useRef, useMemo, useCallback, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { useShowStore } from '../../src/store/useShowStore';
import { useLocation } from '../../src/hooks/useLocation';
import { VenueMarker } from '../../src/components/map/VenueMarker';
import { ShowCard } from '../../src/components/show/ShowCard';
import { Text } from '../../src/components/ui/Text';
import { colors, spacing } from '../../src/theme';
import { Show } from '../../src/api/types';
import { isToday, parseISO } from 'date-fns';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);

  const snapPoints = useMemo(() => ['25%', '50%', '85%'], []);

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
    bottomSheetRef.current?.snapToIndex(1);
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

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetHandle}
        enablePanDownToClose={false}
      >
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
        <BottomSheetFlatList
          data={sortedShows}
          keyExtractor={(item) => item.id}
          renderItem={renderShowItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </BottomSheet>
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
  sheetBackground: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  sheetHandle: {
    backgroundColor: colors.textTertiary,
    width: 36,
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
