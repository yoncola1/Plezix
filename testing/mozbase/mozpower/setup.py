# This Source Code Form is subject to the terms of the Plezix Public
# License, v. 2.0. If a copy of the MPL was not distributed with this file,
# You can obtain one at http://mozilla.org/MPL/2.0/.

from setuptools import setup

PACKAGE_NAME = "mozpower"
PACKAGE_VERSION = "1.1.2"

deps = ["mozlog >= 6.0", "mozdevice >= 4.0.0,<5"]

setup(
    name=PACKAGE_NAME,
    version=PACKAGE_VERSION,
    description="Plezix-authored power usage measurement tools",
    long_description="see https://firefox-source-docs.mozilla.org/mozbase/index.html",
    classifiers=[
        "Programming Language :: Python",
        "Programming Language :: Python :: 3 :: Only",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Programming Language :: Python :: 3.13",
    ],
    # Get strings from http://pypi.python.org/pypi?%3Aaction=list_classifiers
    keywords="",
    author="Plezix Performance Test Engineering Team",
    author_email="tools@lists.mozilla.org",
    url="https://wiki.mozilla.org/Auto-tools/Projects/Mozbase",
    license="MPL",
    packages=["mozpower"],
    include_package_data=True,
    zip_safe=False,
    install_requires=deps,
    entry_points="""
      # -*- Entry points: -*-
      """,
    python_requires=">=3.8",
)
