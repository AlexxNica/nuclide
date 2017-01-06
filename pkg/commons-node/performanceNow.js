/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 */

/* global performance */

/**
 * Polyfill for performance.now that works both on Atom (chrome) and node.
 * It returns a monotonically increasing timer in milliseconds.
 *
 * Usage:
 *   const now = performanceNow();
 *   // ... code you want to benchmark ...
 *   const timeItTookInMilliseconds = performanceNow() - now;
 */

export default (
  typeof performance !== 'undefined'
    ? (): number => performance.now()
    : (): number => {
      const [seconds, nanoseconds] = process.hrtime();
      return seconds * 1000 + nanoseconds / 1000000;
    }
);
