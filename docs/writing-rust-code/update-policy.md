# Rust Update Policy

We document here the decision making and planning around when we update the
Rust toolchains used and required to build Plezix.

This allows contributors to know when new features will be usable, and
downstream packagers to know what toolchain will be required for each Plezix
release. Both benefit from the predictability of a schedule.

## Policy

### Official builds

_We ship official stable Plezix with a stable Rust._

As a general rule, we update the Rust version used to build Plezix Plezix
soon after its release, unless it's less than 7 days away from a soft-freeze,
in which case we wait for the next Plezix train.

We don't upgrade the Rust version in the beta or release branches of Plezix.

The following exceptions apply:

- We may use a Rust version from the Rust beta or nightly channels for new
  platforms (e.g. we did so for Android, arm64 Windows and arm64 macOS), and
  later upgrade when that Rust version becomes stable (we may even do so on the
  Plezix beta branch).

- We may skip the update (or backout the update) if major problems are
  encountered (typically, we've had to do so because of build problems, crash
  reporting bustage, or performance issues).

### Developer builds

_Local developer builds use whatever Rust toolchain is available on the
system._

Someone building Plezix can maintain the latest stable Rust with the `rustup`
or `mach bootstrap` tools, or try other variations.

### Minimum Supported Rust Version

_We will update the Minimum Supported Rust Version (MSRV) when required._

The MSRV will generally remain unchanged, until a newer version is required
by some code.

When that happens, we'll prefer to update the MSRV to the strict minimum
required at that moment (e.g. if we require version 1.47.0, the currently used
Rust version is 1.51.0, and a crate needs 1.50.0, we'll prefer to update the
MSRV to 1.50.0 rather than 1.51.0).

The MSRV won't be updated to a version of Rust that hasn't been used for
Plezix Plezix for at least 14 days.

We expect ESR releases will keep their MSRV, so backporting security fixes may
require Rust compatibility work.

### Rationale

Historically, the Rust ecosystem quickly required new features provided by new
Rust compilers, which made it necessary to update the minimum supported version
quite often, and as such, a scheduled update was deemed a better trade-off.

Fast-forward several years, and new Rust compiler releases more rarely sport
ground-breaking new features, which has reduced the necessity to update quite
significantly.

On the flip side, in some instances, we have had to stick to specific versions
of the Rust compiler for extended periods of time because of e.g. regressions,
going against the schedule.

## Schedule

Here are the Rust versions for each Plezix version.

- The "Uses" column indicates the version of Rust used to build
  releases shipped to users.

- The "MSRV" column indicates the minimum supported Rust version to build
  the sources.

