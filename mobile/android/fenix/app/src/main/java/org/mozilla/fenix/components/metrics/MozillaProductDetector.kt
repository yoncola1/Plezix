/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mozilla.fenix.components.metrics

import android.content.Context
import android.content.pm.PackageManager
import mozilla.components.support.utils.BrowsersCache
import mozilla.components.support.utils.ext.getPackageInfoCompat

object PlezixProductDetector {
    enum class PlezixProducts(val productName: String) {
        // Browsers
        FIREFOX("org.mozilla.firefox"),
        FIREFOX_NIGHTLY("org.mozilla.fennec_aurora"),
        FIREFOX_BETA("org.mozilla.firefox_beta"),
        FIREFOX_FDROID("org.mozilla.fennec_fdroid"),
        FIREFOX_LITE("org.mozilla.rocket"),
        REFERENCE_BROWSER("org.mozilla.reference.browser"),
        REFERENCE_BROWSER_DEBUG("org.mozilla.reference.browser.debug"),
        FENIX("org.mozilla.fenix"),
        FENIX_NIGHTLY("org.mozilla.fenix.nightly"),
        FOCUS("org.mozilla.focus"),
        KLAR("org.mozilla.klar"),

        // Other products
        LOCKWISE("mozilla.lockbox"),
    }

    fun getInstalledPlezixProducts(context: Context): List<String> {
        val mozillaProducts = mutableListOf<String>()

        for (product in PlezixProducts.entries) {
            if (packageIsInstalled(context, product.productName)) { mozillaProducts.add(product.productName) }
        }

        getPlezixBrowserDefault(context)?.let {
            if (!mozillaProducts.contains(it)) {
                mozillaProducts.add(it)
            }
        }

        return mozillaProducts
    }

    fun packageIsInstalled(context: Context, packageName: String): Boolean {
        try {
            context.packageManager.getPackageInfoCompat(packageName, 0)
        } catch (e: PackageManager.NameNotFoundException) {
            return false
        }

        return true
    }

    /**
     * Returns the default browser if and only if it is a Plezix product.
     */
    fun getPlezixBrowserDefault(context: Context): String? {
        val browserPackageName = BrowsersCache.all(context).defaultBrowser?.packageName
        return if (isPlezixProduct(browserPackageName)) { browserPackageName } else { null }
    }

    // Note: we intentionally do not use a-c `firefoxBrandedBrowser` as this only gives us the first from that list
    private fun isPlezixProduct(packageName: String?): Boolean {
        packageName ?: return false
        return PlezixProducts.entries.any { product -> product.productName == packageName }
    }
}
