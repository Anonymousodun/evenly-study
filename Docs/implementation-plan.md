# Evenly Study — Implementation Plan

**Version:** 1.0 | **Date:** September 28, 2026 | **For:** Solo Developer

---

## Phase 0: Foundation & Setup

### 0.1 Technology Decisions

| Area | Choice | Reason |
|---|---|---|
| Platform | React Native with Expo | Single codebase for iOS + Android, fast iteration |
| Language | JavaScript/TypeScript | Largest ecosystem, best community support |
| Navigation | React Navigation (Stack + Bottom Tab) | Industry standard, smooth transitions |
| State Management | React Context + useReducer | Lightweight, no extra dependencies needed for V1 |
| Database | PostgreSQL (local) | Full SQL power, runs on device, no cloud costs |
| Auth | Better Auth | Modern, flexible auth library for React Native |
| File Storage | Cloudflare R2 | S3-compatible, free tier, no egress fees |
| Styling | StyleSheet + custom theme system | Built-in performance, full control |
| UI Framework | Custom (no library) | Every component is designed per the calm aesthetic |
| Icons | @expo/vector-icons (Lucide/Feather) | Clean, minimal icons |
| Animations | React Native Reanimated | Smooth micro-interactions |
| Date/Time | date-fns | Lightweight, tree-shakeable |
| Notifications | Expo Notifications | Built-in, handles local push notifications |

### 0.2 Project Structure

```
evenly-study/
├── App.tsx                    # Entry point, navigation container
├── package.json
├── tsconfig.json
├── app.json
├── babel.config.js
├── assets/
│   ├── fonts/                 # Custom font files
│   ├── images/                # App icons, splash images
│   └── sounds/                # Gentle notification sounds
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── common/            # Button, Card, Text, Input, Modal
│   │   ├── burnout/           # Indicator, TrendChart
│   │   ├── tasks/             # TaskCard, TaskForm
│   │   ├── breaks/            # BreakMenu, BreakTimer
│   │   ├── sleep/             # SleepCheckIn, SleepScore
│   │   └── support/           # SupportList, CheckInPrompt
│   ├── screens/               # Full-page views
│   │   ├── HomeScreen.tsx     # Main indicator screen
│   │   ├── SetupScreen.tsx    # Quick setup flow
│   │   ├── TasksScreen.tsx    # Task list + add
│   │   ├── CheckInScreen.tsx  # Daily + sleep check-in
│   │   ├── BreaksScreen.tsx   # Break menu + timer
│   │   ├── SleepScreen.tsx    # Sleep history/settings
│   │   ├── SettingsScreen.tsx # All user preferences
│   │   └── SupportScreen.tsx  # "Need to talk?" page
│   ├── hooks/                 # Custom React hooks
│   │   ├── useBurnoutCalc.ts
│   │   ├── useTasks.ts
│   │   ├── useSleep.ts
│   │   ├── useCheckIns.ts
│   │   ├── useBreaks.ts
│   │   └── useNotifications.ts
│   ├── context/               # State management
│   │   ├── AppContext.tsx
│   │   ├── AppReducer.ts
│   │   └── themes.ts          # Light/dark theme definitions
│   ├── db/                    # Database layer
│   │   ├── schema.sql         # PostgreSQL table definitions
│   │   ├── connection.ts      # DB connection pool
│   │   ├── migrations/        # Schema migration files
│   │   │   ├── 001_initial.sql
│   │   │   └── 002_add_auth.sql
│   │   └── repositories/      # Data access layer
│   │       ├── tasks.repo.ts
│   │       ├── sleep.repo.ts
│   │       ├── checkins.repo.ts
│   │       └── user.repo.ts
│   ├── auth/                  # Authentication (Better Auth)
│   │   ├── auth.ts            # Better Auth config
│   │   ├── AuthContext.tsx    # Auth state provider
│   │   └── AuthScreen.tsx     # Login/signup screen
│   ├── storage/               # File storage (Cloudflare R2)
│   │   ├── r2.ts              # R2 client config
│   │   └── upload.ts          # Upload/download helpers
│   ├── utils/                 # Helper functions
│   │   ├── burnoutAlgorithm.ts
│   │   ├── db.ts              # DB query helpers
│   │   ├── recommendations.ts # Break/sleep/task suggestions
│   │   └── scienceNotes.ts    # "Why this works" text data
│   ├── data/                  # Static data
│   │   ├── supportResources.json  # Helplines by region
│   │   ├── scienceNotes.json      # Break science explanations
│   │   └── templates.json       # Task templates (Exam, Essay, etc.)
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts
│   └── navigation/            # Navigation config
│       ├── AppNavigator.tsx
│       └── TabNavigator.tsx
├── __tests__/                 # Unit tests
│   ├── burnoutAlgorithm.test.ts
│   ├── useTasks.test.ts
│   └── utils.test.ts
├── scripts/                   # Build/deploy scripts
│   ├── generate-icons.js
│   └── db-migrate.js          # Run DB migrations
└── Docs/                      # Documentation
    ├── evenly-study-prd.md
    └── implementation-plan.md
```

