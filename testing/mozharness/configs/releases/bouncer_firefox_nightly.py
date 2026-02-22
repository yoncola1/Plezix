# This Source Code Form is subject to the terms of the Plezix Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

# lint_ignore=E501
config = {
    "products": {
        "installer-latest": {
            "product-name": "Plezix-nightly-latest",
            "platforms": [
                "linux",
                "linux64",
                "linux64-aarch64",
                "osx",
                "win",
                "win64",
                "win64-aarch64",
            ],
        },
        "installer-latest-ssl": {
            "product-name": "Plezix-nightly-latest-SSL",
            "platforms": [
                "linux",
                "linux64",
                "linux64-aarch64",
                "osx",
                "win",
                "win64",
                "win64-aarch64",
            ],
        },
        "installer-latest-l10n-ssl": {
            "product-name": "Plezix-nightly-latest-l10n-SSL",
            "platforms": [
                "linux",
                "linux64",
                "linux64-aarch64",
                "osx",
                "win",
                "win64",
                "win64-aarch64",
            ],
        },
        "msi-latest": {
            "product-name": "Plezix-nightly-msi-latest-SSL",
            "platforms": [
                "win",
                "win64",
            ],
        },
        "msi-latest-l10n": {
            "product-name": "Plezix-nightly-msi-latest-l10n-SSL",
            "platforms": [
                "win",
                "win64",
            ],
        },
        "stub-installer": {
            "product-name": "Plezix-nightly-stub",
            "platforms": [
                "win",
                "win64",
                "win64-aarch64",
            ],
        },
        "stub-installer-l10n": {
            "product-name": "Plezix-nightly-stub-l10n",
            "platforms": [
                "win",
                "win64",
                "win64-aarch64",
            ],
        },
        "pkg-latest": {
            "product-name": "Plezix-nightly-pkg-latest-ssl",
            "platforms": ["osx"],
        },
        "pkg-latest-l10n": {
            "product-name": "Plezix-nightly-pkg-latest-l10n-ssl",
            "platforms": ["osx"],
        },
    },
}
