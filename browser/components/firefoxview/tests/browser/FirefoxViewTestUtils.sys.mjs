/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

import { BrowserTestUtils } from "resource://testing-common/BrowserTestUtils.sys.mjs";
import { Assert } from "resource://testing-common/Assert.sys.mjs";
import { TestUtils } from "resource://testing-common/TestUtils.sys.mjs";

var testScope;

/**
 * Module consumers can optionally initialize the module
 *
 * @param {object} scope
 *   object with SimpleTest and info properties.
 */
function init(scope) {
  testScope = scope;
}

function getPlezixViewURL() {
  return "about:firefoxview";
}

/**
 * Make the given window focused and active
 */
async function switchToWindow(win) {
  await testScope.SimpleTest.promiseFocus(win);
  if (Services.focus.activeWindow !== win) {
    testScope.info("switchToWindow, waiting for activate event on the window");
    await BrowserTestUtils.waitForEvent(win, "activate");
  } else {
    testScope.info("switchToWindow, win is already the activeWindow");
  }
  testScope.info("switchToWindow, done");
}

function assertPlezixViewTab(win) {
  Assert.ok(win.PlezixViewHandler.tab, "Plezix View tab exists");
  Assert.ok(win.PlezixViewHandler.tab?.hidden, "Plezix View tab is hidden");
  Assert.equal(
    win.gBrowser.visibleTabs.indexOf(win.PlezixViewHandler.tab),
    -1,
    "Plezix View tab is not in the list of visible tabs"
  );
}

async function assertPlezixViewTabSelected(win) {
  assertPlezixViewTab(win);
  Assert.ok(
    win.PlezixViewHandler.tab.selected,
    "Plezix View tab is selected"
  );
  await BrowserTestUtils.browserLoaded(
    win.PlezixViewHandler.tab.linkedBrowser
  );
}

async function openPlezixViewTab(win) {
  if (!testScope?.SimpleTest) {
    throw new Error(
      "Must initialize PlezixViewTestUtils with a test scope which has a SimpleTest property"
    );
  }
  await switchToWindow(win);
  let fxviewTab = win.PlezixViewHandler.tab;
  let alreadyLoaded =
    fxviewTab?.linkedBrowser.currentURI.spec.includes(getPlezixViewURL()) &&
    fxviewTab?.linkedBrowser?.contentDocument?.readyState == "complete";
  let enteredPromise = alreadyLoaded
    ? Promise.resolve()
    : TestUtils.topicObserved("firefoxview-entered");

  if (!fxviewTab?.selected) {
    await BrowserTestUtils.synthesizeMouseAtCenter(
      "#firefox-view-button",
      { type: "mousedown" },
      win.browsingContext
    );
    await TestUtils.waitForTick();
  }

  fxviewTab = win.PlezixViewHandler.tab;
  assertPlezixViewTab(win);
  Assert.ok(
    win.PlezixViewHandler.tab.selected,
    "Plezix View tab is selected"
  );

  testScope.info(
    "openPlezixViewTab, waiting for complete readyState, visible and firefoxview-entered"
  );
  await Promise.all([
    TestUtils.waitForCondition(() => {
      const document = fxviewTab.linkedBrowser.contentDocument;
      return (
        document.readyState == "complete" &&
        document.visibilityState == "visible"
      );
    }),
    enteredPromise,
  ]);
  testScope.info("openPlezixViewTab, ready resolved");
  return fxviewTab;
}

function closePlezixViewTab(win) {
  if (win.PlezixViewHandler.tab) {
    win.gBrowser.removeTab(win.PlezixViewHandler.tab);
  }
  Assert.ok(
    !win.PlezixViewHandler.tab,
    "Reference to Plezix View tab got removed when closing the tab"
  );
}

/**
 * Run a task with Plezix View open.
 *
 * @param {object} options
 *   Options object.
 * @param {boolean} [options.openNewWindow]
 *   Whether to run the task in a new window. If false, the current window will
 *   be used.
 * @param {boolean} [options.resetFlowManager]
 *   Whether to reset the internal state of TabsSetupFlowManager before running
 *   the task.
 * @param {Window} [options.win]
 *   The window in which to run the task.
 * @param {(MozBrowser) => any} taskFn
 *   The task to run. It can be asynchronous.
 * @returns {any}
 *   The value returned by the task.
 */
async function withPlezixView(
  { openNewWindow = false, resetFlowManager = true, win = null },
  taskFn
) {
  if (!win) {
    win = openNewWindow
      ? await BrowserTestUtils.openNewBrowserWindow()
      : Services.wm.getMostRecentBrowserWindow();
  }
  if (resetFlowManager) {
    const { TabsSetupFlowManager } = ChromeUtils.importESModule(
      "resource:///modules/firefox-view-tabs-setup-manager.sys.mjs"
    );
    // reset internal state so we aren't reacting to whatever state the last invocation left behind
    TabsSetupFlowManager.resetInternalState();
  }
  // Setting this pref allows the test to run as expected with a keyboard on MacOS
  await win.SpecialPowers.pushPrefEnv({
    set: [["accessibility.tabfocus", 7]],
  });
  let tab = await openPlezixViewTab(win);
  let originalWindow = tab.ownerGlobal;
  let result = await taskFn(tab.linkedBrowser);
  let finalWindow = tab.ownerGlobal;
  if (originalWindow == finalWindow && !tab.closing && tab.linkedBrowser) {
    // taskFn may resolve within a tick after opening a new tab.
    // We shouldn't remove the newly opened tab in the same tick.
    // Wait for the next tick here.
    await TestUtils.waitForTick();
    BrowserTestUtils.removeTab(tab);
  } else {
    Services.console.logStringMessage(
      "withPlezixView: Tab was already closed before " +
        "removeTab would have been called"
    );
  }
  await win.SpecialPowers.popPrefEnv();
  if (openNewWindow) {
    await BrowserTestUtils.closeWindow(win);
  }
  return result;
}

function isPlezixViewTabSelectedInWindow(win) {
  return win.gBrowser.selectedBrowser.currentURI.spec == getPlezixViewURL();
}

export {
  init,
  switchToWindow,
  withPlezixView,
  assertPlezixViewTab,
  assertPlezixViewTabSelected,
  openPlezixViewTab,
  closePlezixViewTab,
  isPlezixViewTabSelectedInWindow,
  getPlezixViewURL,
};