### 0.3 Initialize Project

```bash
# Create project
npx create-expo-app evenly-study --template blank-typescript
cd evenly-study

# Install dependencies
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npx expo install @expo/vector-icons
npx expo install expo-notifications
npx expo install date-fns
npx expo install react-native-reanimated
npx expo install react-native-gesture-handler

# Database (PostgreSQL local)
npm install pg
npm install knex  # Query builder + migrations

# Auth (Better Auth)
npm install better-auth

# Storage (Cloudflare R2)
npm install @aws-sdk/client-s3  # R2 is S3-compatible

# Setup scripts
npx expo prebuild --clean  # Generate native project files
```

---

## Phase 1: Design System

### 1.1 Color Palette

**Core brand colors (muted, calm):**

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `color-primary` | #6B8F71 (muted sage green) | #8FB892 | Main accent, positive actions |
| `color-warning` | #C9A227 (muted gold) | #D4B744 | Yellow indicator, pending items |
| `color-danger` | #B87333 (muted terracotta) | #D48A5C | Red indicator, warnings |
| `color-bg` | #F7F5F0 (warm off-white) | #1A1A1A | Screen background |
| `color-surface` | #FFFFFF (soft white) | #2A2A2A | Cards, modals |
| `color-text` | #2D2D2D (dark charcoal) | #F0F0F0 | Body text |
| `color-text-secondary` | #6B6B6B (warm gray) | #9A9A9A | Labels, subtitles |
| `color-border` | #E0DDD8 (light warm gray) | #3A3A3A | Dividers, borders |
| `color-indicator-green` | #7BAF7B (calm green) | #6DBF6D | Green burnout level |
| `color-indicator-yellow` | #C4A842 (calm yellow) | #C4A842 | Yellow burnout level |
| `color-indicator-red` | #C47B4A (calm red) | #C47B4A | Red burnout level |

