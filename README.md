# ShowUp

**Find shows. React to them. See who's going.**

ShowUp is a live music tracker built for people who actually go to shows. It maps venues near you, surfaces what's coming up, and lets you see what your friends are into -- no lengthy reviews, just quick reactions and a shared sense of "I'll be there."

Think Spotify meets Google Maps meets a group chat.

---

## Why This Exists

Every app that tracks live music is either a ticketing platform pretending to be social, or a social app that bolted on events as an afterthought. ShowUp starts from the experience of going out: you want to know what's happening, where, and whether anyone you know is going. That's it.

The design reflects that -- dark, warm, and built for nighttime. No harsh whites, no cluttered dashboards. Just the information you need to decide if you're showing up.

---

## What It Does

**Map View** -- Full-screen dark-styled map with animated venue pins. Tonight's shows pulse. Tap a pin and a bottom sheet surfaces that venue's lineup. Drag it up to browse everything nearby.

**Show Feed** -- Upcoming shows grouped by time (Tonight, Tomorrow, This Week) with genre filter chips. Each card shows the artist, venue, time, price, and which of your friends are going.

**Show Detail** -- Hero image, full lineup, door times, and a reaction bar. Tap fire, heart, guitar, mind-blown, dancing, or clap -- each one bounces with a spring animation and a haptic tap. Toggle Going or Interested and see the count update live.

**Friends Activity** -- A reverse-chronological feed of what your friends are doing. "Alex is going to Khruangbin at The Fillmore." Tap any item to jump to that show.

**Profile** -- Your show history, total reactions, friend count, and your most-used reaction emojis.

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React Native (Expo SDK 54) | Mobile-first, fast iteration with dev builds |
| Language | TypeScript (strict mode) | Zero `any`, typed API responses, discriminated unions |
| Routing | Expo Router | File-based navigation, same mental model as Next.js |
| State | Zustand | Lightweight, hooks-native, no boilerplate |
| Maps | react-native-maps | Custom dark styling, animated markers, user location |
| Animations | react-native-reanimated | Spring physics for reaction bounces, card presses, marker pulses |
| Gestures | @gorhom/bottom-sheet | Draggable map overlay with snap points |
| Haptics | expo-haptics | Tactile feedback on reactions, toggles, tab switches |
| Icons | lucide-react-native | Clean, consistent, tree-shakeable |
| Dates | date-fns | Lightweight formatting ("Tonight", "Tomorrow", relative timestamps) |

---

## Architecture

```
app/                          # Expo Router file-based screens
  _layout.tsx                 # Root: providers, status bar, data fetching
  (tabs)/
    _layout.tsx               # Custom dark tab bar with haptics
    index.tsx                 # Map view
    feed.tsx                  # Show feed with date grouping + genre filters
    activity.tsx              # Friends activity feed
    profile.tsx               # User profile + show history
  show/
    [id].tsx                  # Show detail (dynamic route)

src/
  api/
    types.ts                  # Show, Venue, Artist, Reaction, User, Activity
    client.ts                 # Async fetch wrapper with simulated latency
    shows.ts                  # getShows(), getShowById(), getActivities(), etc.

  components/
    ui/                       # Design system primitives
      Text.tsx                #   Themed text with 10 variant sizes
      Button.tsx              #   Pressable with spring scale + haptics
      Card.tsx                #   Dark card with press animation
      Badge.tsx               #   Status badges (going, interested, genre)
      Avatar.tsx              #   User avatar with online indicator
      IconButton.tsx          #   Circular icon action button
    show/
      ShowCard.tsx             #   Feed card with image, meta, friend avatars
      ReactionBar.tsx          #   Emoji reaction chips with spring bounce
      AttendanceButton.tsx     #   Going / Interested toggle
      LineupList.tsx           #   Artist lineup with genre badges
    map/
      VenueMarker.tsx          #   Animated map pin with pulse effect
    feed/
      ActivityItem.tsx         #   Friend activity row
      FeedSection.tsx          #   Date-grouped section wrapper
    profile/
      ProfileHeader.tsx        #   Avatar, stats, bio
      ShowHistoryCard.tsx      #   Past show card with user reactions

  store/
    useShowStore.ts            # Shows, reactions, attendance (Zustand)
    useUserStore.ts            # Current user, friends list
    useActivityStore.ts        # Friend activity feed

  theme/
    colors.ts                  # Dark warm palette (#0D0D0D, #FF6B35, #FF4D6D)
    typography.ts              # 10-variant type scale with font weights
    spacing.ts                 # 4-64px spacing + border radii

  hooks/
    useLocation.ts             # expo-location with permission handling + SF fallback
    useHaptics.ts              # Light, medium, heavy, success, selection

  data/
    venues.ts                  # 8 real Bay Area venues with coordinates
    shows.ts                   # 12 shows (8 upcoming, 4 past) with realistic data
    users.ts                   # 6 mock friends + current user profile
    activities.ts              # 12 activity items spanning the last 24 hours
```

---

## Design Decisions

**Reactions over reviews.** Nobody wants to write a paragraph after a show. You want to drop a fire emoji and move on. The reaction bar uses spring animations and haptic feedback to make each tap feel physical.

**Dark warm palette.** Live music happens at night. The UI uses near-black backgrounds (`#0D0D0D`) with warm orange (`#FF6B35`), coral (`#FF4D6D`), and gold (`#E8C547`) accents. Text is warm white (`#F5F0EB`), not blue-white.

**Map-first navigation.** The default tab is the map, not a list. Shows are spatial -- you pick venues based on where they are, not just what's playing.

**API layer abstraction.** The data layer is structured as async functions returning typed `ApiResponse<T>` objects with simulated network delay. Swapping mock data for a real Ticketmaster or Songkick integration means changing the implementation inside `api/shows.ts` -- nothing else touches the data source.

**Zustand over Redux.** Three small stores, each with a focused interface. No actions, reducers, or middleware. State updates are synchronous where possible, async for fetches.

---

## Getting Started

```bash
npm install
npx expo start
```

Scan the QR code with [Expo Go](https://expo.dev/go) on your phone, or press `i` for iOS Simulator / `a` for Android Emulator.

For network issues between devices, use tunnel mode:

```bash
npx expo start --tunnel
```

---

## What's Next

- Real API integration (Ticketmaster Discovery API)
- Search with autocomplete
- Push notifications for friend activity and show reminders
- Animated map clustering for dense venue areas
- Onboarding flow with genre/artist preferences
