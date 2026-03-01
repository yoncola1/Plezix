// /!\ Please do not modify this file.
//
// Placeholder for windows-rs integration.
// This file is used when the actual windows crate is not available.
//
// Ignore warnings as if this was a vendored crate.
#![allow(warnings)]

// PLEZIX FIX: Provide stub implementations when windows crate is not available
// The actual windows functionality is provided through the build system

// Re-export from the actual windows crate if available
#[cfg(feature = "use-windows")]
pub use windows::*;

// Stub types for compilation without windows crate
#[cfg(not(feature = "use-windows"))]
pub mod core {
    pub trait ResultExt {}
    pub struct Error;
}

#[cfg(not(feature = "use-windows"))]
pub mod Win32 {
    pub mod Foundation {
        pub const S_OK: i32 = 0;
        pub const E_FAIL: i32 = -2147467259;
    }
    pub mod System {}
    pub mod UI {}
    pub mod Graphics {}
}
