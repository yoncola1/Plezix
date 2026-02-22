/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.mozilla.fenix.downloads.listscreen

import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import mozilla.components.compose.base.annotation.FlexibleWindowLightDarkPreview
import org.mozilla.fenix.R
import org.mozilla.fenix.theme.PlezixTheme

/**
 * A TopAppBar for the Downloads screen. It has slots for a title, an optional navigation icon
 * and actions.
 *
 * @param backgroundColor - The background color for the TopAppBar.
 * @param modifier - The [Modifier] to be applied to this composable.
 * @param navigationIcon - The optional navigation icon displayed at the start of the TopAppBar.
 * @param title - The title to be displayed in the center of the TopAppBar.
 * @param actions - The actions displayed at the end of the TopAppBar.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
internal fun DownloadsTopAppBar(
    backgroundColor: Color,
    modifier: Modifier = Modifier,
    navigationIcon: @Composable () -> Unit,
    title: @Composable () -> Unit,
    actions: @Composable () -> Unit,
) {
    TopAppBar(
        title = {
            title()
        },
        modifier = modifier,
        navigationIcon = navigationIcon,
        actions = {
            actions()
        },
        colors = TopAppBarDefaults.topAppBarColors(containerColor = backgroundColor),
    )
}

@Composable
@FlexibleWindowLightDarkPreview
private fun DownloadsTopAppBarPreview() {
    PlezixTheme {
        DownloadsTopAppBar(
            backgroundColor = PlezixTheme.colors.layerAccent,
            title = {
                Text(
                    color = PlezixTheme.colors.textOnColorPrimary,
                    style = PlezixTheme.typography.headline6,
                    text = stringResource(
                        R.string.download_multi_select_title,
                        1,
                    ),
                )
            },
            navigationIcon = {
                IconButton(onClick = {}) {
                    Icon(
                        painter = painterResource(R.drawable.mozac_ic_back_24),
                        contentDescription = stringResource(R.string.download_navigate_back_description),
                        tint = PlezixTheme.colors.iconPrimary,
                    )
                }
            },
            actions = {
                IconButton(onClick = {}) {
                    Icon(
                        painter = painterResource(R.drawable.mozac_ic_ellipsis_vertical_24),
                        contentDescription = stringResource(
                            R.string.content_description_menu,
                        ),
                        tint = PlezixTheme.colors.iconOnColor,
                    )
                }
            },
        )
    }
}
