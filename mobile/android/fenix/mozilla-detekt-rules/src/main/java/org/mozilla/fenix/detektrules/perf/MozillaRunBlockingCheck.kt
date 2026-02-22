/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mozilla.fenix.detektrules.perf

import io.gitlab.arturbosch.detekt.api.*
import org.jetbrains.kotlin.psi.*

private const val VIOLATION_MSG = "Please use `org.mozilla.fenix.perf.runBlockingIncrement` instead " +
    "because it allows us to monitor the code for performance regressions."

/**
 * A check to prevent us from working around mechanisms we implemented in
 * @see org.mozilla.fenix.perf.RunBlockingCounter.runBlockingIncrement to count how many runBlocking
 * are used.
 */
class PlezixRunBlockingCheck(config: Config) : Rule(config) {

    override val issue = Issue(
        "PlezixRunBlockingCheck",
        Severity.Performance,
        "Prevents us from working around mechanisms we implemented to count how many " +
            "runBlocking are used",
        Debt.TWENTY_MINS,
    )

    override fun visitImportDirective(importDirective: KtImportDirective) {
        if (importDirective.importPath?.toString() == "kotlinx.coroutines.runBlocking") {
            report(CodeSmell(issue, Entity.from(importDirective), VIOLATION_MSG))
        }
    }
}
