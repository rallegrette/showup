import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Coordinates } from '../api/types';

const SF_DEFAULT: Coordinates = {
  latitude: 37.7749,
  longitude: -122.4194,
};

export function useLocation() {
  const [location, setLocation] = useState<Coordinates>(SF_DEFAULT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (mounted) {
            setError('Location permission denied');
            setLoading(false);
          }
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (mounted) {
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        }
      } catch {
        // Fall back to SF default silently
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  return { location, loading, error };
}
