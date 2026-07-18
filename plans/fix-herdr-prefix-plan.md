## Plan: Fix Herdr Prefix

Activate the configured Alt+B prefix, ensure macOS terminal transports Option as Alt, then verify Herdr uses the new binding rather than its default.

**Phases 3**
1. **Phase 1: Activate Prefix Binding**
    - **Objective:** Make `alt+b` the effective Herdr prefix and reload the running server.
    - **Files/Functions to Modify/Create:** `/Users/khuongmai/.config/herdr/config.toml`; Herdr runtime configuration
    - **Tests to Write:** Configuration assertion that `[keys]` contains active `prefix = "alt+b"`; reload command success check
    - **Steps:**
        1. Run a configuration assertion and confirm it fails while the prefix line is commented.
        2. Uncomment the existing `prefix = "alt+b"` line without changing unrelated settings.
        3. Reload Herdr configuration.
        4. Re-run the configuration assertion and confirm it passes.
2. **Phase 2: Enable Alt Transport**
    - **Objective:** Ensure VS Code integrated terminal sends macOS Option+B as Alt+B rather than a composed Unicode character.
    - **Files/Functions to Modify/Create:** VS Code user setting `terminal.integrated.macOptionIsMeta`, only if currently disabled
    - **Tests to Write:** Existing setting inspection; raw terminal input check where practical
    - **Steps:**
        1. Inspect effective VS Code setting before changing it.
        2. Confirm disabled or missing state requires correction.
        3. Enable `terminal.integrated.macOptionIsMeta` with the smallest settings change.
        4. Reinspect the effective setting and confirm it is enabled.
3. **Phase 3: Verify Active Prefix**
    - **Objective:** Confirm Alt+B enters prefix mode and Ctrl+B no longer acts as the Herdr prefix.
    - **Files/Functions to Modify/Create:** No expected file changes; Herdr status and logs only
    - **Tests to Write:** Herdr status check; active binding/help verification; focused log check for configuration errors
    - **Steps:**
        1. Capture Herdr server and client status.
        2. Verify active binding through Herdr help or available metadata.
        3. Confirm no configuration parsing or reload errors appear in recent logs.
        4. Report any remaining terminal-specific limitation without adding unrelated configuration.

**Open Questions**
1. Should Option act as Alt in every VS Code terminal? Default: yes.
2. If Alt+B remains unreliable, prefer Ctrl+Alt+B or retain Alt+B and diagnose escape timing?
