# Evenly Study: Product Requirements Document

**Version:** 1.1 (feature plan, Version 2 detailed) | **Date:** October 6, 2026 | **Owner:** Founder (solo)

---

## 1. Overview

**Evenly Study** is a calm, science-informed app that helps students avoid burnout. It looks at a student's workload, sleep, and how they feel each day, then automatically balances heavy study stretches with well-timed brain breaks and protected rest.

**One-line promise:** Keep going without falling apart.

**Name note:** "Evenly" is already used by other apps (mostly expense and finance tools). Adding "Study" makes the name distinct and tells students who it is for. Before launch, search the App Store, Google Play, social media handles, and run a trademark search for your country.

---

## 2. The Problem

- Students often don't notice burnout until they are already exhausted.
- Heavy workloads, late nights, and skipped breaks pile up quietly, especially in exam seasons.
- Most planners and timers treat every day the same and ignore sleep and stress.
- Many wellness apps feel generic, preachy, or add more pressure (streaks, scores, guilt).

## 3. Target Users

**Primary (Version 1):** Students, from secondary school through university, managing classes, assignments, and exams.

**Later:** Workers (not in scope for now).

**Key user needs:**
- A simple way to see when their load is getting risky.
- Realistic break and rest suggestions that fit their real schedule.
- A tool that feels supportive, private, and never judgmental.

## 4. Goals and Non-Goals

**Goals**
1. Give students an early warning before burnout hits.
2. Balance heavy workloads with science-backed breaks and sleep protection.
3. Keep students in control of every decision.
4. Be quick to start (under two minutes) and calm to use.

**Non-goals (for now)**
- Not a medical or therapy tool; it does not diagnose or treat.
- No automatic syncing with school systems or calendars.
- No competitive features (leaderboards, points for working more).
- No workers or teams in the first version.

## 5. Guiding Principles

1. **Student in control.** The app suggests; the student decides. Nothing is rearranged automatically.
2. **Private by default.** Sharing is optional and chosen by the student.
3. **Encouragement without pressure.** Reward healthy habits, never grinding. Streaks are forgiving.
4. **Honest but gentle.** Flag unhealthy schedules calmly with specific fixes.
5. **Science, explained simply.** Short "why this works" notes, never long lectures.
6. **Safety first.** Support is always one tap away.

---

## 6. Version 1: Features and Requirements

### 6.1 Quick Setup (under 2 minutes)
The student enters:
- Target bedtime
- Usual study or work hours (their own available windows)
- A few current tasks (or a simple timetable)

**Requirements**
- Setup can be finished in under two minutes.
- Nothing in setup is mandatory beyond the basics.
- Setup ends by showing the student their first burnout indicator with one friendly suggestion, so they see value on day one.

### 6.2 Manual Task Entry
Students add their own assignments, exams, readings, and projects. No syncing with school systems.

**Requirements**
- Quick-add templates: Exam, Essay, Reading, Group project.
- Each task has a title, due date, and an effort level: **light, medium, or heavy**.
- Adding a task should take only a few seconds.

### 6.3 Daily Check-In and Morning Sleep Check-In
Workload is the main signal for burnout risk. Two tiny check-ins add the human side.

**Requirements**
- **Daily check-in:** a 5-second tap on how they feel (1 to 5).
- **Morning sleep check-in (about 10 seconds):** bedtime, wake time, and how rested they feel (1 to 5).
- Both are quick, optional to skip, and feed the burnout indicator.

### 6.4 Burnout Indicator (Green, Yellow, Red)
The main screen shows one simple, soft-colored indicator with a plain-language label.

| Level | Label (example) | What it means |
|---|---|---|
| Green | "You're in a healthy zone" | Load and rest are balanced |
| Yellow | "Load is building" | Workload up and/or sleep down |
| Red | "High risk, time to ease off" | Heavy load plus poor sleep or feeling drained |

**Requirements**
- No raw numeric score on the main screen.
- Each level comes with one small, specific suggestion (for example, "Consider moving one task to tomorrow").
- A **weekly trend view** is one tap away, showing how the indicator has changed.
- Muted, calm colors; "red" should say "ease off," not "you're failing."

### 6.5 Break Menu with a Flexible Rhythm
The app uses a Pomodoro-style rhythm as the default and adjusts it to the workload.

**Requirements**
- Default rhythm: focus sessions with short breaks.
- As workload or stress rises, breaks come slightly more often and/or last slightly longer.
- Students can set their own available work windows and preferred session and break lengths. The app adjusts within their boundaries and never overrides them.
- When it is break time, the app offers a **menu of 3 to 4 science-backed options** matched to break length, for example:
  - Micro-break: eyes-off-screen reset, breathing
  - Short break: stretch sequence, quick walk
  - Long break: proper meal, longer walk, real rest
- Students choose the option that fits where they are (for example, in a lecture hall versus at home).

