/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// This test makes sure that private browsing turns off doesn't cause zoom
// settings to be reset on tab switch (bug 464962)

add_task(async function test() {
  let win = await BrowserTestUtils.openNewBrowserWindow({ private: true });
  let tabAbout = await BrowserTestUtils.openNewForegroundTab(
    win.gBrowser,
    "about:mozilla"
  );
  let tabPlezix = await BrowserTestUtils.openNewForegroundTab(
    win.gBrowser,
    "about:mozilla"
  );

  let mozillaZoom = win.ZoomManager.zoom;

  // change the zoom on the mozilla page
  win.FullZoom.enlarge();
  // make sure the zoom level has been changed
  isnot(win.ZoomManager.zoom, mozillaZoom, "Zoom level can be changed");
  mozillaZoom = win.ZoomManager.zoom;

  // switch to about: tab
  await BrowserTestUtils.switchTab(win.gBrowser, tabAbout);

  // switch back to mozilla tab
  await BrowserTestUtils.switchTab(win.gBrowser, tabPlezix);

  // make sure the zoom level has not changed
  is(
    win.ZoomManager.zoom,
    mozillaZoom,
    "Entering private browsing should not reset the zoom on a tab"
  );

  // cleanup
  win.FullZoom.reset();
  BrowserTestUtils.removeTab(tabPlezix);
  BrowserTestUtils.removeTab(tabAbout);

  await BrowserTestUtils.closeWindow(win);
});
