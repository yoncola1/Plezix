/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// PLEZIX FIX: Fallback config when BUILDCONFIG_RS is not available
// This is used during IDE analysis and early build stages

pub const TOPOBJDIR: &str = ".";
pub const TOPSRCDIR: &str = ".";
pub const MOZ_FOLD_LIBS: bool = false;
pub const MOZ_WIDGET_TOOLKIT: &str = "windows";
pub const TARGET_XPCOM_ABI: &str = "x86_64-msvc";
pub const MOZILLA_VERSION: &str = "1.0";
pub const BUILD_ID: &str = "20260301000000";

// Additional constants required by various crates
// Must be &'static [&'static str] for .iter().chain() to work
pub const BINDGEN_SYSTEM_FLAGS: &'static [&'static str] = &[];
pub const NSPR_CFLAGS: &'static [&'static str] = &[];
pub const NSS_CFLAGS: &'static [&'static str] = &[];
pub const MOZ_PIXMAN_CFLAGS: &'static [&'static str] = &[];
pub const MOZ_ICU_CFLAGS: &'static [&'static str] = &[];
pub const NIGHTLY_BUILD: bool = false;
pub const MOZ_DIAGNOSTIC_ASSERT_ENABLED: bool = false;
