# Design research behind Taski

Taski's whole premise — a to-do app that doesn't score, shame, or alarm the person using it — started from one specific person's experience, not a literature review. This document is the literature review done afterward: what's actually documented about ADHD, attention, and interface design, checked against the decisions already made, with the gaps and overclaims called out rather than smoothed over.

## 1. Color: hue itself isn't the ADHD-specific lever

The most rigorous source found here is a peer-reviewed one: a [CHI 2024 paper on accessible data visualization for ADHD](https://dl.acm.org/doi/10.1145/3613904.3642112) found **no meaningful difference in hue discrimination between adults with and without ADHD** — general-audience best-practice color guidance applies to ADHD audiences too. Attention increases blue perception for both groups equally; ADHD doesn't change that.

This matters because a lot of "ADHD color psychology" content online implies ADHD brains perceive or need specific colors differently. The evidence doesn't support that. What the evidence *does* support is more about **intensity and restraint**, not hue:

- Neurodivergent-UX guidance consistently recommends **soft, muted tones over neon/high-saturation palettes**, which read as overstimulating for sensory-sensitive users ([accessibilitychecker.org](https://www.accessibilitychecker.org/blog/neurodivergent-ux-design/)).
- General color-psychology literature treats red as the culturally-learned signal for urgency/danger/error state, and blue/green as calmer, trust-signaling hues ([UX Magazine](https://uxmag.medium.com/the-psychology-of-color-in-ui-ux-design-74ca4e8418cd), [clickworker](https://www.clickworker.com/customer-blog/psychology-of-ui-colors/)) — with the caveat that color meaning is contextual and learned, not hardwired, so this is a *convention* to respect, not a hard biological law.

**Applied to Taski:** the palette is a single warm cream/paper background, warm near-black ink, and exactly one accent hue (a muted sage green) — no red anywhere in the interface, including for "overdue" states. That last part is a deliberate product decision, not an oversight: red's learned association with alarm is precisely the emotional register this app is trying to opt out of.

## 2. Light sensitivity and dark mode: a real, under-studied need

This is the strongest concrete argument for the "nice-to-have" theming request. A clinical systematic review found **self-reported photophobia in 69% of people with ADHD, versus 28% without** ([TheraSpecs](https://www.theraspecs.com/blog/adhd-light-sensitivity-hypersensitivity-sensory-processing/)) — a large, specific, sourced gap, not a vague claim.

Accessibility practitioners treat dark mode as close to a baseline requirement rather than a cosmetic option for exactly this population ([See Me Please](https://seemeplease.com/blog/dark-mode)), and survey data from student users found dark-mode preference around 80% where measured. Worth being honest about the ceiling here: **formal RCT-level research on dark mode's accessibility benefit is thin** — the evidence is real but mostly qualitative/survey-based, not a settled quantitative literature.

**Applied to Taski:** this is the actual justification for building real theming rather than guessing at one "correct" ADHD palette. Given how heterogeneous light sensitivity and color preference are even within the ADHD population, offering a small set of choices (dark mode + a couple of soft palettes) *is* the evidence-based move — the research doesn't point to one universal answer, it points to variance that a single fixed palette can't serve.

## 3. Visual clutter, layout, and progressive disclosure

Recurring, consistent findings across multiple sources ([Medium/UX Design for ADHD](https://medium.com/design-bootcamp/ux-design-for-adhd-when-focus-becomes-a-challenge-afe160804d94), [accessibilitychecker.org](https://www.accessibilitychecker.org/blog/neurodivergent-ux-design/), [Focus Bear](https://www.focusbear.io/blog-post/adhd-accessibility-designing-apps-for-focus)):

- Cluttered layouts and inconsistent patterns fragment attention and raise cognitive load.
- Predictable positioning of navigation/key elements across screens matters more than novelty.
- ≥1.5 line-height, left-aligned text, ~70–80 character line length reduce reading fatigue.
- **Progressive disclosure** — show only what's needed by default, reveal detail on request — is named directly as a core pattern.

**Applied to Taski:** the clock/repeat icons that stay invisible until hover, and only expand into a full picker on click, are progressive disclosure by the book. The Today screen's one-column card layout and the identical top bar across Today/Calendar are the "predictable positioning" half of this.

**Where this flags a real gap:** the day labels in the Calendar screen ("TODAY", "TOMORROW") are set in tracking-wide uppercase. Multiple sources call out ALL CAPS as something to avoid because it distorts letter shapes and slows reading — usually discussed for body/emphasis text. At caption size for a two-word label this is a common and probably-fine convention, but it's the one spot in the current design that cuts against the letter-shape guidance rather than for it, and is worth a second look rather than assuming it's fine by default.

## 4. Motion: the most unambiguous finding in this whole review

Every source touching on this agreed, including a peer-reviewed comparison of animated UI elements for autistic vs. non-autistic users ([ACM/IEEE ICSE 2022](https://dl.acm.org/doi/10.1145/3510458.3513007)):

- Auto-playing, blinking, or looping animation actively hijacks focus for people with attention-related conditions.
- The effect is worse, not milder, for neurodivergent users specifically — this isn't a "nice to have less of," it measurably degrades task performance.

**Applied to Taski:** there is currently no decorative motion in the app at all — no confetti on completion, no animated streak counters, no auto-advancing anything. That was already true before this research pass; this section is confirmation the default was right, not a new requirement.

## 5. Gamification, streaks, and loss aversion — the core thesis, with citations

This is where the research most directly validates (and sharpens the language for) the app's founding idea:

- Streak mechanics work by exploiting **loss aversion** — behavioral-economics research finds losses loom roughly twice as large, psychologically, as equivalent gains — and notification systems are frequently tuned to fire at the moment a user is most likely to feel that loss ([The Brink](https://www.thebrink.me/gamified-life-dark-psychology-app-addiction/)).
- ADHD's dopamine dysregulation makes reward signals *more* effective, which is exactly why streak mechanics can curdle from motivation into anxiety and compulsive checking rather than staying a gentle nudge ([AFFiNE](https://affine.pro/blog/gamified-to-do-list-apps-adhd), [NerdSip](https://nerdsip.com/blog/gamification-gone-wrong-when-streaks-become-the-point)).
- A recurring pattern in "why ADHD productivity apps fail" writeups: apps that **punish missed days or demand consistent manual input** fail predictably, because they require the exact executive function ADHD disrupts ([The ADHD Studio](https://theadhdstudio.co.uk/adhd-productivity-apps.html)).

**Applied to Taski:** no streak counters, no percentage-complete score, no red "overdue" state, recurring tasks silently reset on their own schedule with no guilt copy anywhere. This was the starting brief before any research happened — the literature says that instinct was aimed at a documented, named failure mode, not just a vibe.

## 6. Time blindness and calendar shape

- Text-heavy, list-only planners read as abstract; visual/spatial representations of time are easier to act on ([Affinity Psychological Services](https://affinitypsych.com/visual-planning-methods-for-adhd-time-management/)).
- Weekly or short-horizon views are repeatedly recommended over full month grids for daily use — less overwhelming, more immediate ([Saner.AI](https://www.saner.ai/blogs/best-calendars-for-adhd)).
- The core coping mechanism named across sources is **externalizing time** — moving it out of memory and onto a visible surface — rather than relying on an internal sense of duration that ADHD specifically impairs ([Brain.fm](https://www.brain.fm/blog/adhd-time-blindness-planning-tools-time-management)).

**Applied to Taski:** the Calendar screen defaults to a 7-day "Upcoming" list, with the month grid as an opt-in secondary view rather than the default — this matches the weekly-over-monthly finding directly. The optional "takes about ___ min" duration estimate on a task exists specifically to externalize the "how long will this actually take" judgment that time blindness makes unreliable internally.

## 7. Task initiation friction

- Task initiation — the gap between *knowing* and *starting* — is named as the single biggest executive-function bottleneck in ADHD, not a willpower or motivation problem ([Tiimo](https://www.tiimoapp.com/resource-hub/task-initiation-adhd), [Get Inflow](https://www.getinflow.io/post/task-initiation-strategies-for-adults)).
- Apps that force categorization, due dates, or structure at capture time add friction at exactly the moment it's most costly; low-friction, structure-optional capture is named as a differentiator of the apps that actually get used.

**Applied to Taski:** adding a task requires only typing text and pressing Enter/Add — routine, time, duration, and recurrence are all optional and hidden until asked for. This is the same principle as progressive disclosure (§3), applied specifically to the capture moment rather than to display density.

## Honest limitations of this review

- Most of what's published on "ADHD app design" is practitioner and accessibility-consultancy writing, not peer-reviewed research. Where a claim traces to a peer-reviewed source (the CHI 2024 color paper, the ICSE 2022 animation paper, the photophobia systematic review), that's called out explicitly above; everything else is consistent practitioner consensus, which is real signal but a lower evidence bar.
- ADHD is heterogeneous — sensory sensitivity, color preference, and even whether gamification helps or harms varies a lot person to person. Nothing here should be read as "the one correct ADHD design," which is itself the strongest argument in this document for shipping *choice* (theming) rather than a single "optimized" palette.
- Dark mode specifically has real accessibility-community consensus and a plausible mechanism (photophobia prevalence) behind it, but the formal quantitative research base is thin — worth citing carefully rather than as settled science.

## What this means for the theming idea

Given §2 and the limitations note above: dark mode plus a small set of soft, muted alternative palettes is a legitimately evidence-grounded feature, not just a nice visual extra — but it's additive to the current single default palette, not a replacement for the research already reflected in it (no red, no neon, no high-saturation accent). Scoping it as a v-next feature rather than folding it into the current round of fixes still seems right; it's a real feature (persisted per-device theme choice, 3–4 palettes, a settings surface to pick one) rather than a quick tweak.
