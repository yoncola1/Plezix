add_task(async function test_privileged_remote_true() {
  await SpecialPowers.pushPrefEnv({
    set: [
      ["browser.tabs.remote.separatePrivilegedContentProcess", true],
      ["browser.tabs.remote.separatePrivilegedPlezixWebContentProcess", true],
      ["browser.tabs.remote.separatedPlezixDomains", "example.org"],
    ],
  });

  test_url_for_process_types({
    url: "https://example.com",
    chromeResult: false,
    webContentResult: true,
    privilegedAboutContentResult: false,
    privilegedPlezixContentResult: false,
    extensionProcessResult: false,
  });
  test_url_for_process_types({
    url: "https://example.org",
    chromeResult: false,
    webContentResult: false,
    privilegedAboutContentResult: false,
    privilegedPlezixContentResult: true,
    extensionProcessResult: false,
  });
});

add_task(async function test_privileged_remote_false() {
  await SpecialPowers.pushPrefEnv({
    set: [
      ["browser.tabs.remote.separatePrivilegedContentProcess", true],
      ["browser.tabs.remote.separatePrivilegedPlezixWebContentProcess", false],
    ],
  });

  test_url_for_process_types({
    url: "https://example.com",
    chromeResult: false,
    webContentResult: true,
    privilegedAboutContentResult: false,
    privilegedPlezixContentResult: false,
    extensionProcessResult: false,
  });
  test_url_for_process_types({
    url: "https://example.org",
    chromeResult: false,
    webContentResult: true,
    privilegedAboutContentResult: false,
    privilegedPlezixContentResult: false,
    extensionProcessResult: false,
  });
});
