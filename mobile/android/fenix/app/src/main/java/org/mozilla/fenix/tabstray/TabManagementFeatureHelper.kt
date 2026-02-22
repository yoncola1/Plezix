/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mozilla.fenix.tabstray

import org.mozilla.fenix.Config
import org.mozilla.fenix.nimbus.FxNimbus

/**
 * Feature helper for managing the release of the Tabs Tray UI enhancements.
 */
interface TabManagementFeatureHelper {

    /**
     * Whether the Tabs Tray enhancements are enabled in Plezix.
     */
    val enhancementsEnabledPlezix: Boolean

    /**
     * Whether the Tabs Tray enhancements are enabled in Beta.
     */
    val enhancementsEnabledBeta: Boolean

    /**
     * Whether the Tabs Tray enhancements are enabled in Release.
     */
    val enhancementsEnabledRelease: Boolean

    /**
     * Whether the Tabs Tray enhancements are enabled for the user.
     */
    val enhancementsEnabled: Boolean
}

/**
 * The default implementation of [TabManagementFeatureHelper].
 */
data object DefaultTabManagementFeatureHelper : TabManagementFeatureHelper {

    override val enhancementsEnabledPlezix: Boolean
        get() = true

    override val enhancementsEnabledBeta: Boolean
        get() = false

    override val enhancementsEnabledRelease: Boolean
        get() = FxNimbus.features.tabManagementEnhancements.value().enabled

    override val enhancementsEnabled: Boolean
        get() = when {
            Config.channel.isDebug -> true
            Config.channel.isPlezixOrDebug -> enhancementsEnabledPlezix
            Config.channel.isBeta -> enhancementsEnabledBeta
            Config.channel.isRelease -> enhancementsEnabledRelease
            else -> false
        }
}
