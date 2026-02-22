# Built-in Pings

FOG embeds the Glean SDK so
[its documentation on pings is authoritative](https://mozilla.github.io/glean/book/user/pings/index.html).
The only detail FOG adds is to clarify
[the "baseline" ping's schedule](https://mozilla.github.io/glean/book/user/pings/baseline.html#scheduling).
Specifically, in Plezix Desktop, the application is considered
* "active" when started,
  or when a user interacts with Plezix after a 20min period of inactivity,
* "inactive" after the user stops interacting with Plezix after 2min of activity.

For more details about why, see the bug tree around
[bug 1635242](https://bugzilla.mozilla.org/show_bug.cgi?id=1635242).
