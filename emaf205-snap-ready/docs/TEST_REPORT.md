# EMAF205 SNAP v1.2.0 — Validation report

## Change validated

v1.2.0 preserves the v1.1 capture/clipboard flow and adds visible success feedback without adding another user action:

- green **✓ COPIED** status for ~650 ms;
- green toolbar **✓** badge during success feedback;
- popup closes automatically after success;
- red persistent error message + **!** badge if capture/copy fails.

## Automated checks executed

- `manifest.json` parses as valid JSON.
- Manifest version remains MV3.
- Extension version is `1.2.0`.
- Required permissions remain limited to `activeTab` and `clipboardWrite`.
- No host permissions are declared.
- JavaScript syntax passes Node syntax validation.
- Required popup and icon files exist.
- Success and error UI markers are present in the implementation.
- ZIP integrity is checked after packaging.

## Environment limitation

A physical macOS clipboard/shortcut interaction cannot be reproduced inside this Linux container. Final acceptance on macOS is: load unpacked → invoke with click or Command+Shift+Y → confirm **✓ COPIED** → paste into an image-capable destination.
