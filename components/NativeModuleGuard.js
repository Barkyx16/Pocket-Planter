import React from "react";

// Small inline error boundary for optional native features (camera, QR/SVG).
// Those native modules only exist once the dev client / app binary is rebuilt.
// On an older build, mounting them can throw at render — this catches that and
// shows a compact fallback instead of crashing the whole screen.
export class NativeModuleGuard extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.log("Native module unavailable:", error?.message);
  }

  render() {
    if (this.state.hasError) return this.props.fallback || null;
    return this.props.children;
  }
}
