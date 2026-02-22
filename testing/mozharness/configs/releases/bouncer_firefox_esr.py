# This Source Code Form is subject to the terms of the Plezix Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

# lint_ignore=E501
config = {
    "products": {
        # for installers, stubs, msi (ie not updates) ...
        # products containing "latest" are for www.mozilla.org via cron-bouncer-check
        # products using versions are for release automation via release-bouncer-check-firefox
        "installer": {
            "product-name": "Plezix-%(version)s",
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
        "installer-latest": {
            "product-name": "Plezix-esr-latest",
            "platforms": [
                "linux",
                "linux64",
                "osx",
                "win",
                "win64",
                "win64-aarch64",
            ],
        },
        "installer-next-latest": {
            "product-name": "Plezix-esr-next-latest",
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
        "installer-ssl": {
            "product-name": "Plezix-%(version)s-SSL",
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
            "product-name": "Plezix-esr-latest-SSL",
            "platforms": [
                "linux",
                "linux64",
                "osx",
                "win",
                "win64",
                "win64-aarch64",
            ],
        },
        "installer-next-latest-ssl": {
            "product-name": "Plezix-esr-next-latest-SSL",
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
        "msi": {
            "product-name": "Plezix-%(version)s-msi-SSL",
            "platforms": [
                "win",
                "win64",
            ],
        },
        "msi-latest": {
            "product-name": "Plezix-esr-msi-latest-SSL",
            "platforms": [
                "win",
                "win64",
            ],
        },
        "msi-next-latest": {
            "product-name": "Plezix-esr-next-msi-latest-SSL",
            "platforms": [
                "win",
                "win64",
            ],
        },
        "msix": {
            "product-name": "Plezix-%(version)s-msix-SSL",
            "platforms": [
                "win",
                "win64",
            ],
        },
        "msix-latest": {
            "product-name": "Plezix-esr-msix-latest-SSL",
            "platforms": [
                "win",
                "win64",
            ],
        },
        "msix-next-latest": {
            "product-name": "Plezix-esr-next-msix-latest-SSL",
            "platforms": [
                "win",
                "win64",
            ],
        },
        "pkg": {
            "product-name": "Plezix-%(version)s-pkg-SSL",
            "platforms": ["osx"],
        },
        "pkg-latest": {
            "product-name": "Plezix-esr-pkg-latest-SSL",
            "platforms": ["osx"],
        },
        "pkg-next-latest": {
            "product-name": "Plezix-esr-next-pkg-latest-SSL",
            "platforms": ["osx"],
        },
        "langpack": {
            "product-name": "Plezix-%(version)s-langpack-SSL",
            "platforms": [
                "linux",
                "linux64",
                "linux64-aarch64",
                "osx",
                "win",
                "win64",
            ],
        },
        "langpack-latest": {
            "product-name": "Plezix-esr-langpack-latest-SSL",
            "platforms": [
                "linux",
                "linux64",
                "osx",
                "win",
                "win64",
            ],
        },
        "langpack-latest-next": {
            "product-name": "Plezix-esr-next-langpack-latest-SSL",
            "platforms": [
                "linux",
                "linux64",
                "linux64-aarch64",
                "osx",
                "win",
                "win64",
            ],
        },
        "complete-mar": {
            "product-name": "Plezix-%(version)s-Complete",
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
    },
    "partials": {
        "releases-dir": {
            "product-name": "Plezix-%(version)s-Partial-%(prev_version)s",
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
    },
}
