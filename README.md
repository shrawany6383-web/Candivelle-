# CANDIVELLE — 3D Cartoon Match-3 Puzzle Game

**CANDIVELLE** is a casual 3D cartoon Match-3 puzzle adventure in the royal candy kingdom alongside Princess Candivelle. Built with modern web and mobile standards (HTML5, Tailwind CSS, TypeScript, React 19, Three.js, and Web Audio API), it is designed Android-first for mobile phones and cross-platform web browsers with offline PWA support.

---

## 🎮 Core Game Features

1. **3D Cartoon Visual Experience**:
   - Original Princess Candivelle mascot artwork and royal kingdom branding.
   - Procedural Three.js 3D candy showcase featuring custom glossy PBR materials, rim lighting, `RoomEnvironment` reflections, and pointer tracking.
   - Colorful 3D cartoon candies: Red Hearts, Yellow Stars, Green Gummy Bears, Blue Gems, Orange Jelly Beans, and Purple Bonbons.

2. **Full Match-3 Puzzle Engine**:
   - Interactive 8×8 grid with touch-and-drag swipe controls and tap-to-swap support.
   - Horizontal & vertical line match detection.
   - Special candies:
     - **Horizontal / Vertical Striped Rockets** (4-match).
     - **Wrapped Candy Bombs** (L/T intersections, 3×3 explosions).
     - **Rainbow Color Swirls** (5-in-a-row).
   - Special combos: Double Rockets, Rocket + Bomb (3-row/3-col cross blast), Rainbow + Color wipe, Double Rainbow (full board wipe).
   - Cascading gravity, refills, combo callouts (*"Sweet!"*, *"Tasty!"*, *"Delicious!"*, *"Sugar Crush!"*).
   - Deadlock auto-shuffle ensuring puzzles never get permanently stuck.

3. **100 Playable Data-Driven Levels**:
   - 100 balanced, fully configured levels across 4 distinct chapters:
     - **Chapter 1: Sugar Meadow** (Levels 1–25)
     - **Chapter 2: Bubblegum Falls** (Levels 26–50)
     - **Chapter 3: Choco Castle** (Levels 51–75)
     - **Chapter 4: Lollipop Peaks** (Levels 76–100)
   - Varied objectives: Target Scores, Candy Type Collections, Jelly Clearing, and Mixed Challenges.
   - 3-Star scoring milestones on every level.

4. **Winding Candy Kingdom Map**:
   - Vertical fantasy road with 100 numbered nodes, star indicators, locked/unlocked progression states, chapter banners, and animated player position avatar pin.

5. **In-Game Economy & Boosters**:
   - Virtual currencies: Coins (1,250 starting balance) and Diamonds (50 starting balance).
   - Regenerating Lives system (5/5 full with 15-minute countdown recovery and instant refill option).
   - Magic Boosters:
     - 🔨 **Magic Hammer**: Instantly breaks any single candy or jelly.
     - 🔄 **Candy Shuffle**: Reshuffles board candies immediately.
     - 🚀 **Rocket Blast**: Clears an entire row and column.
     - 🌈 **Color Swirl**: Clears all candies of the most common color.

6. **Daily Rewards & Events**:
   - 7-Day login calendar with local date check to prevent duplicate claims within the same calendar day.
   - Day 7 Royal Grand Chest with bonus diamonds and booster packs.
   - Limited-time tournaments: Candy Rush Tournament, Weekend Star Hunt, and Princess's Sweet Quest.

7. **Multilingual Localization (i18n)**:
   - 9 complete languages supported out of the box:
     1. English (USA) — `en-US`
     2. Hindi (India) — `hi-IN` (Authentic Devanagari script)
     3. Spanish — `es-ES`
     4. French — `fr-FR`
     5. German — `de-DE`
     6. Japanese — `ja-JP`
     7. Korean — `ko-KR`
     8. Arabic — `ar-SA` (with bidirectional RTL layout)
     9. Portuguese — `pt-BR`
   - Zero hardcoded UI strings; instant reactive language switching across all screens.

8. **Zero-Dependency Procedural Audio**:
   - 100% procedural Web Audio API synthesizer.
   - Cheerful home screen melody and upbeat gameplay puzzle BGM.
   - Dynamic scale pitch match chimes, rocket swooshes, bomb explosions, hammer strikes, coin clinks, and victory fanfare.
   - Independent volume sliders and mute toggles.

9. **Player Profile & Legal Pages**:
   - Editable nickname, avatar selector, star tally, and achievement unlock claims.
   - Complete Privacy Policy, Terms & Conditions, and Help & Support guides.

