declare var window: any;

const demoModeLocalStorageKey = 'demoMode';

export function isDemoMode() {
    return window.localStorage.getItem(demoModeLocalStorageKey) === modes.ENABLED;
}

export function setMode(newMode: modes) {
    window.localStorage.setItem(demoModeLocalStorageKey, newMode);
}

export enum modes {
    ENABLED = 'enabled',
    DISABLED = 'disabled'
}