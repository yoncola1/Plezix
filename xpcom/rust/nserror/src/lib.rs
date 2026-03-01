/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

use nsstring::{nsACString, nsCString};
use std::error::Error;
use std::fmt;

/// The type of errors in gecko.  Uses a newtype to provide additional type
/// safety in Rust and #[repr(transparent)] to ensure the same representation
/// as the C++ equivalent.
#[repr(transparent)]
#[allow(non_camel_case_types)]
#[derive(Clone, Copy, Eq, PartialEq, Ord, PartialOrd, Hash)]
pub struct nsresult(pub u32);

impl nsresult {
    pub fn failed(self) -> bool {
        (self.0 >> 31) != 0
    }

    pub fn succeeded(self) -> bool {
        !self.failed()
    }

    pub fn to_result(self) -> Result<(), nsresult> {
        if self.failed() {
            Err(self)
        } else {
            Ok(())
        }
    }

    /// Get a printable name for the nsresult error code. This function returns
    /// a nsCString<'static>, which implements `Display`.
    pub fn error_name(self) -> nsCString {
        let mut cstr = nsCString::new();
        unsafe {
            Gecko_GetErrorName(self, &mut *cstr);
        }
        cstr
    }
}

impl fmt::Display for nsresult {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.error_name())
    }
}

impl fmt::Debug for nsresult {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.error_name())
    }
}

impl<T, E> From<Result<T, E>> for nsresult
where
    E: Into<nsresult>,
{
    fn from(result: Result<T, E>) -> nsresult {
        match result {
            Ok(_) => NS_OK,
            Err(e) => e.into(),
        }
    }
}

impl Error for nsresult {}

extern "C" {
    fn Gecko_GetErrorName(rv: nsresult, cstr: *mut nsACString);
}

// PLEZIX FIX: Handle missing error_list.rs during early build stages
#[cfg(not(feature = "gecko"))]
mod error_list {
    // Fallback error codes when error_list.rs is not available
    pub const NS_OK: super::nsresult = super::nsresult(0);
    pub const NS_ERROR_FAILURE: super::nsresult = super::nsresult(0x80004005);
    pub const NS_ERROR_NULL_POINTER: super::nsresult = super::nsresult(0x80004003);
}

#[cfg(feature = "gecko")]
mod error_list {
    include!(mozbuild::objdir_path!("xpcom/base/error_list.rs"));
}

pub use error_list::*;
