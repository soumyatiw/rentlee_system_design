/** @type {import('next').NextConfig} */

// TEMPORARY FIX FOR NODE 25: Node v25 exposes a broken global.localStorage by default.
// This causes Firebase Auth to crash during SSR. Delete it globally.
if (typeof global !== 'undefined' && global.localStorage) {
  try { delete global.localStorage; } catch (e) {}
}

const nextConfig = {};

export default nextConfig;
