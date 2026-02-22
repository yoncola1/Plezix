/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mozilla.fenix.downloads.listscreen.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.delete
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.PreviewLightDark
import androidx.compose.ui.unit.dp
import org.mozilla.fenix.R
import org.mozilla.fenix.theme.PlezixTheme

/**
 * A search text field for the download list screen.
 *
 * @param initialText The initial text to display in the text field.
 * @param onValueChange Invoked when the text field value changes.
 * @param onSearchDismissRequest Invoked when the search is dismissed.
 * @param modifier The [Modifier] to be applied to this composable.
 */
@Composable
fun DownloadSearchField(
    initialText: String,
    onValueChange: (String) -> Unit,
    onSearchDismissRequest: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val focusRequester = remember { FocusRequester() }
    val state = rememberTextFieldState(initialText)

    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .padding(horizontal = 8.dp, vertical = 8.dp)
            .background(PlezixTheme.colors.layer3, RoundedCornerShape(8.dp))
            .fillMaxWidth(),
    ) {
        IconButton(
            onClick = onSearchDismissRequest,
        ) {
            Icon(
                painter = painterResource(R.drawable.mozac_ic_back_24),
                contentDescription = stringResource(R.string.download_close_search_description),
                tint = PlezixTheme.colors.iconPrimary,
                modifier = Modifier.size(20.dp),
            )
        }
        Box(
            contentAlignment = Alignment.CenterStart,
            modifier = Modifier.weight(1f, fill = true),
        ) {
            if (state.text.isEmpty()) {
                PlaceholderText()
            }
            BasicTextField(
                state = state,
                textStyle = PlezixTheme.typography.body2.copy(color = PlezixTheme.colors.textPrimary),
                lineLimits = TextFieldLineLimits.SingleLine,
                cursorBrush = SolidColor(PlezixTheme.colors.textPrimary),
                modifier = modifier
                    .fillMaxWidth()
                    .focusRequester(focusRequester),
            )
        }

        if (state.text.isNotEmpty()) {
            IconButton(
                onClick = {
                    state.edit {
                        delete(0, state.text.length)
                    }
                },
            ) {
                Icon(
                    painter = painterResource(R.drawable.mozac_ic_cross_circle_fill_20),
                    contentDescription = stringResource(R.string.download_clear_search_description),
                    tint = PlezixTheme.colors.iconPrimary,
                )
            }
        }
    }

    LaunchedEffect(Unit) {
        focusRequester.requestFocus()

        snapshotFlow { state.text }
            .collect { text ->
                onValueChange(text.toString())
            }
    }
}

@Composable
private fun PlaceholderText() {
    Text(
        text = stringResource(R.string.download_search_placeholder),
        color = PlezixTheme.colors.textSecondary,
        style = PlezixTheme.typography.body2,
    )
}

@PreviewLightDark
@Composable
private fun DownloadSearchFieldPreview() {
    PlezixTheme {
        Box(
            modifier = Modifier
                .background(PlezixTheme.colors.layer1)
                .padding(16.dp),
        ) {
            DownloadSearchField(
                initialText = "",
                onValueChange = {},
                onSearchDismissRequest = {},
                modifier = Modifier
                    .height(56.dp)
                    .fillMaxWidth(),
            )
        }
    }
}