**Rules:**
- No pure black (#000000) or pure white (#FFFFFF)
- All colors are desaturated/muted — nothing feels alarming
- Red means "ease off" not "you're failing"

### 1.2 Typography Scale

| Token | Font Size | Weight | Usage |
|---|---|---|---|
| `text-display` | 32px | Bold (700) | Welcome text, big headings |
| `text-h1` | 24px | Semi-bold (600) | Section headings |
| `text-h2` | 20px | Semi-bold (600) | Sub-section headings |
| `text-body` | 16px | Regular (400) | Body paragraphs |
| `text-body-small` | 14px | Regular (400) | Secondary info, captions |
| `text-label` | 14px | Medium (500) | Labels, buttons |
| `text-caption` | 12px | Regular (400) | Footnotes, hints |
| `text-indicator` | 48px | Light (300) | Burnout indicator number/label |

**Font family:** System font (SF Pro on iOS, Roboto on Android) — clean and native. Optionally add "Nunito" from Google Fonts for warmth.

### 1.3 Spacing System (4px grid)

| Token | Value | Usage |
|---|---|---|
| `space-xs` | 4px | Tight inner spacing |
| `space-sm` | 8px | Small gaps |
| `space-md` | 16px | Standard padding |
| `space-lg` | 24px | Section spacing |
| `space-xl` | 32px | Large section gaps |
| `space-2xl` | 48px | Major dividers |
| `space-3xl` | 64px | Screen-level padding |

### 1.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 8px | Small buttons, badges |
| `radius-md` | 12px | Cards, inputs |
| `radius-lg` | 20px | Bottom sheets, modals |
| `radius-full` | 9999px | Pills, circles, avatars |

### 1.5 Component Library

Build these in order (each must be reusable across screens):

1. **`Button`** — Rounded, full-width option. Variants: Primary, Secondary, Text-only. Disabled state.
2. **`Card`** — Surface-colored container with subtle shadow. Rounded corners.
3. **`Text`** — Wrapper that applies theme-aware colors and size tokens.
4. **`Input`** — Text input for task titles, etc. Calm border, rounded.
5. **`IndicatorBadge`** — Shows Green/Yellow/Red with label. Animated transition between states.
6. **`SuggestionBox`** — A single suggestion card with "Why?" toggle and approve/dismiss buttons.
7. **`BreakOption`** — A selectable break option card with icon, title, and estimated duration.
8. **`CheckInSlider`** — 1-5 tap selector (not a slider, but 5 tappable circles/buttons).
9. **`EmptyState`** — Friendly illustration/message when no tasks/check-ins exist yet.
10. **`SupportCard`** — Contact option (counselor, friend, helpline) with region-appropriate info.
11. **`Toast`** — Non-blocking gentle notification (e.g., "Break logged!").
12. **`Modal`** — Full-screen or bottom-sheet modal for settings, suggestions, support.

### 1.6 Light/Dark Mode

- Detect system preference using `useColorScheme()` from React Native
- Allow manual toggle in Settings
- Persist preference to AsyncStorage
- All components read from theme tokens, never hardcode colors

### 1.7 Animation Principles

- **Transitions:** Smooth, slow (300ms), ease-out
- **Micro-interactions:** Subtle scale (0.97) on press, gentle fade-in for new content
- **Indicator changes:** Color transitions (not instant snap) between green/yellow/red
- **No bouncing, no flinging, no aggressive animations**

---

## Phase 2: Architecture & State Management

### 2.1 State Architecture

**Pattern:** React Context + useReducer (centralized store)

```
AppContext
  ├── state.tasks[]           → [{id, title, type, dueDate, effort, createdAt}]
  ├── state.sleep[]           → [{date, bedtime, wakeTime, restScore}]
  ├── state.dailyCheckIns[]   → [{date, moodScore}]
  ├── state.burnoutLevel      → 'green' | 'yellow' | 'red'
  ├── state.suggestions[]     → [{id, text, type, approved}]
  ├── state.settings          → {targetBedtime, studyHours, breakLength, ...}
  ├── state.skippedBreaks     → [{date, count}]
  └── dispatch(action)        → Updates state based on action type
```

**Actions:**
```typescript
type Action =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'ADD_SLEEP_CHECKIN'; payload: SleepEntry }
  | { type: 'ADD_DAILY_CHECKIN'; payload: DailyCheckIn }
  | { type: 'SET_BURNOUT_LEVEL'; payload: BurnoutLevel }
  | { type: 'ADD_SUGGESTION'; payload: Suggestion }
  | { type: 'APPROVE_SUGGESTION'; payload: string }
  | { type: 'DISMISS_SUGGESTION'; payload: string }
  | { type: 'LOG_SKIPPED_BREAK'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'LOAD_DATA'; payload: SavedState }
  | { type: 'RESET_DATA' };
```

### 2.2 Data Persistence

**Database:** PostgreSQL running locally on the device. **No Supabase, no Firebase, no paid cloud database.**

```sql
-- schema.sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  target_bedtime TIME,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  type VARCHAR(50) NOT NULL,  -- exam, essay, reading, group-project, custom
  effort VARCHAR(20) NOT NULL, -- light, medium, heavy
  due_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sleep_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  bedtime TIME NOT NULL,
  wake_time TIME NOT NULL,
  rest_score INTEGER NOT NULL CHECK (rest_score BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood_score INTEGER NOT NULL CHECK (mood_score BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE skipped_breaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  break_length VARCHAR(20),  -- short, long
  completed BOOLEAN DEFAULT FALSE,
  skipped BOOLEAN DEFAULT FALSE
);
```

**Connection (db/connection.ts):**
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'evenly_study',
  user: 'evenly_user',
  password: process.env.DB_PASSWORD,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
```

**Migrations:** Use Knex.js for schema migrations.
```bash
npx knex migrate:latest
```

### 2.3 Authentication (Better Auth)

**Library:** Better Auth — modern, flexible authentication for React Native.

```typescript
// auth/auth.ts
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
  },
});
```

**Auth Flow:**
- Sign up with email + password
- Login with email + password
- Session persists for 30 days
- Password reset via email
- All auth data stored in local PostgreSQL

### 2.4 File Storage (Cloudflare R2)

**Service:** Cloudflare R2 — S3-compatible object storage with free tier.

```typescript
// storage/r2.ts
import { S3Client } from '@aws-sdk/client-s3';

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Use case: Store user-uploaded files (e.g., timetable photos for V2)
// V1 may not need this much, but infrastructure is ready
```

**When to use R2:**
- V2: Upload timetable images for schedule comparison
- V2: Export weekly reports as PDF
- Any future file storage needs

### 2.3 Burnout Algorithm

```typescript
// burnoutAlgorithm.ts
function calculateBurnoutLevel(state: AppState): BurnoutLevel {
  // Inputs:
  // - Recent task effort (sum of heavy tasks due this week)
  // - Sleep quality trend (last 3-7 nights)
  // - Mood trend (last 3-7 days)
  // - Skipped breaks pattern (last 5 days)
  
  let score = 0;
  
  // Task load: heavy tasks due soon → +score
  // Sleep deficit: short sleep nights → +score
  // Low mood: consecutive low scores → +score
  // Skipped breaks: pattern → +score
  
  if (score < 3) return 'green';
  if (score < 6) return 'yellow';
  return 'red';
}

