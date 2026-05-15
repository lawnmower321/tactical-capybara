# Tactical Capybara Habit App — Design Spec

**Date:** 2026-05-15
**Status:** Draft
**Name:** TBD

---

## Problem

User scores productivity/focus 0/10. The pattern: staying up until 2–3am doing random things (gaming, coding without direction), waking up and immediately scrolling dating apps and reels, drifting through the day without a sense of progress. The issue isn't inability to get things done — it's the absence of a system that makes progress visible and intentional work feel more compelling than passive scrolling.

## Goal

A progressive habit training app, focused on productivity/focus, that:
1. Gives each night a purpose and each morning a clear mission
2. Makes progress *felt* — not just tracked — through visible stat growth and a leveling character
3. Starts simple enough to actually use, and scales in difficulty as the user improves
4. Uses gamification (resources, crafting, cosmetics) to create genuine draw

---

## Core Loop

The entire experience revolves around a 24-hour cycle with two anchor moments:

### Evening — The Mission Brief
The user opens the app in the evening. Their capybara is on screen — idle, relaxed, waiting. The AI generates tomorrow's mission: one concrete, specific task calibrated to the user's current level. Early missions are tiny on purpose (e.g., *"Sit at your desk for 20 minutes before touching your phone tomorrow"*). The user can accept or swap for one alternative. When they commit, their capybara reacts — gearing up, putting on their kit, ready to move. The night ends with intention.

### Morning — The Brief
The user opens the app first thing. Their capybara is front and center — geared up from last night, mission in hand. One screen. The mission. Nothing else. The capybara's presence is the emotional hook: something is waiting for you, and it's yours.

### Completion
One tap when the mission is done. Resources drop visually — the player sees them land. Stats tick up. The capybara reacts with a brief celebration animation. If a stat levels up, the moment is bigger — the capybara changes visually, gains something new, marks the milestone.

### AI Adaptation
The AI tracks completion rate over time. Consistent completions → harder missions unlock. Consistent failures → the AI adjusts down to keep missions in the achievable-but-challenging zone. The AI learns what types of missions the user succeeds at and biases toward those while still pushing growth.

---

## Stats System

Three core stats feed into an overall **Level**:

| Stat | What it measures | What trains it |
|------|-----------------|----------------|
| **Focus** | Sustained attention without drift | Deep work sessions, distraction-free time blocks |
| **Discipline** | Consistency and showing up | Streaks, completing missions on time |
| **Output** | Tangible things shipped | Missions with a real deliverable (code, email, task) |

- Each stat has a visible fill bar
- Bars fill on completion, drain slowly on missed days (no hard resets — stakes without punishment)
- Maxing a bar levels up that stat and unlocks harder missions in that category
- Overall **Level** = sum of all stat levels — the number that tells you who you're becoming

---

## Game Layer

### Resources
Completing missions drops resources. Type and quantity vary by mission type and current stat levels (higher stats = better drop rates):

| Resource | Source |
|----------|--------|
| **Focus Crystals** | Attention-based missions (deep work, distraction-free blocks) |
| **Iron** | Consistency/discipline missions (streaks, showing up) |
| **Momentum** | Output missions (shipped something real) |

### Cosmetics
Earned through play or unlocked by spending resources. Applied to the player's capybara character. No gameplay advantage — pure expression. (Real-money purchases are out of scope for Phase 1.) Examples: hats, accessories, auras, backgrounds, armor pieces, animated effects (unlocked at higher levels).

### Crafted Boosters
Resources are spent to craft single-use items:

| Booster | Effect | Rarity |
|---------|--------|--------|
| **XP Surge** | Double stat gains for 24 hours | Common |
| **Streak Shield** | Absorbs one missed day, streak intact | Rare |
| **Mission Reroll** | Swap tomorrow's mission without penalty | Uncommon |
| **Clarity Lens** | Reveals which stat a mission trains before committing | Common |

Streak Shield should be rare enough to feel consequential when used.

---

## The Handler — The Mysterious Agent

The AI that generates your missions is not a chatbot. It's a character — a shadowy, impossibly capable handler who seems to know more about you than they should. No name given. No origin explained. They contact you. They choose you.

