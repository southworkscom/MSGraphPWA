export async function changeWindowsLockScreenImage(localImagePath) {
    if (!window.Windows || !Windows.System.UserProfile.UserProfilePersonalizationSettings.isSupported()) {
        return false;
    }

    const profileSettings = Windows.System.UserProfile.UserProfilePersonalizationSettings.current;

    try {
        // 1. Get a reference to the original image (from manifest)
        let originalBg = await Windows.Storage.StorageFile.getFileFromApplicationUriAsync(new Windows.Foundation.Uri("ms-appx:///" + localImagePath));

        // 2. Copy image to LocalState folder
        let newName = last(localImagePath.split('/'));
        await originalBg.copyAsync(Windows.Storage.ApplicationData.current.localFolder, newName, 1);
        let localBg = await Windows.Storage.ApplicationData.current.localFolder.getFileAsync(newName);

        // 3. Set as lockscreen image
        return await profileSettings.trySetLockScreenImageAsync(localBg);

    } catch (err) {
        console.error('changeWindowsLockScreenImage.error!', err);
    }

    return false;
}

function last(arr) {
    return arr[arr.length - 1];
}