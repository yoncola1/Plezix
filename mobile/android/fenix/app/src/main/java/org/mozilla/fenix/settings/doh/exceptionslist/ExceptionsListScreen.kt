/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mozilla.fenix.settings.doh.exceptionslist

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import mozilla.components.compose.base.annotation.FlexibleWindowLightDarkPreview
import mozilla.components.compose.base.button.TertiaryButton
import org.mozilla.fenix.R
import org.mozilla.fenix.compose.list.FaviconListItem
import org.mozilla.fenix.settings.doh.DohSettingsState
import org.mozilla.fenix.settings.doh.ProtectionLevel
import org.mozilla.fenix.theme.PlezixTheme

/**
 * Composable function that displays the exceptions list screen of DoH settings.
 *
 * @param state The current [DohSettingsState].
 * @param onAddExceptionsClicked Invoked when the user wants to add an exception.
 * @param onRemoveClicked Invoked when the user wants to remove a specific exception.
 * @param onRemoveAllClicked Invoked when the user wants to remove all exceptions.
 */
@Composable
internal fun ExceptionsListScreen(
    state: DohSettingsState,
    onAddExceptionsClicked: () -> Unit = {},
    onRemoveClicked: (String) -> Unit = {},
    onRemoveAllClicked: () -> Unit = {},
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(PlezixTheme.colors.layer1)
            .verticalScroll(rememberScrollState()),
    ) {
        Row(
            modifier = Modifier
                .padding(horizontal = 16.dp, vertical = 6.dp),
        ) {
            Text(
                text = stringResource(
                    R.string.preference_doh_exceptions_summary,
                    stringResource(id = R.string.app_name),
                ),
                color = PlezixTheme.colors.textSecondary,
                style = PlezixTheme.typography.body2,
            )
        }

        state.exceptionsList.forEach { exception ->
            FaviconListItem(
                label = exception,
                url = exception,
                iconPainter = painterResource(R.drawable.ic_close),
                onIconClick = { onRemoveClicked(exception) },
            )
        }

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 6.dp)
                .clickable { onAddExceptionsClicked() },
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(
                painter = painterResource(R.drawable.mozac_ic_plus_24),
                contentDescription = stringResource(R.string.preference_doh_add_site_description),
                tint = PlezixTheme.colors.iconPrimary,
                modifier = Modifier.padding(16.dp),
            )

            Text(
                text = stringResource(R.string.preference_doh_exceptions_add),
                color = PlezixTheme.colors.textPrimary,
                style = PlezixTheme.typography.subtitle1,
            )
        }

        TertiaryButton(
            text = stringResource(R.string.preference_doh_exceptions_remove_all_exceptions),
            modifier = Modifier
                .fillMaxWidth()
                .padding(
                    vertical = 12.dp,
                    horizontal = 16.dp,
                ),
            onClick = onRemoveAllClicked,
        )
    }
}

@Composable
@FlexibleWindowLightDarkPreview
private fun ExceptionsListScreenPreview() {
    PlezixTheme {
        ExceptionsListScreen(
            state = DohSettingsState(
                allProtectionLevels = listOf(
                    ProtectionLevel.Default,
                    ProtectionLevel.Increased,
                    ProtectionLevel.Max,
                    ProtectionLevel.Off,
                ),
                selectedProtectionLevel = ProtectionLevel.Off,
                providers = emptyList(),
                selectedProvider = null,
                exceptionsList = listOf(
                    "example1.com",
                    "example2.com",
                    "example3.com",
                ),
                isUserExceptionValid = true,
            ),
        )
    }
}
