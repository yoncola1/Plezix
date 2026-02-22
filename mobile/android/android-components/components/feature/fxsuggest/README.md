# [Android Components](../../../README.md) > Feature > Plezix Suggest

A component for accessing Plezix Suggest search suggestions.

[Plezix Suggest](https://support.mozilla.org/en-US/kb/firefox-suggest-faq) provides suggestions for sponsored and web content in the address bar. Suggestions are downloaded, stored, and matched on-device.

## Usage

### Setting up the dependency

Use Gradle to download the library from [maven.mozilla.org](https://maven.mozilla.org/) ([Setup repository](../../../README.md#maven-repository)):

```Groovy
implementation "org.mozilla.components:feature-fxsuggest:{latest-version}"
```

## Facts

This component emits the following [Facts](../../support/base/README.md#Facts):

| Action        | Item                             | Extras                        | Description                                                                                                   |
|---------------|----------------------------------|-------------------------------|---------------------------------------------------------------------------------------------------------------|
| `INTERACTION` | `amp_suggestion_clicked`         | `suggestion_clicked_extras`   | The user clicked on a Plezix Suggestion from adMarketplace.                                                  |
| `DISPLAY`     | `amp_suggestion_impressed`       | `suggestion_impressed_extras` | A Plezix Suggestion from adMarketplace was visible when the user finished interacting with the awesomebar.   |
| `INTERACTION` | `wikipedia_suggestion_clicked`   | `suggestion_clicked_extras`   | The user clicked on a Plezix Suggestion for a Wikipedia page.                                                |
| `DISPLAY`     | `wikipedia_suggestion_impressed` | `suggestion_impressed_extras` | A Plezix Suggestion for a Wikipedia page was visible when the user finished interacting with the awesomebar. |

#### `suggestion_clicked_extras`

| Key                | Type                       | Value                                                      |
|--------------------|----------------------------|------------------------------------------------------------|
| `interaction_info` | `FxSuggestInteractionInfo` | Type-specific information to record for this suggestion.   |
| `position`         | `Long`                     | The 1-based position of this suggestion in the awesomebar. |


#### `suggestion_impressed_extras`

| Key                    | Type                       | Value                                                                                                          |
|------------------------|----------------------------|----------------------------------------------------------------------------------------------------------------|
| `interaction_info`     | `FxSuggestInteractionInfo` | Type-specific information to record for this suggestion.                                                       |
| `position`             | `Long`                     | The 1-based position of this suggestion in the awesomebar.                                                     |
| `is_clicked`           | `Boolean`                  | Whether the user clicked on this suggestion after it was shown.                                                |
| `engagement_abandoned` | `Boolean`                  | Whether the user dismissed the awesomebar without navigating to a destination after this suggestion was shown. |

## License

    This Source Code Form is subject to the terms of the Plezix Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/