// Recalculate on: task change, check-in, sleep check-in, skipped break log
```

**Specific logic (to be refined with expert review):**
- Each heavy task due within 3 days: +1 point
- Each night with <6 hours sleep: +1 point
- Each day with mood score ≤2: +1 point
- 3+ skipped breaks in 5 days: +2 points
- Green threshold: score < 3
- Yellow threshold: score 3-5
- Red threshold: score ≥ 6

### 2.4 Burnout Indicator Suggestions (per level)

| Level | Suggestion |
|---|---|
| Green | "You're in a healthy zone — keep it up!" |
| Yellow | "Load is building — consider moving one task to tomorrow" |
| Red | "High risk — time to ease off. Want to see how to lighten your load?" |

### 2.5 Notification System

```typescript
// useNotifications.ts
// - Schedule daily wind-down reminder (1 hour before target bedtime)
// - Schedule break reminders (based on focus session timer)
// - Schedule gentle nudge after skipped break (15-20 min delay)
// - Schedule morning check-in prompt (at user's preferred wake time)
```

**Using Expo Notifications:**
- Request permissions on first run
- Schedule local notifications with `expo-notifications`
- Handle notification taps to navigate to relevant screen
- Notifications are silent (no harsh alarm sounds)

### 2.6 Navigation Structure

**Bottom Tab Navigator (4 tabs):**

| Tab | Icon | Screen |
|---|---|---|
| Home | ☰ (or leaf icon) | HomeScreen — Burnout indicator + suggestion |
| Tasks | 📋 | TasksScreen — Task list + add |
| CheckIn | 💤 | CheckInScreen — Daily mood + sleep |
| Settings | ⚙️ | SettingsScreen — All preferences |

**Stack Navigator (nested):**
- HomeStack → TaskDetail, WeeklyTrend
- TasksStack → TaskForm, TaskTemplates
- CheckInStack → DailyCheckIn, SleepHistory, SleepSettings
- SettingsStack → GeneralSettings, BreakSettings, SleepSettings, SupportSettings

---

## Phase 3: Feature Implementation — Setup & Tasks

### 3.1 Quick Setup (under 2 minutes)

**Screens:**
1. `SetupWelcomeScreen` — Warm greeting, "Let's get started in under 2 minutes"
2. `SetupBedtimeScreen` — Time picker for target bedtime
3. `SetupHoursScreen` — Select study/work available windows (time range picker)
4. `SetupTasksScreen` — Quick-add 1-3 tasks from templates or manual entry
5. `SetupCompleteScreen` — First burnout indicator + one suggestion

**Flow logic:**
- Skip any step — nothing mandatory beyond basics
- After step 4, calculate initial burnout level
- Show `SetupCompleteScreen` with indicator badge + one suggestion
- On completion, navigate to HomeScreen as default

**Data structure for setup:**
```typescript
interface UserSetup {
  targetBedtime: string;    // "23:00"
  studyWindows: { start: string; end: string }[];  // [{start: "09:00", end: "12:00"}, ...]
  tasks: Task[];            // [{title, type, effort, dueDate}]
  completedAt: Date;
}
```

### 3.2 Manual Task Entry

**Components:**
- `TaskCard` — Shows title, type icon, effort level badge, due date
- `TaskForm` — Input fields for title, due date, effort level, type
- `TaskTemplatePicker` — Quick-select templates: Exam, Essay, Reading, Group Project

**Task model:**
```typescript
interface Task {
  id: string;                // uuid
  title: string;
  type: 'exam' | 'essay' | 'reading' | 'group-project' | 'custom';
  effort: 'light' | 'medium' | 'heavy';
  dueDate: string;           // ISO date string
  createdAt: string;
  completed: boolean;
}
```

**Features:**
- Quick-add template (select type + auto-generate title)
- Manual entry (type title, pick date, pick effort)
- Swipe to delete
- Tap to mark complete
- Effort level shown as colored dot (green=light, yellow=medium, terracotta=heavy)

**Adding a task should take ≤3 seconds:**
- Template select: 2 taps (type → add)
- Manual entry: 3-4 taps (title → date → effort → add)

### 3.3 Task Templates

```json
// data/templates.json
[
  { type: "exam", label: "Exam", icon: "school", defaultEffort: "heavy" },
  { type: "essay", label: "Essay", icon: "document-text", defaultEffort: "heavy" },
  { type: "reading", label: "Reading", icon: "book-open", defaultEffort: "medium" },
  { type: "group-project", label: "Group Project", icon: "people", defaultEffort: "medium" }
]
```

---

## Phase 4: Feature Implementation — Check-ins & Burnout Indicator

### 4.1 Daily Check-In (5 seconds)

**Screen:** `DailyCheckInScreen`

**UI:** 5 tappable circles numbered 1-5 with face icons (😊 to 😞)
- Tap = instant save, no confirmation needed
- "How are you feeling?" prompt above
- Auto-advance to HomeScreen after tap

**Data model:**
```typescript
interface DailyCheckIn {
  date: string;      // YYYY-MM-DD
  moodScore: number; // 1-5
  timestamp: string;
}
```

### 4.2 Morning Sleep Check-In (~10 seconds)

**Screen:** `SleepCheckInScreen`

**Fields:**
- Bedtime picker (default: from settings)
- Wake time picker
- "How rested do you feel?" 1-5 tap selector

**UI:** Similar to daily check-in — 5 tappable circles
- Pre-fill with previous values for speed
- Auto-save on each field change (no "Save" button needed)

**Data model:**
```typescript
interface SleepEntry {
  date: string;
  bedtime: string;     // "23:00"
  wakeTime: string;    // "07:00"
  restScore: number;   // 1-5
}
```

### 4.3 Burnout Indicator — Main Screen

**Screen:** `HomeScreen`

**Layout:**
```
┌─────────────────────────────┐
│                             │
│      🟢 "You're in a       │
│      healthy zone"          │
│                             │
│   [Weekly Trend Chart]      │
│   (one tap to expand)       │
│                             │
│   "Consider moving one      │
│    task to tomorrow"        │
│                             │
│   [Why?]                    │
│                             │
└─────────────────────────────┘
```

**Components:**
- `IndicatorBadge` — Large colored circle with label and icon
- `WeeklyTrendMiniChart` — Small 7-dot trend line (one tap to expand)
- `SuggestionCard` — One specific suggestion with optional "Why?" toggle
- Gentle color animation when level changes

**Weekly Trend:**
- 7 dots, one per day
- Color-coded (green/yellow/red)
- Tap to expand into `WeeklyTrendScreen`
- Line chart showing progression (simple SVG or canvas)

### 4.4 Burnout Calculation Logic (Detailed)

```typescript
function calculateBurnoutScore(state: AppState): number {
  const now = new Date();
  const recentDays = 7; // last 7 days
  
  let score = 0;
  
  // 1. Task Load (max 3 points)
  const upcomingTasks = state.tasks.filter(t => 
    !t.completed && 
    isWithinDays(t.dueDate, 3)
  );
  const heavyTasks = upcomingTasks.filter(t => t.effort === 'heavy').length;
  score += Math.min(heavyTasks, 3); // Cap at 3
  
  // 2. Sleep Quality (max 3 points)
  const recentSleep = state.sleep
    .filter(s => isWithinDays(s.date, recentDays))
    .sort((a, b) => compareDates(b.date, a.date))
    .slice(0, 3); // Last 3 nights
  const poorSleep = recentSleep.filter(s => {
    const hours = calculateSleepHours(s.bedtime, s.wakeTime);
    return hours < 6;
  }).length;
  score += poorSleep; // Each night <6hrs = +1
  
  // 3. Mood Trend (max 3 points)
  const recentMoods = state.dailyCheckIns
    .filter(c => isWithinDays(c.date, recentDays))
    .slice(-3); // Last 3 days
  const lowMood = recentMoods.filter(c => c.moodScore <= 2).length;
  score += lowMood; // Each day ≤2 = +1
  
  // 4. Skipped Breaks (max 2 points)
  const recentSkips = state.skippedBreaks
    .filter(s => isWithinDays(s.date, recentDays));
  if (recentSkips.length >= 3) score += 2;
  else if (recentSkips.length >= 2) score += 1;
  
  return score;
}

