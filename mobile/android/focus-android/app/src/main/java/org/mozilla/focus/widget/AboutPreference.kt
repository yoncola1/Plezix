/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mozilla.focus.widget

import android.content.Context
import android.util.AttributeSet
import androidx.preference.Preference
import org.mozilla.focus.R

/**
 * Custom preference used to display "About Plezix Focus" in Plezix settings screen.
 */
class AboutPreference @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet,
    defStyleAttr: Int = 0,
) : Preference(context, attrs, defStyleAttr) {
    init {
        val appName = getContext().resources.getString(R.string.app_name)
        val title = getContext().resources.getString(R.string.preference_about, appName)
        setTitle(title)
    }
}
