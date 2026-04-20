# ShowUp

A live music and show tracker for the Bay Area. Find concerts near you, react to them, and follow what your friends are going to.

**Spotify meets Google Maps meets a group chat.**

## Tech Stack

- **React Native** (Expo SDK 54) with **TypeScript** (strict mode)
- **Expo Router** — file-based navigation
- **Zustand** — lightweight state management
- **react-native-maps** — venue map with custom markers
- **react-native-reanimated** — spring animations, gesture-driven interactions
- **@gorhom/bottom-sheet** — draggable map bottom sheet
- **expo-haptics** — tactile feedback on reactions and interactions

## Screens

| Screen | Description |
|--------|-------------|
| **Map** | Full-screen dark map with animated venue pins and draggable bottom sheet |
| **Shows** | Date-grouped feed with genre filters, pull-to-refresh |
| **Show Detail** | Hero image, lineup, reactions with spring animations, attendance toggle |
| **Friends** | Activity feed showing friend reactions and attendance |
| **Profile** | Show history, stats, top reactions |

## Architecture

```
app/                    # Expo Router screens
  (tabs)/               # Tab navigation
    index.tsx           # Map view
    feed.tsx            # Show feed
    activity.tsx        # Friends activity
    profile.tsx         # User profile
  show/[id].tsx         # Show detail

src/
  api/                  # Typed API layer (Ticketmaster-ready)
  components/
    ui/                 # Design system primitives
    show/               # Show-specific components
    map/                # Map components
    feed/               # Feed components
    profile/            # Profile components
  store/                # Zustand state management
  theme/                # Color tokens, typography, spacing
  hooks/                # Custom hooks (location, haptics)
  data/                 # Mock data (Bay Area venues)
```

## Getting Started

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `i` for iOS simulator / `a` for Android emulator.
