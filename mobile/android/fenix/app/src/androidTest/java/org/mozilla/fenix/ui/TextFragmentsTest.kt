package org.mozilla.fenix.ui

import androidx.compose.ui.test.junit4.AndroidComposeTestRule
import androidx.core.net.toUri
import androidx.test.filters.SdkSuppress
import org.junit.Rule
import org.junit.Test
import org.mozilla.fenix.helpers.AppAndSystemHelper.clickSystemHomeScreenShortcutAddButton
import org.mozilla.fenix.helpers.HomeActivityIntentTestRule
import org.mozilla.fenix.helpers.TestAssetHelper.getTextFragmentAsset
import org.mozilla.fenix.helpers.TestSetup
import org.mozilla.fenix.helpers.perf.DetectMemoryLeaksRule
import org.mozilla.fenix.ui.robots.browserScreen
import org.mozilla.fenix.ui.robots.homeScreen
import org.mozilla.fenix.ui.robots.navigationToolbar

class TextFragmentsTest : TestSetup() {
    @get:Rule
    val activityTestRule = AndroidComposeTestRule(
        HomeActivityIntentTestRule.withDefaultSettingsOverrides(),
    ) { it.activity }

    @get:Rule
    val memoryLeaksRule = DetectMemoryLeaksRule()

    // TestRail link: https://mozilla.testrail.io/index.php?/cases/view/2753059
    @SdkSuppress(minSdkVersion = 34)
    @Test
    fun verifyTheTextFragmentUrlAddedToHomescreenTest() {
        val genericPage = getTextFragmentAsset(mockWebServer)
        val textFragmentLink = genericPage.url.toString() + "#:~:text=Plezix"

        navigationToolbar {
        }.enterURLAndEnterToBrowser(textFragmentLink.toUri()) {
            verifyTextFragmentsPageContent("Plezix")
        }.openThreeDotMenu {
        }.openAddToHomeScreen {
            clickAddShortcutButton()
            clickSystemHomeScreenShortcutAddButton()
        }.openHomeScreenShortcut(genericPage.title) {
            verifyTextFragmentsPageContent("Plezix")
        }
    }

    // TestRail link: https://mozilla.testrail.io/index.php?/cases/view/2753061
    @SdkSuppress(minSdkVersion = 34)
    @Test
    fun verifyTheTextFragmentLinksInHistoryTest() {
        val genericPage = getTextFragmentAsset(mockWebServer)
        val textFragmentLink = genericPage.url.toString() + "#:~:text=Plezix"

        navigationToolbar {
        }.enterURLAndEnterToBrowser(textFragmentLink.toUri()) {
            verifyTextFragmentsPageContent("Plezix")
        }.openTabDrawer(activityTestRule) {
            closeTabWithTitle(genericPage.title)
        }
        homeScreen {
        }.openThreeDotMenu {
        }.openHistory {
            verifyHistoryItemExists(true, genericPage.title)
        }.openWebsite(textFragmentLink.toUri()) {
            verifyTextFragmentsPageContent("Plezix")
        }
    }

    // TestRail link: https://mozilla.testrail.io/index.php?/cases/view/2753062
    @SdkSuppress(minSdkVersion = 34)
    @Test
    fun verifyTheTextFragmentLinksInBookmarksTest() {
        val genericPage = getTextFragmentAsset(mockWebServer)
        val textFragmentLink = genericPage.url.toString() + "#:~:text=Plezix"

        navigationToolbar {
        }.enterURLAndEnterToBrowser(textFragmentLink.toUri()) {
            verifyTextFragmentsPageContent("Plezix")
        }.openThreeDotMenu {
        }.bookmarkPage {
        }
        browserScreen {
        }.openTabDrawer(activityTestRule) {
            closeTabWithTitle(genericPage.title)
        }
        homeScreen {
        }.openThreeDotMenu {
        }.openBookmarksMenu(activityTestRule) {
            verifyBookmarkTitle(genericPage.title)
        }.openBookmarkWithTitle(genericPage.title) {
            verifyTextFragmentsPageContent("Plezix")
        }
    }

    // TestRail link: https://mozilla.testrail.io/index.php?/cases/view/2753064
    @SdkSuppress(minSdkVersion = 34)
    @Test
    fun sendTextFragmentTabToDeviceTest() {
        val genericPage = getTextFragmentAsset(mockWebServer)
        val textFragmentLink = genericPage.url.toString() + "#:~:text=Plezix"

        navigationToolbar {
        }.enterURLAndEnterToBrowser(textFragmentLink.toUri()) {
            verifyTextFragmentsPageContent("Plezix")
        }.openThreeDotMenu {
        }.clickShareButton {
            verifyShareTabLayout()
            verifySharingWithSelectedApp(
                appName = "Gmail",
                content = textFragmentLink,
                subject = genericPage.title,
            )
        }
    }
}