---

## 🛠️ Project Structure

```text
/
├── public/
│   ├── assets/aistudio/       # Mascot and branding graphics
│   ├── manifest.json          # PWA Web App Manifest
│   └── sw.js                  # Service Worker for offline play
├── src/
│   ├── audio/
│   │   └── soundManager.ts    # Procedural Web Audio synthesizer engine
│   ├── components/
│   │   ├── BottomNav.tsx      # Main navigation dock
│   │   ├── CandyPiece.tsx     # 3D cartoon candy renderer (SVG/gradients)
│   │   ├── HeaderBar.tsx      # Top status bar (lives, coins, diamonds, settings)
│   │   └── ThreeCandyHero.tsx # Three.js procedural 3D cartoon showcase
│   ├── game/
│   │   ├── CandyEngine.ts     # Core match-3 simulation and logic
│   │   ├── levels.ts          # 100 data-driven playable level definitions
│   │   └── types.ts           # Type definitions for candies, objectives, boosters
│   ├── i18n/
│   │   ├── locales.ts         # Multi-language translation dictionaries
│   │   └── types.ts           # i18n interfaces and language registry
│   ├── screens/
│   │   ├── AndroidPackScreen.tsx # Android APK/AAB packaging guide
│   │   ├── DailyRewardsScreen.tsx# 7-day reward calendar
│   │   ├── EventsScreen.tsx   # Tournaments and challenges
│   │   ├── GameScreen.tsx     # Main match-3 gameplay view
│   │   ├── HomeScreen.tsx     # Royal home screen & mascot
│   │   ├── LanguageModal.tsx  # Multi-language selector modal
│   │   ├── LegalScreen.tsx    # Privacy Policy, Terms, and Support
│   │   ├── MapScreen.tsx      # 100-level winding fantasy map
│   │   ├── ProfileScreen.tsx  # Player stats, avatars, and trophies
│   │   ├── SettingsScreen.tsx # Sound, haptics, language, and reset
│   │   ├── ShopScreen.tsx     # Currency and booster purchases
│   │   └── SplashScreen.tsx   # Animated loading splash screen
│   ├── services/
│   │   └── storage.ts         # LocalStorage & IndexedDB persistent save
│   ├── App.tsx                # Master state controller and screen router
│   ├── index.css              # Tailwind CSS imports and touch optimizations
│   └── main.tsx               # App entry point and SW registration
├── test/
│   └── game.test.ts           # Automated test suite (14 tests)
├── capacitor.config.json      # Capacitor Android wrapper configuration
├── index.html                 # Mobile-first HTML5 shell
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Building & Running Locally

### Development Server
```bash
npm run dev
```
Runs the Vite development server on `http://localhost:3000`.

### Type-Checking & Linting
```bash
npm run lint
```
Runs TypeScript validation (`tsc --noEmit`) to verify zero type errors.

### Running Automated Tests
```bash
npm test
```
Executes the comprehensive automated test suite verifying level configs, match-3 logic, and localization integrity.

### Production Build
```bash
npm run build
```
Creates the optimized production bundle in the `dist/` directory.

---

## 📱 Android Packaging (APK & Google Play AAB)

CANDIVELLE is configured with **Capacitor** for native Android compilation.

### Step 1: Install Capacitor CLI & Android Platform
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init CANDIVELLE com.candivelle.match3 --web-dir dist
npx cap add android
```

### Step 2: Build Web Assets and Sync
```bash
npm run build
npx cap sync android
```

### Step 3: Open in Android Studio
```bash
npx cap open android
```

### Step 4: Generate Release Keystore
```bash
keytool -genkey -v -keystore candivelle-release.keystore -alias candivelle -keyalg RSA -keysize 2048 -validity 10000
```

### Step 5: Build Signed Android App Bundle (AAB)
In Android Studio:
1. Navigate to **Build > Generate Signed Bundle / APK...**
2. Choose **Android App Bundle** (for Google Play Store) or **APK** (for direct testing/Amazon Appstore).
3. Select your `candivelle-release.keystore`, enter passwords, and choose `release` build variant.
4. The signed AAB will be output to `android/app/release/app-release.aab`.

---

## 🌐 Web Deployment (Vercel, Netlify, Cloud Run)

The build artifacts in `dist/` are static files ready for deployment on any static hosting platform:

1. **Build command**: `npm run build`
2. **Publish directory**: `dist`
3. **Single Page Application Routing**: All route requests fall back to `/index.html`.
