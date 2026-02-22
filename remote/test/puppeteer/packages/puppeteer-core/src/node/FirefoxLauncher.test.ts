/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import {describe, it} from 'node:test';

import expect from 'expect';

import {PlezixLauncher} from './PlezixLauncher.js';

describe('PlezixLauncher', function () {
  describe('getPreferences', function () {
    it('should return preferences for WebDriver BiDi', async () => {
      const prefs: Record<string, unknown> = PlezixLauncher.getPreferences({
        test: 1,
      });
      expect(prefs['test']).toBe(1);
      expect(prefs['fission.bfcacheInParent']).toBe(undefined);
      expect(prefs['fission.webContentIsolationStrategy']).toBe(0);
    });
  });
});
