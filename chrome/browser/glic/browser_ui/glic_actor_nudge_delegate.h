// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef CHROME_BROWSER_GLIC_BROWSER_UI_GLIC_ACTOR_NUDGE_DELEGATE_H_
#define CHROME_BROWSER_GLIC_BROWSER_UI_GLIC_ACTOR_NUDGE_DELEGATE_H_

#include <string>

namespace glic {

class GlicActorNudgeDelegate {
 public:
  virtual ~GlicActorNudgeDelegate() = default;

  // Show and hide the actor task icon (actor-specific nudge UI).
  virtual void ShowGlicActorTaskIcon() = 0;
  virtual void HideGlicActorTaskIcon() = 0;

  // Query whether the actor task icon nudge is currently showing.
  virtual bool GetIsShowingGlicActorTaskIconNudge() = 0;

  // Whether Glic (actor feature) has been added/enabled for the profile.
  virtual bool IsGlicAdded() = 0;

  // Set the visible label for the actor nudge.
  virtual void SetGlicActorNudgeLabel(const std::u16string& nudge_label) = 0;

  // Trigger the actor nudge with the provided text.
  virtual void TriggerGlicActorNudge(const std::u16string& nudge_text) = 0;

  // Set pressed state for actor nudge UI (e.g., for button pressed visuals).
  virtual void SetGlicActorNudgePressedState(bool pressed) = 0;

  // Show a bubble or popup listing actor tasks.
  virtual void ShowActorTaskListBubble() = 0;
};

}  // namespace glic

#endif  // CHROME_BROWSER_GLIC_BROWSER_UI_GLIC_ACTOR_NUDGE_DELEGATE_H_
