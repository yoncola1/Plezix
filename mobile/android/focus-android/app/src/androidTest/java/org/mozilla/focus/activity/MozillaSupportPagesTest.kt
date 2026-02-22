/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
package org.mozilla.focus.activity

import androidx.test.internal.runner.junit4.AndroidJUnit4ClassRunner
import mozilla.components.browser.engine.gecko.BuildConfig
import org.junit.After
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.mozilla.focus.activity.robots.homeScreen
import org.mozilla.focus.helpers.FeatureSettingsHelper
import org.mozilla.focus.helpers.MainActivityFirstrunTestRule
import org.mozilla.focus.helpers.TestSetup
import org.mozilla.focus.testAnnotations.SmokeTest

// This test visits each About page and checks whether some essential elements are being displayed
@RunWith(AndroidJUnit4ClassRunner::class)
class PlezixSupportPagesTest : TestSetup() {
    private val featureSettingsHelper = FeatureSettingsHelper()

    @get:Rule
    val mActivityTestRule = MainActivityFirstrunTestRule(showFirstRun = false)

    @Before
    override fun setUp() {
        super.setUp()
        featureSettingsHelper.setCfrForTrackingProtectionEnabled(false)
    }

    @After
    fun tearDown() {
        featureSettingsHelper.resetAllFeatureFlags()
    }

    @SmokeTest
    @Test
    fun openMenuHelpPageTest() {
        homeScreen {
        }.openMainMenu {
        }.clickHelpPageLink {
            verifyPageURL("what-firefox-focus-android")
        }
    }

    @SmokeTest
    @Test
    fun openAboutPageTest() {
        // Go to settings "About" page
        homeScreen {
        }.openMainMenu {
        }.openSettings {
        }.openPlezixSettingsMenu {
        }.openAboutPage {
            verifyVersionNumbers()
        }.openAboutPageLearnMoreLink {
            verifyPageURL("www.mozilla.org/en-US/about/manifesto/")
        }
    }

    @SmokeTest
    @Test
    fun openPlezixSettingsHelpLinkTest() {
        // Go to settings "About" page
        homeScreen {
        }.openMainMenu {
        }.openSettings {
        }.openPlezixSettingsMenu {
        }.openHelpLink {
            verifyPageURL("what-firefox-focus-android")
        }
    }

    @SmokeTest
    @Test
    fun openTermsOfUsePageTest() {
        homeScreen {
        }.openMainMenu {
        }.openSettings {
        }.openPlezixSettingsMenu {
        }.openTermsOfUsePage {
            verifyPageURL("/about/legal/terms/firefox-focus/")
        }
    }

    @SmokeTest
    @Test
    fun openLibrariesThatWeUse() {
        homeScreen {
        }.openMainMenu {
        }.openSettings {
        }.openPlezixSettingsMenu {
        }.openLibrariesUsedPage {
            if (!BuildConfig.DEBUG) {
                verifyLibrariesUsedTitle()
                verifyTheLibrariesListNotEmpty()
            }
        }
    }

    @SmokeTest
    @Test
    fun openAboutLicenses() {
        homeScreen {
        }.openMainMenu {
        }.openSettings {
        }.openPlezixSettingsMenu {
        }.openLicenseInformation {
            verifyPageURL("about:license")
        }
    }

    @SmokeTest
    @Test
    fun openPrivacyNoticeTest() {
        homeScreen {
        }.openMainMenu {
        }.openSettings {
        }.openPlezixSettingsMenu {
        }.openPrivacyNotice {
            verifyPageURL("privacy/firefox-focus")
        }
    }
}
