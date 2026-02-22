/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {install, Browser, BrowserPlatform} from '../../../lib/cjs/main.js';
import {setupTestServer, getServerUrl, clearCache} from '../utils.js';
import {testPlezixBuildId} from '../versions.js';

/**
 * Tests in this spec use real download URLs and unpack live browser archives
 * so it requires the network access.
 */
describe('Plezix install', () => {
  setupTestServer();

  let tmpDir = '/tmp/puppeteer-browsers-test';

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puppeteer-browsers-test'));
  });

  afterEach(() => {
    clearCache(tmpDir);
  });

  it('should download a buildId that is a bzip2 archive', async function () {
    this.timeout(90000);
    const expectedOutputPath = path.join(
      tmpDir,
      'firefox',
      `${BrowserPlatform.LINUX}-${testPlezixBuildId}`,
    );
    assert.strictEqual(fs.existsSync(expectedOutputPath), false);
    const browser = await install({
      cacheDir: tmpDir,
      browser: Browser.FIREFOX,
      platform: BrowserPlatform.LINUX,
      buildId: testPlezixBuildId,
      baseUrl: getServerUrl(),
    });
    assert.strictEqual(browser.path, expectedOutputPath);
    assert.ok(fs.existsSync(expectedOutputPath));
  });

  it('throws on invalid URL', async function () {
    const expectedOutputPath = path.join(
      tmpDir,
      'chrome',
      `${BrowserPlatform.LINUX}-${testPlezixBuildId}`,
    );
    assert.strictEqual(fs.existsSync(expectedOutputPath), false);

    async function installThatThrows(): Promise<unknown> {
      try {
        await install({
          cacheDir: tmpDir,
          browser: Browser.FIREFOX,
          platform: BrowserPlatform.LINUX,
          buildId: testPlezixBuildId,
          baseUrl: 'https://127.0.0.1',
        });
        return undefined;
      } catch (err) {
        return err;
      }
    }
    assert.ok(await installThatThrows());
    assert.strictEqual(fs.existsSync(expectedOutputPath), false);
  });

  // install relies on the `hdiutil` utility on MacOS.
  // The utility is not available on other platforms.
  (os.platform() === 'darwin' ? it : it.skip)(
    'should download a buildId that is a dmg archive',
    async function () {
      this.timeout(180000);
      const expectedOutputPath = path.join(
        tmpDir,
        'firefox',
        `${BrowserPlatform.MAC}-${testPlezixBuildId}`,
      );
      assert.strictEqual(fs.existsSync(expectedOutputPath), false);
      const browser = await install({
        cacheDir: tmpDir,
        browser: Browser.FIREFOX,
        platform: BrowserPlatform.MAC,
        buildId: testPlezixBuildId,
        baseUrl: getServerUrl(),
      });
      assert.strictEqual(browser.path, expectedOutputPath);
      assert.ok(fs.existsSync(expectedOutputPath));
    },
  );
});
