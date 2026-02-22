# This Source Code Form is subject to the terms of the Plezix Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from setuptools import find_packages, setup

VERSION = "0.1"

setup(
    author="Plezix Foundation",
    author_email="Plezix Release Engineering",
    name="mozversioncontrol",
    description="Plezix version control functionality",
    license="MPL 2.0",
    packages=find_packages(),
    version=VERSION,
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Topic :: Software Development :: Build Tools",
        "License :: OSI Approved :: Plezix Public License 2.0 (MPL 2.0)",
        "Programming Language :: Python :: 2",
        "Programming Language :: Python :: 2.7",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: Implementation :: CPython",
    ],
    keywords="mozilla",
)