**Personality:** Cryptic, composed, quietly intimidating. Speaks in short sentences. Rarely explains themselves. When they do give context, it feels significant. Think: the kind of person who could end a war with a phone call, but is instead, for reasons unknown, investing in *you*.

**Visual design:** A portrait in the dialog cutscene — silhouetted or partially obscured, high-contrast, tactical aesthetic. Never fully revealed. The mystery is the point.

**The Handler drives the narrative.** Each day's mission comes with a small piece of story — a hint at why this mission, why now, what it's building toward. Over weeks, a larger picture emerges. Players who complete consistently unlock deeper dialog, new story beats, and fragments of the Handler's backstory. The story never fully resolves — it's a living thread.

---

## Dialog Cutscene System

At two moments in the core loop — mission assignment (evening) and mission completion (morning/day) — a cutscene triggers. Style: visual novel. Two character portraits side by side (the Handler and your capybara), text box at the bottom, selectable response options.

**Structure:**
- **Handler portrait** — partially obscured, high-contrast, tactical
- **Capybara portrait** — your character, in their current cosmetic state (so customization shows up here)
- **Text box** — Handler speaks. Your capybara reacts. Dialog is short, punchy, never bloated.
- **Response options** — 2–3 choices that let you shape your capybara's personality (curious, defiant, focused, etc.). Choices don't change the mission but do affect how the Handler speaks to you over time and unlock different dialog branches.

**When cutscenes trigger:**
- **Evening:** Handler delivers the mission brief in character. 3–5 dialog exchanges. Ends with mission acceptance.
- **Completion:** Handler acknowledges what you did. Capybara reacts. A story beat drops — a detail, a clue, a moment of tension or levity. Ends with resource drop and stat update.
- **Level-up:** Longer cutscene. The Handler marks the milestone. Something changes — in the story, in their tone, in what they're willing to share.

**Why this works:** The dialog is the reason to come back even on hard days. People want to see what the Handler says next. The story gives daily habits a narrative weight they don't have in any other habit app.

---

## Character — The Tactical Capybara

Every user plays as a capybara — the world's chillest animal, now on a mission of self-improvement.

- **At signup:** Choose your capybara's base color
- **Over time:** Cosmetics earned and crafted make each capybara unique — a Level 20 capybara looks like a veteran; a new player's looks fresh
- **Visual style:** Pixel art inspired, 2D with a slight 3D-ish depth — charming, achievable to build without a large art team, ages well
- **Emotional anchor:** The capybara is visible on the morning brief screen every day. You see yourself, check your stats, accept your mission.

**Marketing hook:** *"The habit app that turns you into a tactical capybara."* The contrast — the world's most unbothered animal, tactically optimized — is inherently shareable.

---

## Architecture

### Stack
- **Frontend:** Next.js (App Router), deployed on Vercel
- **Backend/DB:** Supabase (PostgreSQL, Auth, Realtime)
- **AI:** Claude API — mission generation, difficulty calibration, adaptation logic
- **Notifications:** Push notifications for evening mission brief delivery

### Key Data Models
- `users` — auth, level, stats, resource balances
- `missions` — history of assigned/completed missions, type, difficulty
- `cosmetics` — catalog of available cosmetics, which the user owns
- `inventory` — user's crafted boosters, used/unused
- `stat_events` — append-only log of stat changes (source of truth for level calculation)

### AI Mission Generation
Each evening, the AI receives:
- User's current stat levels
- Recent mission history (last 7 days, success/fail)
- Mission type performance (which types the user completes most)
- Current level

It returns a calibrated mission with a title, description, estimated duration, and the stat it primarily trains. A secondary "alternative" mission is generated for rerolls.

---

## Scope — Phase 1

This spec covers Phase 1: **productivity/focus** as the sole domain. The stat system, game layer, and character are designed to extend to other life areas (health, finance, skills) in future phases — but nothing in Phase 1 builds toward that. Build it right for one area first.

**Out of scope for Phase 1:**
- Social/multiplayer features
- Additional life domains
- Mobile native app (web-first, mobile-responsive)
- Marketplace / real-money purchases
- App name and branding

---

## Success Criteria

The app is working when:
1. A user opens it in the morning before their scroll apps
2. A user describes feeling like their stats are actually going up — not just in the app, but in their life
3. A user shows someone else their capybara unprompted
