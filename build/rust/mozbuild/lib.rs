/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

use std::path::Path;

// Path::new is not const at the moment. This is a non-generic version
// of Path::new, similar to libstd's implementation of Path::new.
#[inline(always)]
const fn const_path(s: &'static str) -> &'static std::path::Path {
    unsafe { &*(s as *const str as *const std::path::Path) }
}

// PLEZIX FIX: Macro for windows-rs integration
// This macro is used to include windows-rs generated code
#[macro_export]
macro_rules! windows_rs_lib {
    () => {
        // Re-export windows crate types - windows crate is available via extern crate
        extern crate windows;
        pub use windows::core::*;
        pub use windows::Win32::*;
        pub use windows::Win32::Foundation::*;
        pub use windows::Win32::System::*;
        pub use windows::Win32::UI::*;
        pub use windows::Win32::Graphics::*;
    };
}

// PLEZIX FIX: Macro to get path relative to objdir
// Uses option_env to avoid compile-time errors when env var is not set
#[macro_export]
macro_rules! objdir_path {
    ($path:expr) => {
        concat!(
            option_env!("MOZBUILD_STATE_DIR").unwrap_or("."),
            "/",
            $path
        )
    };
}

pub mod config {
    // Always include fallback config - will be overridden by actual config during build
    include!(concat!(env!("TOPSRCDIR"), "/config/empty.rs"));
}

pub const TOPOBJDIR: &Path = const_path(config::TOPOBJDIR);
pub const TOPSRCDIR: &Path = const_path(config::TOPSRCDIR);