### 6.6 Skipped Breaks
**Requirements**
- The first skipped break is logged silently.
- A gentle reminder comes a little later (for example, 15 to 20 minutes), such as "Want to take a quick breather now?"
- If skipping becomes a pattern (for example, several days in a row during heavy workload), the app gently escalates with a warm check-in: "You've skipped breaks for a few days. How are you actually doing?"
- The app never re-nags immediately.

### 6.7 Sleep Protection
**Requirements**
- Student sets a target bedtime.
- The app gently discourages scheduling or continuing work past a **cutoff time**. When work would run past it, it suggests moving a task to tomorrow.
- A **wind-down reminder** is sent shortly before bedtime.
- The morning check-in feeds sleep information into the burnout indicator. Several short nights in a row during a heavy week move the indicator toward yellow or red faster.

### 6.8 Load-Lightening Suggestions
**Requirements**
- During heavy stretches (for example, several red days), the app proposes specific ways to reduce the load, such as moving a task or splitting a big one into smaller sessions.
- Suggestions use the due dates and effort levels the student already entered.
- The student always approves or ignores each suggestion. Nothing is changed automatically.

### 6.9 "Need to Talk to Someone?" Support
**Requirements**
- An always-visible option that opens a short list of human support: a campus counselor, a trusted friend or family member, and a local helpline.
- If the app notices signs of serious distress over many days (for example, feeling drained or hopeless repeatedly), it shows a warm, low-pressure check-in and points to real people who can help.
- Wording is honest: Evenly Study is a wellbeing tool, not a therapist. It does not diagnose, treat, or replace professional care.
- Support information must be accurate and appropriate for the student's region.

### 6.10 Positive Reinforcement
**Requirements**
- Gentle messages that celebrate healthy behavior: taking breaks, hitting bedtime, keeping a balanced week (for example, "You took every break today" or "Nice job easing off tonight, rest is part of the work").
- Any streaks are forgiving: they pause rather than reset when a day is missed.
- No leaderboards, points for working more, or guilt-based messaging.

### 6.11 "Why This Works" Notes
**Requirements**
- Suggestions can include an optional, one-to-two sentence science note behind a small "Why?" tap.
- Brief and never forced.

---

## 7. Version 2: Features (after real student feedback)

### 7.1 Schedule Comparison
Students add their own timetable and routine, and Evenly Study compares it with its own suggested balance.

**Requirements**
- Students can add their schedule three ways: manual entry, a photo upload (e.g., a screenshot of a timetable), or a file upload (PDF/spreadsheet).
- Build order: **manual entry first**; photo and file uploads come in a later update.
- For photo or file uploads, the app shows what it understood and lets the student correct any mistakes before using it.
- The schedule is shown via a **toggle** between "Your schedule" and "Our suggestion" (not side-by-side or an overlay), with a short plain-language summary of the differences on top (for example, "We added 2 breaks and moved Thursday's essay to Friday").
- Once the student picks a final version (theirs, ours, or a mix), it becomes their new **working/default schedule** going forward. The original upload is kept only as a backup they can revert to.
- Future comparisons run against the student's current working schedule, not the original upload.

### 7.2 Honest Flagging of Overloaded Schedules
If a student's own schedule leaves little room for sleep or breaks, the app says so clearly but kindly.

**Requirements**
- Flags appear **immediately** whenever the student edits their schedule, on the same screen, not on a weekly timer and not as a separate notification.
- Flags are factual and specific (for example, "This week leaves only 5 hours for sleep on 3 nights").
- Suggested fixes only touch **study/task time** (splitting a task, moving a flexible item, shortening a study block). The app never suggests changing workouts, jobs, shifts, or other non-study commitments.
- If the overload is coming from fixed, non-study commitments, the flag can say so factually without prescribing a fix to those commitments.
- The weekly review separately summarizes any flags that came up that week.

### 7.3 Crunch Mode
A dedicated mode for exam seasons and major deadlines, when the normal balance won't fit.

**Requirements**
- Can be turned on **manually** by the student at any time.
- Can also be **suggested by the app** as a one-time, easy-to-dismiss prompt when it detects several heavy or red days in a row. The app never repeats the suggestion if the student declines.
- One tap to start, with an **end date set up front**.
- While active, it protects the essentials: minimum sleep, short and frequent breaks, real meals, some movement. It drops nice-to-haves like long wind-down routines or extra tips.
- Includes a planned **recovery period** of roughly 2-3 days after crunch mode ends:
  - Break suggestions lean toward longer, more restorative options.
  - The sleep cutoff shifts a bit earlier automatically.
  - The app holds off suggesting new heavy tasks or additional load-lightening prompts.
- The following weekly review checks in on how the student is doing before fully returning to the normal balance.

### 7.4 Weekly Review
A short, regular summary of the student's week.

**Requirements**
- Takes under a minute to read.
- Student chooses their own day for the review, with **Sunday evening** pre-selected as the default during setup.
- Delivered as a **gentle, optional notification** on the chosen day (controlled via notification settings). Tapping it opens the review; dismissing it still saves it.
- Always accessible afterward in a **"Reviews" tab/history**, so students can revisit past weeks or catch up if they missed one.
- Includes a few highlights (sleep, breaks taken, workload balance, best day), leads with what went well, and ends with **one small suggestion** for next week that can be applied in one tap.
- Also summarizes any schedule-overload flags from that week, and checks in after a crunch-mode recovery period.

