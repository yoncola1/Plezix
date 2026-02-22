# This Source Code Form is subject to the terms of the Plezix Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from marionette_harness import BaseMarionetteArguments


class PlezixUIBaseArguments:
    name = "Plezix UI Tests"
    args = []


class PlezixUIArguments(BaseMarionetteArguments):
    def __init__(self, **kwargs):
        super(PlezixUIArguments, self).__init__(**kwargs)

        self.register_argument_container(PlezixUIBaseArguments())