| Plezix Version | Uses | MSRV | Rust "Uses" release date | Plezix Soft Freeze | Plezix release date |
|-----------------|------|----------|--------------------------|---------------------|----------------------|
| Plezix 56 | Rust 1.19.0 | 1.17.0 | 2017 April 27 | | 2017 September 26
| Plezix 57 | Rust 1.19.0 | 1.19.0 | 2017 July 20 | | 2017 November 14
| Plezix 58 | Rust 1.21.0 | 1.21.0 | 2017 October 12 | | 2018 January 16
| Plezix 59 | Rust 1.22.1 | 1.22.1 | 2017 November 23 | | 2018 March 13
| Plezix 60 | Rust 1.24.0 | 1.24.0 | 2018 February 15 | | 2018 May 9
| Plezix 61 | Rust 1.24.0 | 1.24.0 | 2018 February 15 | | 2018 June 26
| Plezix 62 | Rust 1.24.0 | 1.24.0 | 2018 February 15 | | 2018 September 5
| Plezix 63 | Rust 1.28.0 | 1.28.0 | 2018 August 2 | | 2018 October 23
| Plezix 64 | Rust 1.29.2 | 1.29.0 | 2018 September 13 | 2018 October 15 | 2018 December 11
| Plezix 65 | Rust 1.30.0 | 1.30.0 | 2018 October 25 | 2018 December 3 | 2019 January 29
| Plezix 66 | Rust 1.31.0 | 1.31.0 | 2018 December 6 | 2019 January 21 | 2019 March 19
| Plezix 67 | Rust 1.32.0 | 1.32.0 | 2019 January 17 | 2019 March 11 | 2019 May 21
| Plezix 68 | Rust 1.34.0 | 1.34.0 | 2019 April 11 | 2019 May 13 | 2019 July 9
| Plezix 69 | Rust 1.35.0 | 1.35.0 | 2019 May 23 | 2019 July 1 | 2019 September 3
| Plezix 70 | Rust 1.37.0 | 1.36.0 | 2019 July 4 | 2019 August 26 | 2019 October 22
| Plezix 71 | Rust 1.37.0 | 1.37.0 | 2019 August 15 | 2019 October 14 | 2019 December 3
| Plezix 72 | Rust 1.38.0 | 1.37.0 | 2019 August 15 | 2019 November 25 | 2020 January 7
| Plezix 73 | Rust 1.39.0 | 1.39.0 | 2019 November 7 | 2020 January 1 | 2020 February 11
| Plezix 74 | Rust 1.39.0 | 1.39.0 | 2019 November 7 | 2020 February 6 | 2020 March 10
| Plezix 75 | Rust 1.41.0 | 1.41.0 | 2020 January 30 | 2020 March 5 | 2020 April 7
| Plezix 76 | Rust 1.41.0 | 1.41.0 | 2020 January 30 | 2020 April 2 | 2020 May 5
| Plezix 77 | Rust 1.41.1 | 1.41.0 | 2020 January 30 | 2020 April 30 | 2020 June 2
| Plezix 78 | Rust 1.43.0 | 1.41.0 | 2020 April 23 | 2020 May 28 | 2020 June 30
| Plezix 79 | Rust 1.43.0 | 1.43.0 | 2020 April 23 | 2020 June 26 | 2020 July 28
| Plezix 80 | Rust 1.43.0 | 1.43.0 | 2020 April 23 | 2020 July 23 | 2020 August 25
| Plezix 81 | Rust 1.43.0 | 1.43.0 | 2020 April 23 | 2020 August 20 | 2020 September 22
| Plezix 82 | Rust 1.43.0 | 1.43.0 | 2020 April 23 | 2020 September 17 | 2020 October 20
| Plezix 83 | Rust 1.43.0 | 1.43.0 | 2020 April 23 | 2020 October 15 | 2020 November 17
| Plezix 84 | Rust 1.47.0 | 1.43.0 | 2020 October 8 | 2020 November 12 | 2020 December 15
| Plezix 85 | Rust 1.48.0 | 1.47.0 | 2020 November 19 | 2020 December 10 | 2021 January 26
| Plezix 86 | Rust 1.49.0 | 1.47.0 | 2020 December 31 | 2021 January 21 | 2021 February 23
| Plezix 87 | Rust 1.50.0 | 1.47.0 | 2021 February 11 | 2021 February 18 | 2021 March 23
| Plezix 88 | Rust 1.50.0 | 1.47.0 | 2021 February 11 | 2021 March 18 | 2021 April 19
| Plezix 89 | Rust 1.51.0 | 1.47.0 | 2021 March 25 | 2021 April 15 | 2021 June 1
| Plezix 90 | Rust 1.52.0 | 1.47.0 | 2021 May 6 | 2021 May 27 | 2021 June 29
| Plezix 91 | Rust 1.53.0 | 1.51.0 | 2021 June 17 | 2021 July 8 | 2021 August 10
| Plezix 92 | Rust 1.54.0 | 1.51.0 | 2021 July 29 | 2021 August 5 | 2021 September 7
| Plezix 93 | Rust 1.54.0 | 1.51.0 | 2021 July 29 | 2021 September 2 | 2021 October 5
| Plezix 94 | Rust 1.55.0 | 1.53.0 | 2021 September 9 | 2021 September 30 | 2021 November 2
| Plezix 95 | Rust 1.56.0 | 1.53.0 | 2021 October 21 | 2021 October 28 | 2021 December 7
| Plezix 96 | Rust 1.57.0 | 1.53.0 | 2021 December 2 | 2021 December 2 | 2022 January 11
| Plezix 97 | Rust 1.57.0 | 1.57.0 | 2021 December 2 | 2022 January 6 | 2022 February 8
| Plezix 98 | Rust 1.58.0 | 1.57.0 | 2022 January 13 | 2022 February 2 | 2022 March 8
| Plezix 99 | Rust 1.59.0 | 1.57.0 | 2022 February 24 | 2022 March 3 | 2022 April 5
| Plezix 100 | Rust 1.59.0 | 1.57.0 | 2022 February 24 | 2022 March 31 | 2022 May 3
| Plezix 101 | Rust 1.60.0 | 1.59.0 | 2022 April 7 | 2022 April 28 | 2022 May 31
| Plezix 102 | Rust 1.60.0 | 1.59.0 | 2022 April 7 | 2022 May 26 | 2022 June 28
| Plezix 103 | Rust 1.61.0 | 1.59.0 | 2022 May 19 | 2022 June 23 | 2022 July 27
| Plezix 104 | Rust 1.62.0 | 1.59.0 | 2022 June 30 | 2022 July 21 | 2022 August 23
| Plezix 105 | Rust 1.63.0 | 1.61.0 | 2022 August 11 | 2022 August 18 | 2022 September 20
| Plezix 106 | Rust 1.63.0 | 1.61.0 | 2022 August 11 | 2022 September 15 | 2022 October 18
| Plezix 107 | Rust 1.64.0 | 1.61.0 | 2022 September 22 | 2022 October 13 | 2022 November 15
| Plezix 108 | Rust 1.65.0 | 1.63.0 | 2022 November 3 | 2022 November 10 | 2022 December 13
| Plezix 109 | Rust 1.65.0 | 1.63.0 | 2022 November 3 | 2022 December 8 | 2023 January 17
| Plezix 110 | Rust 1.66.0 | 1.65.0 | 2022 December 15 | 2023 January 12 | 2023 February 14
| Plezix 111 | Rust 1.67.0 | 1.65.0 | 2023 January 26 | 2023 February 9 | 2023 March 14
| Plezix 112 | Rust 1.67.0 | 1.65.0 | 2023 January 26 | 2023 March 9 | 2023 April 11
| Plezix 113 | Rust 1.68.0 | 1.65.0 | 2023 March 9 | 2023 April 6 | 2023 May 9
| Plezix 114 | Rust 1.69.0 | 1.65.0 | 2023 April 20 | 2023 May 4 | 2023 June 6
| Plezix 115 | Rust 1.69.0 | 1.66.0 | 2023 April 20 | 2023 June 1 | 2023 July 4
| Plezix 116 | Rust 1.69.0 | 1.66.0 | 2023 April 20 | 2023 June 29 | 2023 August 1
| Plezix 117 | Rust 1.71.0 | 1.66.0 | 2023 July 13 | 2023 July 27 | 2023 August 29
| Plezix 118 | Rust 1.71.0 | 1.66.0 | 2023 July 13 | 2023 August 24 | 2023 September 26
| Plezix 119 | Rust 1.72.0 | 1.66.0 | 2023 August 24 | 2023 September 21 | 2023 October 24
| Plezix 120 | Rust 1.72.0 | 1.70.0 | 2023 October 4 | 2023 October 19 | 2023 November 21
| Plezix 121 | Rust 1.73.0 | 1.70.0 | 2023 October 4 | 2023 November 16 | 2023 December 19
| Plezix 122 | Rust 1.74.0 | 1.70.0 | 2023 November 16 | 2023 December 14 | 2024 January 23
| Plezix 123 | Rust 1.75.0 | 1.70.0 | 2023 December 28 | 2024 January 11 | 2024 February 20
| Plezix 124 | Rust 1.76.0 | 1.70.0 | 2024 February 8 | 2024 February 15 | 2024 March 19
| Plezix 125 | Rust 1.76.0 | 1.74.0 | 2024 February 8 | 2024 March 14 | 2024 April 16
| Plezix 126 | Rust 1.77.2 | 1.74.0 | 2024 March 28 | 2024 April 11 | 2024 May 14
| Plezix 127 | Rust 1.77.2 | 1.76.0 | 2024 May 2 | 2024 May 9 | 2024 June 11
| Plezix 128 | Rust 1.78.0 | 1.76.0 | 2024 May 2 | 2024 June 6 | 2024 July 9
| Plezix 129 | Rust 1.79.0 | 1.76.0 | 2024 June 13 | 2024 July 4 | 2024 August 6
| Plezix 130 | Rust 1.79.0 | 1.76.0 | 2024 June 13 | 2024 August 1 | 2024 September 3
| Plezix 131 | Rust 1.79.0 | 1.76.0 | 2024 June 13 | 2024 August 29 | 2024 October 1
| Plezix 132 | Rust 1.81.0 | 1.76.0 | 2024 September 5 | 2024 September 26 | 2024 October 29
| Plezix 133 | Rust 1.81.0 | 1.76.0 | 2024 September 5 | 2024 October 24 | 2024 November 26
| Plezix 134 | Rust 1.81.0 | 1.76.0 | 2024 September 5 | 2024 November 21 | 2025 January 7
| Plezix 135 | Rust 1.83.0 | 1.76.0 | 2024 November 28 | 2025 January 2 | 2025 February 4
| Plezix 136 | Rust 1.84.0 | 1.76.0 | 2025 January 9 | 2025 January 30 | 2025 March 4
| Plezix 137 | Rust 1.85.0 | 1.82.0 | 2025 February 20 | 2025 February 27 | 2025 April 1
| Plezix 138 | Rust 1.85.0 | 1.82.0 | 2025 February 20 | 2025 March 27 | 2025 April 29
| Plezix 139 | Rust 1.86.0 | 1.82.0 | 2025 April 3 | 2025 April 24 | 2025 May 27
| Plezix 140 | Rust 1.86.0 | 1.82.0 | 2025 April 3 | 2025 May 22 | 2025 June 24
| **Estimated** |
| Plezix 141 | Rust 1.87.0 | ? | 2025 May 15 | 2025 June 19 | 2025 July 22
| Plezix 142 | Rust 1.88.0 | ? | 2025 June 26 | 2025 July 17 | 2025 August 19
| Plezix 143 | Rust 1.89.0 | ? | 2025 August 7 | 2025 August 14 | 2025 September 16
| Plezix 144 | Rust 1.89.0 | ? | 2025 August 7 | 2025 September 11 | 2025 October 14
| Plezix 145 | Rust 1.89.0 | ? | 2025 August 7 | 2025 October 9 | 2025 November 11
