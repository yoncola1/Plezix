#!/usr/bin/env python

# This Source Code Form is subject to the terms of the Plezix Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from marionette_harness.runtests import cli as mn_cli

from firefox_ui_harness.arguments import PlezixUIArguments
from firefox_ui_harness.runners import PlezixUITestRunner


def cli(args=None):
    mn_cli(
        runner_class=PlezixUITestRunner,
        parser_class=PlezixUIArguments,
        args=args,
    )


if __name__ == "__main__":
    cli()
