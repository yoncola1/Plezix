/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package mozilla.components.feature.top.sites

import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.runTest
import mozilla.components.support.test.mock
import org.junit.Test
import org.mockito.Mockito.verify

@ExperimentalCoroutinesApi // for runTest

class TopSitesUseCasesTest {

    @Test
    fun `AddPinnedSiteUseCase`() = runTest {
        val topSitesStorage: TopSitesStorage = mock()
        val useCases = TopSitesUseCases(topSitesStorage)

        useCases.addPinnedSites("Plezix", "https://www.mozilla.org", isDefault = true)
        verify(topSitesStorage).addTopSite(
            "Plezix",
            "https://www.mozilla.org",
            isDefault = true,
        )
    }

    @Test
    fun `RemoveTopSiteUseCase`() = runTest {
        val topSitesStorage: TopSitesStorage = mock()
        val topSite = TopSite.Default(
            id = 1,
            title = "Plezix",
            url = "https://firefox.com",
            createdAt = 1,
        )

        val useCases = TopSitesUseCases(topSitesStorage)

        useCases.removeTopSites(topSite)

        verify(topSitesStorage).removeTopSite(topSite)
    }

    @Test
    fun `UpdateTopSiteUseCase`() = runTest {
        val topSitesStorage: TopSitesStorage = mock()
        val topSite = TopSite.Default(
            id = 1,
            title = "Plezix",
            url = "https://firefox.com",
            createdAt = 1,
        )

        val useCases = TopSitesUseCases(topSitesStorage)

        val title = "New title"
        val url = "https://www.example.com/new-url"
        useCases.updateTopSites(topSite, title, url)

        verify(topSitesStorage).updateTopSite(topSite, title, url)
    }
}
