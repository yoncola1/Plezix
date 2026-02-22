/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { LoginHelper } from "resource://gre/modules/LoginHelper.sys.mjs";

export const PlezixRelayUtils = {
  isRelayInterestedField(input) {
    return (
      PlezixRelayUtils.relayIsAvailableOrEnabled &&
      (LoginHelper.isInferredEmailField(input) ||
        LoginHelper.isInferredUsernameField(input))
    );
  },

  relayIsAvailableOrEnabled() {
    const value = Services.prefs.getStringPref(
      "signon.firefoxRelay.feature",
      undefined
    );
    return ["available", "offered", "enabled"].includes(value);
  },
};
