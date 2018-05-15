export function toggleCompactOverlayMode(forceCompactOverlay) {
    if(!window.Windows) return Promise.resolve("unsupported");

    var applicationView = Windows.UI.ViewManagement.ApplicationView;
    var currentMode = applicationView.getForCurrentView().viewMode;

    var newMode = (currentMode == Windows.UI.ViewManagement.ApplicationViewMode.default) || forceCompactOverlay
        ? Windows.UI.ViewManagement.ApplicationViewMode.compactOverlay
        : Windows.UI.ViewManagement.ApplicationViewMode.default;

    return applicationView.getForCurrentView()
        .tryEnterViewModeAsync(newMode)
        .then(() => newMode);
}