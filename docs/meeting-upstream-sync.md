# Meeting Upstream Sync

This fork keeps upstream source files unchanged wherever possible. Meeting-specific packaging lives in:

- `src-tauri/tauri.meeting.conf.json`
- `src-tauri/icons/meeting/`
- `src-tauri/packages/linux/meeting*.sh` and `meeting.desktop`
- `tools/meeting/prepare-build.mjs`
- `.github/workflows/meeting-build.yml`

## Sync Upstream

Run these commands from the `dev` branch:

```bash
git fetch upstream dev
git merge --no-ff upstream/dev -m "merge: sync upstream dev changes"
git push origin dev
```

If upstream changes the same custom workflow or one of the files listed above, resolve only those files and keep the Meeting overlay. Do not rename upstream source files just to change the packaged process name.

## Build And Release

Open the `Meeting Build` workflow and run it manually. Keep the release tag as `meeting-build` unless a separate release is needed. The workflow:

1. Runs the upstream resource preparation.
2. Applies the temporary Cargo metadata overlay so the packaged executable is `meeting`.
3. Builds unsigned Windows, macOS Intel, macOS Apple Silicon, and Linux packages.
4. Verifies the generated executable name.
5. Uploads the installers to the `meeting-build` GitHub Release.

The temporary Cargo edit happens only on the GitHub runner and is not committed back to the branch.
