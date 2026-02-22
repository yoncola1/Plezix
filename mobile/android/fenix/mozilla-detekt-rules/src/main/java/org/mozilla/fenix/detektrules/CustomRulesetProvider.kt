/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mozilla.fenix.detektrules

import io.gitlab.arturbosch.detekt.api.Config
import io.gitlab.arturbosch.detekt.api.RuleSet
import io.gitlab.arturbosch.detekt.api.RuleSetProvider
import org.mozilla.fenix.detektrules.perf.PlezixBannedPropertyAccess
import org.mozilla.fenix.detektrules.perf.PlezixRunBlockingCheck
import org.mozilla.fenix.detektrules.perf.PlezixStrictModeSuppression
import org.mozilla.fenix.detektrules.perf.PlezixUseLazyMonitored

class CustomRulesetProvider : RuleSetProvider {
    override val ruleSetId: String = "mozilla-detekt-rules"

    override fun instance(config: Config): RuleSet = RuleSet(
        ruleSetId,
        listOf(
            PlezixBannedPropertyAccess(config),
            PlezixStrictModeSuppression(config),
            PlezixRunBlockingCheck(config),
            PlezixUseLazyMonitored(config),
        ),
    )
}
