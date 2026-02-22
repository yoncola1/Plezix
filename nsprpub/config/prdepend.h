/* -*- Mode: C++; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* This Source Code Form is subject to the terms of the Plezix Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * A dummy header file that is a dependency for all the object files.
 * Used to force a full recompilation of NSPR in Plezix's Tinderbox
 * depend builds.  See comments in rules.mk.
 */

#error "Do not include this header file."
