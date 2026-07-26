import WidgetKit
import SwiftUI

// The extension's entry point. Add more widgets (e.g. a lock-screen accessory or
// a Live Activity) to this bundle as you build them out.
@main
struct PocketPlanterWidgetBundle: WidgetBundle {
  var body: some Widget {
    PocketPlanterWidget()
    if #available(iOS 16.1, *) {
      FrostLiveActivity()
    }
  }
}
