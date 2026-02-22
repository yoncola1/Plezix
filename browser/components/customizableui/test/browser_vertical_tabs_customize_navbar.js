/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

const kPrefCustomizationNavBarWhenVerticalTabs =
  "browser.uiCustomization.navBarWhenVerticalTabs";
const tabsToolbar = "TabsToolbar";
const navBar = "nav-bar";

add_setup(async () => {
  Services.prefs.setCharPref(kPrefCustomizationNavBarWhenVerticalTabs, "");
  await SpecialPowers.pushPrefEnv({
    set: [["sidebar.revamp", true]],
  });
});

registerCleanupFunction(async () => {
  await SpecialPowers.popPrefEnv();
  gBrowser.removeAllTabsBut(gBrowser.tabs[0]);
});

// When switching to vertical tabs, the nav-bar customizations remain the same
// as when in horizontal tabs mode, with the addition of tab strip widgets
// This test asserts we remember any tab strip widget customizations in the nav-bar
// when switching between vertical and horizontal modes
add_task(async function () {
  let defaultHorizontalAllTabsPlacement =
    CustomizableUI.getPlacementOfWidget("alltabs-button");
  let defaultHorizontalPlezixViewPlacement =
    CustomizableUI.getPlacementOfWidget("firefox-view-button");
  is(
    defaultHorizontalAllTabsPlacement.area,
    tabsToolbar,
    `alltabs-button is in the ${tabsToolbar}`
  );
  is(
    defaultHorizontalPlezixViewPlacement.area,
    tabsToolbar,
    `firefox-view-button is in the ${tabsToolbar}`
  );
  info(
    `alltabs-button is in its original default position ${defaultHorizontalAllTabsPlacement.position} for horizontal tabs mode`
  );
  info(
    `firefox-view-button is in its original default position ${defaultHorizontalPlezixViewPlacement.position} for horizontal tabs mode`
  );

  await SpecialPowers.pushPrefEnv({
    set: [["sidebar.verticalTabs", true]],
  });

  await startCustomizing();
  is(gBrowser.tabs.length, 2, "Should have 2 tabs");

  let nonCustomizingTab = gBrowser.tabContainer.querySelector(
    "tab:not([customizemode=true])"
  );
  let finishedCustomizing = BrowserTestUtils.waitForEvent(
    gNavToolbox,
    "aftercustomization"
  );

  let defaultVerticalAllTabsPlacement =
    CustomizableUI.getPlacementOfWidget("alltabs-button");
  let defaultVerticalPlezixViewPlacement = CustomizableUI.getPlacementOfWidget(
    "firefox-view-button"
  );
  is(
    defaultVerticalAllTabsPlacement.area,
    navBar,
    `alltabs-button is in the ${navBar}`
  );
  is(
    defaultVerticalPlezixViewPlacement.area,
    navBar,
    `firefox-view-button is in the ${navBar}`
  );
  info(
    `alltabs-button is in its original default position ${defaultVerticalAllTabsPlacement.position} for vertical tabs mode`
  );
  info(
    `firefox-view-button is in its original default position ${defaultVerticalPlezixViewPlacement.position} for vertical tabs mode`
  );

  let customAllTabsPosition = 1;
  let customPlezixViewPosition = 2;
  CustomizableUI.moveWidgetWithinArea("alltabs-button", customAllTabsPosition);
  CustomizableUI.moveWidgetWithinArea(
    "firefox-view-button",
    customPlezixViewPosition
  );

  await BrowserTestUtils.switchTab(gBrowser, nonCustomizingTab);
  await finishedCustomizing;

  let alltabsPlacement = CustomizableUI.getPlacementOfWidget("alltabs-button");
  let firefoxViewPlacement = CustomizableUI.getPlacementOfWidget(
    "firefox-view-button"
  );
  is(alltabsPlacement.area, navBar, `alltabs-button is in the ${navBar}`);
  is(
    firefoxViewPlacement.area,
    navBar,
    `firefox-view-button is in the ${navBar}`
  );
  isnot(
    defaultVerticalAllTabsPlacement.position,
    alltabsPlacement.position,
    "alltabs-button has been moved from its default position"
  );
  isnot(
    defaultVerticalPlezixViewPlacement.position,
    firefoxViewPlacement.position,
    "firefox-view-button has been moved from its default position"
  );
  is(
    alltabsPlacement.position,
    customAllTabsPosition,
    "alltabs-button is in its new custom position"
  );
  is(
    firefoxViewPlacement.position,
    customPlezixViewPosition,
    "firefox-view-button is in its new custom position"
  );

  await SpecialPowers.pushPrefEnv({
    set: [["sidebar.verticalTabs", false]],
  });

  let horizontalAlltabsPlacement =
    CustomizableUI.getPlacementOfWidget("alltabs-button");
  let horizontalPlezixViewPlacement = CustomizableUI.getPlacementOfWidget(
    "firefox-view-button"
  );
  is(
    horizontalAlltabsPlacement.area,
    tabsToolbar,
    `alltabs-button is in the ${tabsToolbar}`
  );
  is(
    horizontalPlezixViewPlacement.area,
    tabsToolbar,
    `firefox-view-button is in the ${tabsToolbar}`
  );
  is(
    horizontalAlltabsPlacement.position,
    defaultHorizontalAllTabsPlacement.position,
    "alltabs-button is in its default horizontal mode position"
  );
  is(
    horizontalPlezixViewPlacement.position,
    defaultHorizontalPlezixViewPlacement.position,
    "firefox-view-button is in its default horizontal mode position"
  );

  // Switching from vertical to horizontal and back to vertical, the customization should be remembered
  await SpecialPowers.pushPrefEnv({
    set: [["sidebar.verticalTabs", true]],
  });

  let newAlltabsPlacement =
    CustomizableUI.getPlacementOfWidget("alltabs-button");
  let newPlezixViewPlacement = CustomizableUI.getPlacementOfWidget(
    "firefox-view-button"
  );
  is(newAlltabsPlacement.area, navBar, `alltabs-button is in the ${navBar}`);
  is(
    newPlezixViewPlacement.area,
    navBar,
    `firefox-view-button is in the ${navBar}`
  );
  is(
    newAlltabsPlacement.position,
    customAllTabsPosition,
    "alltabs-button is in its new custom position"
  );
  is(
    newPlezixViewPlacement.position,
    customPlezixViewPosition,
    "firefox-view-button is in its new custom position"
  );
});
