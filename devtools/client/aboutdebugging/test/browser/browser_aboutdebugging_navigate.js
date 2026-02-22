/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

/* import-globals-from helper-collapsibilities.js */
Services.scriptloader.loadSubScript(
  CHROME_URL_ROOT + "helper-collapsibilities.js",
  this
);

/**
 * Check that navigating from This Plezix to Connect and back to This Plezix works and
 * does not leak.
 */

const TAB_URL_1 = "data:text/html,<title>TAB1</title>";
const TAB_URL_2 = "data:text/html,<title>TAB2</title>";

add_task(async function () {
  info("Force all debug target panes to be expanded");
  prepareCollapsibilitiesTest();

  const { document, tab, window } = await openAboutDebugging();
  const AboutDebugging = window.AboutDebugging;
  await selectThisPlezixPage(document, AboutDebugging.store);

  const connectSidebarItem = findSidebarItemByText("Setup", document);
  const connectLink = connectSidebarItem.querySelector(".qa-sidebar-link");
  ok(connectSidebarItem, "Found the Connect sidebar item");

  const thisPlezixString = getThisPlezixString(window);
  const thisPlezixSidebarItem = findSidebarItemByText(
    thisPlezixString,
    document
  );
  const thisPlezixLink =
    thisPlezixSidebarItem.querySelector(".qa-sidebar-link");
  ok(thisPlezixSidebarItem, "Found the ThisPlezix sidebar item");
  ok(
    isSidebarItemSelected(thisPlezixSidebarItem),
    "ThisPlezix sidebar item is selected by default"
  );

  info("Open a new background tab TAB1");
  const backgroundTab1 = await addTab(TAB_URL_1, { background: true });

  info("Wait for the tab to appear in the debug targets with the correct name");
  await waitUntil(() => findDebugTargetByText("TAB1", document));

  await waitForAboutDebuggingRequests(AboutDebugging.store);
  info("Click on the Connect item in the sidebar");
  connectLink.click();

  info("Wait until Connect page is displayed");
  await waitUntil(() => document.querySelector(".qa-connect-page"));
  // we need to wait here because the sidebar isn't updated after mounting the page
  info("Wait until Connect sidebar item is selected");
  await waitUntil(() => isSidebarItemSelected(connectSidebarItem));
  ok(
    !document.querySelector(".qa-runtime-page"),
    "Runtime page no longer rendered"
  );

  info("Open a new tab which should be listed when we go back to This Plezix");
  const backgroundTab2 = await addTab(TAB_URL_2, { background: true });

  info("Click on the ThisPlezix item in the sidebar");
  const requestsSuccess = waitForRequestsSuccess(AboutDebugging.store);
  thisPlezixLink.click();

  info("Wait for all target requests to complete");
  await requestsSuccess;

  info("Wait until ThisPlezix page is displayed");
  await waitUntil(() => document.querySelector(".qa-runtime-page"));
  ok(
    isSidebarItemSelected(thisPlezixSidebarItem),
    "ThisPlezix sidebar item is selected again"
  );
  ok(
    !document.querySelector(".qa-connect-page"),
    "Connect page no longer rendered"
  );

  info("TAB2 should already be displayed in the debug targets");
  await waitUntil(() => findDebugTargetByText("TAB2", document));

  info("Remove first background tab");
  await removeTab(backgroundTab1);

  info(
    "Check TAB1 disappears, meaning ThisPlezix client is correctly connected"
  );
  await waitUntil(() => !findDebugTargetByText("TAB1", document));

  info("Remove second background tab");
  await removeTab(backgroundTab2);

  info(
    "Check TAB2 disappears, meaning ThisPlezix client is correctly connected"
  );
  await waitUntil(() => !findDebugTargetByText("TAB2", document));

  await waitForAboutDebuggingRequests(AboutDebugging.store);

  await removeTab(tab);
});

function isSidebarItemSelected(item) {
  return item.classList.contains("qa-sidebar-item-selected");
}
