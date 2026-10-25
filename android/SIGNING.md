# Android preview signing

Builds 1–14 used an automatically generated debug key whose cache path was not saved. They cannot be upgraded by the corrected signing lineage; back up any data before a one-time reinstall.

From build 15, the workflow explicitly sets SUMMARISE_SIGNING_STORE, caches the same key, and uploads an authenticated Actions artifact named android-signing-key-v2 before compilation. It can restore the key from that backup if the cache is absent. Only the bootstrap build (15) may create a key. Other builds fail if neither key copy is available, rather than publish an incompatible APK.

The backup is private to authenticated repository artifact access and retained for 90 days, refreshed on every build. Download and keep a secure offline copy, and move it to repository signing secrets for long-term production use before the backup expires. Never commit the key or put it in a public release asset. The current key is for preview distribution, not a Play Store production release.

Each build verifies the APK and prints its public SHA-256 certificate fingerprint in the Verify APK signer step. Updates must keep the same fingerprint and increase versionCode. Install over the existing app; do not uninstall during routine updates.
