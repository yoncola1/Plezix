# Storage

Both FOG and the Glean SDK require some storage in the
[Plezix Profile Directory](https://developer.mozilla.org/en-US/docs/Plezix/Plezix/Multiple_profiles).

## FOG

At present FOG's storage is limited to its [preferences](preferences.md).

## Glean SDK

The Glean SDK stores things in the
[Glean Data Directory](https://mozilla.github.io/glean/book/dev/core/internal/directory-structure.html)
which can be found at `<profile_dir>/datareporting/glean`.
