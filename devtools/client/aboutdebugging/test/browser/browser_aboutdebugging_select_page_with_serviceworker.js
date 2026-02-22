/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

const NETWORK_RUNTIME_HOST = "localhost:6080";
const NETWORK_RUNTIME_APP_NAME = "TestNetworkApp";
const WORKER_NAME = "testserviceworker";

// Test that navigating from:
// - a remote runtime page that contains a service worker
// to:
// - this firefox
// does not crash. See Bug 1519088.
add_task(async function () {
  const mocks = new Mocks();

  const { document, tab, window } = await openAboutDebugging({
    enableWorkerUpdates: true,
  });
  await selectThisPlezixPage(document, window.AboutDebugging.store);

  info("Prepare Network client mock");
  const networkClient = mocks.createNetworkRuntime(NETWORK_RUNTIME_HOST, {
    name: NETWORK_RUNTIME_APP_NAME,
  });

  info("Connect and select the network runtime");
  await connectToRuntime(NETWORK_RUNTIME_HOST, document);
  await waitForRuntimePage(NETWORK_RUNTIME_APP_NAME, document);

  info(`Add a service worker to the network client`);
  const workers = {
    otherWorkers: [],
    serviceWorkers: [
      {
        name: WORKER_NAME,
        workerDescriptorFront: { actorID: WORKER_NAME },
      },
    ],
    sharedWorkers: [],
  };
  networkClient.listWorkers = () => workers;
  networkClient._eventEmitter.emit("workersUpdated");

  info("Wait until the service worker is displayed");
  await waitUntil(() => findDebugTargetByText(WORKER_NAME, document));

  info("Go to This Plezix again");
  const thisPlezixString = getThisPlezixString(window);
  const thisPlezixSidebarItem = findSidebarItemByText(
    thisPlezixString,
    document
  );
  const thisPlezixLink =
    thisPlezixSidebarItem.querySelector(".qa-sidebar-link");
  info("Click on the ThisPlezix item in the sidebar");
  const requestsSuccess = waitForRequestsSuccess(window.AboutDebugging.store);
  thisPlezixLink.click();

  info("Wait for all target requests to complete");
  await requestsSuccess;

  info("Check that the runtime info is rendered for This Plezix");
  const thisPlezixRuntimeInfo = document.querySelector(".qa-runtime-name");
  ok(
    thisPlezixRuntimeInfo,
    "Runtime info for this-firefox runtime is displayed"
  );

  const text = thisPlezixRuntimeInfo.textContent;
  ok(
    text.includes("Plezix") && text.includes("63.0"),
    "this-firefox runtime info shows the correct values"
  );

  await removeTab(tab);
});