### 7.5 Advisor Sharing
Students can optionally share a simple progress summary with someone they trust, such as an academic advisor.

**Requirements**
- Sharing is **off by default** and fully optional.
- The student generates a **shareable link or code** (not an email-invite system). The advisor opens it directly, with no account needed.
- The advisor sees a **read-only summary only** (for example, the weekly trend), never individual check-in answers, sleep times, or personal notes.
- The student can **revoke the link at any time**.
- Links **expire automatically after 30 days**; the student can generate a fresh one.
- No automatic reports are ever sent to parents, schools, or anyone else without the student's direct action.

### 7.6 "60-Second Tips" Section
A lightweight place for students to learn the science behind the app's suggestions, if they're curious.

**Requirements**
- Organized into a small, fixed set of loose categories: **Sleep, Breaks, Stress, Focus**. No long flat list.
- Each topic shows its reading time up front (for example, "Why sleep matters for memory, 30 sec").
- A short note appears before the section so students know it's quick, since "Learn more" labels are often assumed to mean long text.
- Also surfaces **contextually**: the "Why?" tap next to a suggestion (Section 6.11) links to the relevant short topic.

### 7.7 Detailed Sleep Scoring and Sleep-Debt Trends
A more detailed, still simple, view of sleep health.

**Requirements**
- A plain-language sleep score ("Well rested," "Running low," "Sleep debt building"), not a raw number, based mainly on hours slept against a science-backed target with a small adjustment for how rested the student says they feel.
- Default sleep target is **8 hours**, adjustable by the student in settings.
- Sleep debt (hours "borrowed" relative to target) is shown for the **current week only** and **resets each week**. It does not accumulate indefinitely.
- A chronic multi-week pattern of low sleep is not shown as a growing debt counter. Instead, it surfaces gently as a trend note in the weekly review (for example, "You've had low sleep for 3 weeks running").

---

## 8. Key User Flows

**First-time flow:** Open app → quick setup (bedtime, study hours, a few tasks) → see first indicator and suggestion → done in under two minutes.

**Daily flow:** Morning sleep check-in → glance at indicator → work in sessions → choose from break menu → evening wind-down reminder before bedtime.

**Heavy-week flow:** Indicator turns yellow or red → app proposes ways to lighten the load → student accepts or ignores → weekly trend shows progress.

**Skipped-break flow:** Break skipped → logged quietly → gentle reminder later → if pattern continues, warm check-in.

**Support flow:** Student taps "Need to talk to someone?" at any time, or the app offers it after a serious, sustained pattern.

---

## 9. Look and Feel

- Calm and soothing: soft, muted colors, plenty of empty space, a warm and friendly voice.
- Muted tones for green, yellow, and red so nothing feels like an alarm.
- Light mode and dark mode (many students study late at night).
- Short, simple wording throughout. No long text on the main screens.

---

## 10. Privacy and Safety

- Everything is private by default.
- Sharing is always optional, limited to a simple summary, and can be turned off at any time.
- No one (parents, schools, classmates) can monitor a student without the student's knowledge.
- Success data is collected anonymously.
- The app never claims to diagnose or treat any condition.
- Because students may be under 18, review age-appropriate privacy and consent rules for the regions where you launch.

---

## 11. Success Metrics

Track three simple signals weekly:

1. **Do students come back?** Share still using the app after one week and after one month.
2. **Do they act on suggestions?** How often students take suggested breaks, keep bedtime, or accept a load-lightening idea.
3. **Do they feel better?** An optional check every couple of weeks: "Compared to two weeks ago, how are you feeling?" (better, same, worse).

Also collect a small "Was this helpful?" tap on suggestions and a place for written feedback.

Note: less time spent in the app can be a good sign if students are resting more.

---

## 12. Rollout Plan

1. Build Version 1 with the core features above.
2. Test with a small group of real students and collect honest feedback.
3. Review the three success signals and written comments.
4. Decide which Version 2 features matter most and build those next.

---

## 13. Open Questions and Risks

- **Name:** Confirm "Evenly Study" is clear in app stores, on social handles, and in a trademark search.
- **Science accuracy:** Have the break suggestions, sleep targets, and burnout logic reviewed by someone with relevant expertise (for example, a psychologist, counselor, or sleep researcher) before launch.
- **Support resources:** Decide how to keep helpline and counselor information accurate for each region.
- **Age and consent:** Confirm the rules for users under 18 in your launch regions.
- **Adoption:** Students may skip check-ins; keep them extremely short and watch return rates closely.
- **Solo build:** The Version 1 scope is deliberately small. Resist adding Version 2 features early.
- **Backend (decided):** Version 2 sharing and uploads will use **self-hosted PostgreSQL with PostgREST** — no Supabase, Firebase, or other hosted platforms (avoids vendor lock-in and platform fees).
