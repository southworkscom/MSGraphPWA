export function showMessageDialog(title, content, options) {
    if (!window.Windows) return Promise.reject('unsupported');

    return new Promise((resolve, reject) => {
        var dialog = new Windows.UI.Popups.MessageDialog(content, title);
        if (options instanceof Array && options.length) {
            options.forEach((optionText, ix) => {
                dialog.commands.append(new Windows.UI.Popups.UICommand(
                    optionText,
                    () => resolve({ option: optionText, optionIndex: ix })));
            });
        }

        dialog.showAsync();
    });
}