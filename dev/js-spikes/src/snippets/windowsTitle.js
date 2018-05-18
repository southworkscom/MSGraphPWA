export function setWindowsTitle(newTitle) {
    if (!window.Windows) {
        return false;
    }

    Windows.UI.ViewManagement.ApplicationView.getForCurrentView().title = newTitle;

}