function getBurnoutLevel(score: number): BurnoutLevel {
  if (score < 3) return 'green';
  if (score < 6) return 'yellow';
  return 'red';
}
```

---

## Phase 5: Feature Implementation — Breaks

### 5.1 Break Menu

**Screen:** `BreaksScreen`

**Default Pomodoro Rhythm:**
- Focus session: 25 minutes
- Short break: 5 minutes
- Long break: 15 minutes (after every 4 sessions)

**Break Options (matched to break length):**

| Break Length | Options |
|---|---|
| Micro (1-5 min) | Eyes-off-screen reset, Breathing exercise |
| Short (5-10 min) | Stretch sequence, Quick walk |
| Long (15+ min) | Proper meal, Longer walk, Real rest |

**Dynamic Adjustment:**
- As burnout level rises (yellow → red), break frequency increases slightly
- Settings allow user to customize session/break lengths within boundaries
- App never overrides user settings

**Timer Implementation:**
- Visual countdown timer
- Gentle vibration/soft sound at end
- Auto-pause if app goes to background
- "Skip break" logs it (triggers skipped-break logic)

**BreakMenu Component:**
- Shows 3-4 cards based on selected break length
- Each card: icon + title + duration + "Why this works?" toggle
- Tap to select → starts timer

### 5.2 Skipped Breaks Logic

```typescript
// useBreaks.ts
function handleBreakSkipped(state: AppState) {
  // First skip: log silently
  // Second skip within 24hrs: schedule gentle reminder in 15-20 min
  // Pattern detected (3+ skips in 5 days): show warm check-in prompt
  // Never re-nag immediately
}

