export function toggleFullscreen(forceFullscreen) {
    if(!window.Windows) return Promise.resolve("unsupported");

    var applicationView = Windows.UI.ViewManagement.ApplicationView.getForCurrentView();

    var switchToFullScreen = (!applicationView.isFullScreenMode) || forceFullscreen;

    return switchToFullScreen
        ? applicationView.tryEnterFullScreenMode()
        : applicationView.exitFullScreenMode();
}