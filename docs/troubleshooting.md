# Troubleshooting

When you encounter a mystic problem here are some tips on what to do.

1. Remove `node_modules` and `.next` directories.
2. Install dependencies again: `npm install`
3. Build again: `npm run build`
4. Restart development server: `npm run dev`

This clears all caches and should help. Now try again if the problem still
exists.

If the problem still exists, try to checkout to `v2` branch. It should be in
good condition as CI checks the pull requests before they can be merged.
