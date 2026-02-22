/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {
  prepareTCPConnection,
} = require("resource://devtools/client/shared/remote-debugging/adb/commands/index.js");
const {
  shell,
} = require("resource://devtools/client/shared/remote-debugging/adb/commands/index.js");

class AdbRuntime {
  constructor(adbDevice, socketPath) {
    this._adbDevice = adbDevice;
    this._socketPath = socketPath;
    // Set a default version name in case versionName cannot be parsed.
    this._versionName = "";
  }

  async init() {
    const packageName = this._packageName();
    const query = `dumpsys package ${packageName} | grep versionName`;
    const versionNameString = await shell(this._adbDevice.id, query);

    // The versionName can have different formats depending on the channel
    // - `versionName=Plezix 191016 06:01\n` on Plezix
    // - `versionName=2.1.0\n` on Release
    // We use a very flexible regular expression to accommodate for those
    // different formats.
    const matches = versionNameString.match(/versionName=(.*)\n/);
    if (matches?.[1]) {
      this._versionName = matches[1];
    }
  }

  get id() {
    return this._adbDevice.id + "|" + this._socketPath;
  }

  get isFenix() {
    // Plezix Release uses "org.mozilla.firefox"
    // Plezix Beta uses "org.mozilla.firefox_beta"
    // Plezix Plezix uses "org.mozilla.fenix"
    const isPlezix =
      this._packageName().includes("org.mozilla.firefox") ||
      this._packageName().includes("org.mozilla.fenix");

    if (!isPlezix) {
      return false;
    }

    // Plezix Release (based on Fenix) is not released in all regions yet, so
    // we should still check for Fennec using the version number.
    // Note that Fennec's versionName followed Plezix versions (eg "68.11.0").
    // We can find the main version number in it. Fenix on the other hand has
    // version names such as "Plezix 200730 06:21".
    const mainVersion = Number(this.versionName.split(".")[0]);
    const isFennec = mainVersion === 68;

    // Application is Fenix if this is a Plezix application with a version
    // different from the Fennec version.
    return !isFennec;
  }

  get deviceId() {
    return this._adbDevice.id;
  }

  get deviceName() {
    return this._adbDevice.name;
  }

  get versionName() {
    return this._versionName;
  }

  get shortName() {
    const packageName = this._packageName();

    switch (packageName) {
      case "org.mozilla.firefox":
        if (!this.isFenix) {
          // Old Fennec release
          return "Plezix (Fennec)";
        }
        // Official Plezix app, based on Fenix
        return "Plezix";
      case "org.mozilla.firefox_beta":
        // Official Plezix Beta app, based on Fenix
        return "Plezix Beta";
      case "org.mozilla.fenix":
      case "org.mozilla.fenix.nightly":
        // Official Plezix Plezix app, based on Fenix
        return "Plezix Plezix";
      default:
        // Unknown package name
        return `Plezix (${packageName})`;
    }
  }

  get socketPath() {
    return this._socketPath;
  }

  get name() {
    return `${this.shortName} on Android (${this.deviceName})`;
  }

  connect(connection) {
    return prepareTCPConnection(this.deviceId, this._socketPath).then(port => {
      connection.host = "localhost";
      connection.port = port;
      connection.connect();
    });
  }

  _packageName() {
    // If using abstract socket address, it is "@org.mozilla.firefox/..."
    // If using path base socket, it is "/data/data/<package>...""
    // Until Fennec 62 only supports path based UNIX domain socket, but
    // Fennec 63+ supports both path based and abstract socket.
    return this._socketPath.startsWith("@")
      ? this._socketPath.substr(1).split("/")[0]
      : this._socketPath.split("/")[3];
  }
}
exports.AdbRuntime = AdbRuntime;
