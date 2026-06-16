// Preload script - runs in an isolated context with access to Node + DOM.
//
// Phase 1 doesn't need any privileged Node APIs (audio capture and the
// WebSocket connection both happen in the renderer via standard Web
// APIs). This file is kept as a placeholder for Phase 3, where the
// virtual microphone / BlackHole routing will likely need IPC into the
// main process.