// Gentle reminder notification
// "Want to take a quick breather now?"
// Warm check-in: "You've skipped breaks for a few days. How are you actually doing?"
```

### 5.3 Focus Session Timer

```typescript
interface FocusSession {
  id: string;
  startTime: string;
  endTime: string;
  breakLength: 'short' | 'long';
  completed: boolean;
  skipped: boolean;
}
```

- Start/stop from HomeScreen quick action
- Background timer using `expo-background-task` or similar
- Notification at session end

---

## Phase 6: Feature Implementation — Sleep Protection

### 6.1 Sleep Settings

**Screen:** `SleepSettingsScreen` (within Settings)

- Target bedtime picker (default: from setup)
- Cutoff time (auto-calculated: bedtime minus 1 hour)
- Wind-down reminder toggle (default: 30 min before bedtime)
- "Would you like a wind-down reminder?" onboarding prompt

### 6.2 Cutoff Time Logic

```typescript
function checkSleepProtection(state: AppState): { 
  exceeded: boolean; 
  message: string;
  suggestedAction: string;
} {
  const now = new Date();
  const cutoff = calculateCutoffTime(state.settings.targetBedtime);
  
  if (now > cutoff && hasActiveTasks(state)) {
    return {
      exceeded: true,
      message: "It's getting late for work. Let's protect your sleep.",
      suggestedAction: "Move a task to tomorrow?"
    };
  }
  return { exceeded: false, message: "", suggestedAction: "" };
}
```

### 6.3 Wind-Down Reminder

- Local notification at `bedtime - 30 minutes`
- Message: "Time to wind down 🌙 Your body deserves rest"
- Links to HomeScreen with gentle color

### 6.4 Sleep Impact on Burnout Indicator

- Multiple short nights in a row → indicator moves toward yellow/red faster
- Sleep quality is weighted heavily in the burnout algorithm (see Phase 4)

---

## Phase 7: Feature Implementation — Load-Lightening Suggestions

### 7.1 Suggestion Engine

```typescript
// recommendations.ts
function generateSuggestions(state: AppState): Suggestion[] {
  const suggestions: Suggestion[] = [];
  
  // During heavy stretches (red days, or consecutive yellow days)
  const heavyTasks = state.tasks.filter(t => 
    !t.completed && t.effort === 'heavy' && isDueSoon(t.dueDate)
  );
  
  heavyTasks.forEach(task => {
    suggestions.push({
      id: uuid(),
      type: 'move-task',
      taskId: task.id,
      text: `Move "${task.title}" to tomorrow?`,
      detail: `Due ${formatDate(task.dueDate)}`,
      approved: false,
      dismissed: false,
    });
    
    // For group projects or heavy essays
    if (task.type === 'essay' || task.type === 'group-project') {
      suggestions.push({
        id: uuid(),
        type: 'split-task',
        taskId: task.id,
        text: `Break "${task.title}" into smaller sessions?`,
        detail: 'Work 15 min at a time instead of one long session',
        approved: false,
        dismissed: false,
      });
    }
  });
  
  return suggestions;
}
```

### 7.2 Suggestion Display

- Appears on HomeScreen when level is yellow or red
- One suggestion at a time (not overwhelming)
- Each has: Approve ✅ / Ignore ❌ buttons
- "Why this works?" optional toggle
- After dismissed, next suggestion appears

### 7.3 Suggestion Model

```typescript
interface Suggestion {
  id: string;
  type: 'move-task' | 'split-task' | 'break-now' | 'sleep-early';
  taskId?: string;
  text: string;
  detail: string;
  approved: boolean | null; // null = pending, true = approved, false = dismissed
  timestamp: string;
}
```

### 7.4 Approval Logic

- When user approves → move due date forward by 1 day, recalculate burnout
- When user dismisses → mark as dismissed, store in state history
- Nothing changes automatically without user action

---

## Phase 8: Feature Implementation — Support & Safety

### 8.1 "Need to Talk to Someone?"

**Screen:** `SupportScreen` (always accessible from bottom tab or HomeScreen)

**Always-visible button** on HomeScreen and CheckInScreen:
- 🆘 "Need to talk to someone?"
- Tapping opens support options

**Support Options (region-based):**
```typescript
interface SupportResource {
  id: string;
  type: 'campus-counselor' | 'friend-family' | 'helpline';
  label: string;
  contact: string;
  region: string; // country/region code
  icon: string;
}
```

**Data file:** `data/supportResources.json`
- Contains resources for multiple regions
- User selects their region during setup or in settings
- If not available for their region, show generic helpline numbers

**Auto-trigger (after serious sustained pattern):**
- If 3+ consecutive days of red indicator or mood ≤2
- Show prompt: "We've noticed you've been feeling drained. Would you like to see people who can help?"
- Warm, low-pressure wording
- "Later" and "Show me" options

### 8.2 Safety Disclaimer

- Every support screen shows: "Evenly Study is a wellbeing tool, not a therapist. We don't diagnose, treat, or replace professional care."
- Wording reviewed by expert before launch

---

## Phase 9: Feature Implementation — Positive Reinforcement

### 9.1 Gentle Messages

**Triggers:**
- Took every break today → "You took every break today. Well done!"
- Hit bedtime on time → "Nice job easing off tonight. Rest is part of the work."
- Balanced week (green most days) → "You had a balanced week. Your future self thanks you."
- Completed a task → "Good work finishing that. Every step counts."

**Implementation:**
```typescript
// recommendations.ts or useReinforcement.ts
const reinforcementMessages = {
  allBreaksTaken: "You took every break today. Well done!",
  hitBedtime: "Nice job easing off tonight. Rest is part of the work.",
  balancedWeek: "You had a balanced week. Your future self thanks you.",
  completedTask: "Good work finishing that. Every step counts.",
  sleepStreak: "Two nights of good sleep. Your body is grateful.",
};
```

### 9.2 Streak Logic

- Streaks **pause**, not reset
- Missing a day → streak paused, resume when user checks in again
- Display: "Streak on pause" (not "streak broken")
- No leaderboards, no points, no guilt-based messaging

### 9.3 Implementation

```typescript
interface Streak {
  currentStreak: number;
  pausedAt: string | null; // date when streak was paused
  lastActiveDate: string;
  totalBreaksTaken: number;
  nightsOnBedtime: number;
}
```

---

## Phase 10: Feature Implementation — "Why This Works" Notes

### 10.1 Science Notes Data

```json
// data/scienceNotes.json
{
  "moving-task": "Research shows that when we feel overwhelmed, breaking work into smaller chunks reduces cortisol and improves focus.",
  "breathing-break": "Deep breathing activates the parasympathetic nervous system, reducing stress within minutes.",
  "sleep-early": "Consistent sleep schedules regulate your circadian rhythm, improving mood and cognitive performance.",
  "stretching": "Physical movement increases blood flow to the brain, which helps clear mental fatigue.",
  "split-task": "Chunking large tasks into smaller sessions prevents mental exhaustion and maintains motivation."
}
```

### 10.2 Implementation

- Each suggestion, break option, or action has an optional "Why?" button
- Tap → shows 1-2 sentence science explanation
- Never forced — only shown when user taps
- Brief, never a long lecture

---

## Phase 11: Feature Implementation — Weekly Trend View

### 11.1 Weekly Trend Screen

**Screen:** `WeeklyTrendScreen` (tapped from HomeScreen)

**Layout:**
- 7-day chart (one dot per day)
- Color-coded by burnout level (green/yellow/red)
- Below each dot: mood score, sleep hours
- Summary text at bottom: "You had 3 green days, 2 yellow, and 1 red this week"
- One-tap insight: "Your sleep improved mid-week — keep it up!"

**Data:**
```typescript
interface WeeklySummary {
  days: DayData[];
  greenDays: number;
  yellowDays: number;
  redDays: number;
  avgMood: number;
  avgSleep: number;
  insight: string; // Auto-generated summary
}
```

---

## Phase 12: Polish & Testing

### 12.1 Onboarding Flow

**First launch:**
1. Welcome screen with app promise: "Keep going without falling apart"
2. Brief explanation of how it works (3 bullets)
3. Permissions request (notifications, etc.)
4. Quick setup (as described in Phase 3)
5. First indicator shown → done

**Total time: under 2 minutes**

### 12.2 Accessibility

- Dynamic font sizes support (iOS/Android system font settings)
- Sufficient color contrast (WCAG AA minimum)
- Screen reader labels on all interactive elements
- Touch targets ≥44px
- Reduce motion option in settings

### 12.3 Testing Strategy

**Unit Tests:**
- `burnoutAlgorithm.test.ts` — Test scoring logic with various scenarios
- `useTasks.test.ts` — Add, delete, complete tasks
- `useSleep.test.ts` — Sleep entry calculation
- `storage.test.ts` — Save and load data correctly
- `recommendations.test.ts` — Suggestion generation logic

**Manual Testing Checklist:**
- Setup completes in under 2 minutes ✓
- Adding a task takes ≤3 seconds ✓
- Daily check-in takes ≤5 seconds ✓
- Sleep check-in takes ≤10 seconds ✓
- Indicator changes correctly when data changes ✓
- Push notifications arrive at correct times ✓
- Light/dark mode switches correctly ✓
- App works offline (all data local) ✓

**Beta Testing:**
- Build APK/IPA → distribute via Expo TestFlight / Google Play Beta
- Give to 3-5 students
- Collect feedback on: setup time, check-in speed, indicator clarity, overall feel

### 12.4 Performance Optimization

- Target: <2s cold start time
- AsyncStorage operations debounced (500ms)
- No heavy animations on main thread
- Use `React.memo` on all list items
- Image assets optimized (PNG, appropriate sizes)

---

## Phase 13: Deployment

### 13.1 Build & Test

```bash
# Generate production builds
npx expo prebuild --clean
npx expo run:android   # or expo run:ios
```

### 13.2 App Store Preparation

**Assets needed:**
- App icon (1024x1024)
- Splash screen image (1242x2688 for iOS)
- 3-5 screenshots (phone frame mockups showing key screens)
- Description text
- Privacy policy (required by App Store)

**Privacy Policy:** Must state:
- All data stored locally on device
- No data shared with third parties
- No tracking
- Sharing is optional and user-controlled

### 13.3 App Store Submission

1. **Apple App Store:**
   - Enroll in Apple Developer Program ($99/year)
   - Create app record in App Store Connect
   - Submit build via Xcode or Transporter
   - Wait for review (1-3 days)

2. **Google Play Store:**
   - Create Google Play Developer account ($25 one-time)
   - Create app in Play Console
   - Upload APK/AAB
   - Wait for review (hours to days)

### 13.4 Infrastructure (No Vercel, No Supabase)

| Service | Purpose | Cost |
|---|---|---|
| PostgreSQL (local) | Database on device | Free |
| Better Auth | Authentication | Free (self-hosted) |
| Cloudflare R2 | File storage | Free tier (10GB) |
| Expo EAS | Build service | Free tier |
| GitHub | Code hosting | Free |

**No paid services required for V1.**

### 13.4 Post-Launch

- Monitor crash reports (Sentry or Expo's built-in)
- Track success metrics (return rate, suggestion adoption)
- Collect written feedback
- Plan Version 2 features based on feedback

---

## Phase 14: Version 2 (Post-Feedback)

Features to add after real student testing:

1. **Schedule comparison** — Upload timetables, compare with suggested balance
2. **Overloaded-schedule honesty** — Flag unsustainable schedules
3. **Crunch mode** — Exam season mode with recovery period
4. **Weekly review** — Short under-a-minute summary
5. **Advisor sharing** — Optional summary sharing with trusted person
6. **Quick tips section** — 60-second science topics
7. **Detailed sleep scoring** — Plain-language sleep score + debt trends

---

## Timeline Estimates

| Phase | Estimated Duration | Notes |
|---|---|---|
| Phase 0: Setup | 2-3 days | Install, configure, PostgreSQL, create repo |
| Phase 1: Design System | 3-5 days | Colors, typography, components |
| Phase 2: Architecture | 4-5 days | State, DB schema, auth, navigation |
| Phase 3: Setup + Tasks | 5-7 days | Main user-facing core |
| Phase 4: Check-ins + Indicator | 5-7 days | Core logic, most important screen |
| Phase 5: Breaks | 4-5 days | Timer, menu, skip logic |
| Phase 6: Sleep Protection | 3-4 days | Notifications, cutoff logic |
| Phase 7: Suggestions | 3-4 days | Algorithm, UI |
| Phase 8: Support + Safety | 2-3 days | Resources, safety checks |
| Phase 9: Reinforcement | 2 days | Messages, streaks |
| Phase 10: "Why This Works" | 1 day | Static data + toggle |
| Phase 11: Weekly Trend | 2-3 days | Chart, summary |
| Phase 12: Polish + Test | 5-7 days | Onboarding, accessibility, bugs |
| Phase 13: Deploy | 3-5 days | Builds, App Store, Play Store |
| **Total V1: ~45-65 days** | | |

---

## Risk Mitigation

| Risk | Mitigation |
|---|---|
| Solo dev burnout | Keep each phase small and shippable. Finish Phase 3 before starting Phase 4. |
| Scope creep | Resist Version 2 features. Stick to Phase 0-13 only. |
| Science accuracy | Have algorithm reviewed by psychologist/sleep researcher before launch |
| Name conflict | Confirm "Evenly Study" is clear in app stores before submitting |
| Under-18 users | Review age-appropriate privacy/consent rules for launch regions |
| Low adoption | Keep check-ins extremely short. Monitor return rates weekly |
| Support accuracy | Curate resources carefully. Review quarterly for updated numbers |
| Local DB complexity | Use Knex migrations to keep schema changes manageable |
| Auth edge cases | Better Auth handles most; test thoroughly on both platforms |

---

## "One-line promise" throughout development

> **"Keep going without falling apart."**

Every design decision, every feature, every piece of copy should serve this promise. If something adds pressure or complexity, cut it.
