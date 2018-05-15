'use strict';
import "blueimp-canvas-to-blob";
import CameraCapture from './camera-capture';

import { toggleCompactOverlayMode } from './snippets/compactOverlay';
import { changeWindowsLockScreenImage } from './snippets/lockscreenBg';
import { changeDesktopBackgroundImage } from './snippets/desktopBg';
import { showToastNotification } from './snippets/toastNotification';
import { addTimelineActivity } from './snippets/timeline';

export default class App {
    constructor(dom, navigator) {
        console.log('App.cstr()');

        // register service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(
                    (registration) => {
                        // Registration was successful
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                        this.serviceWorkerRegistration = registration;
                    }, (err) => {
                        // registration failed :(
                        console.log('ServiceWorker registration failed: ', err);
                    });
            });
        }

        // Save Document DOM reference
        this.dom = dom;

        this.dom.querySelector('#changeModeButton').addEventListener('click',
            () => toggleCompactOverlayMode().then(this.updateView.bind(this)));

        this.dom.querySelector('#goat-picture-container').addEventListener('click',
            () => toggleCompactOverlayMode().then(this.updateView.bind(this)));

        this.dom.querySelector('#toastNotificationButton').addEventListener('click',
            () => showToastNotification('Hello World!', 'You are working too hard! Here... have a goat!', '/images/goat-notification.png'));

        var testCounter = 1;
        var baseUrl = window.location.protocol + '//' + window.location.host;
        this.dom.querySelector('#timelineActivityButton').addEventListener('click',
            () => addTimelineActivity(guid(), `Test #${testCounter++}`, 'This is a test', '/images/goat-notification.png', baseUrl + '/images/goat-notification.png'));

        this.dom.querySelector('#setLockScreenImageButton').addEventListener('click',
            () => changeWindowsLockScreenImage('images/lock-screen.jpg'));

        this.dom.querySelector('#setDesktopBackgroundImageButton').addEventListener('click',
            () => changeDesktopBackgroundImage('images/lock-screen.jpg'));


        window.addEventListener('resize',
            () => {
                var goatPicture = this.dom.querySelector('#goat-picture');
                goatPicture.width = window.innerWidth;
                goatPicture.height = window.innerHeight;
            });

        // ask for notification access
        this.registerNotifications();
    }

    updateView(newMode) {
        console.log('UpdatedView, new mode is: ' + newMode);
        switch (newMode) {
            case Windows.UI.ViewManagement.ApplicationViewMode.compactOverlay:
                this.dom.querySelector('#main').className = "off";
                this.dom.querySelector('#goat-picture-container').className = "";
                return;
            case Windows.UI.ViewManagement.ApplicationViewMode.default:
                this.dom.querySelector('#main').className = "";
                this.dom.querySelector('#goat-picture-container').className = "off";
                return;
        }
    }

    registerNotifications() {
        var $status = this.dom.getElementById('notificationStatus');

        if ('Notification' in window) {
            $status.innerText = Notification.permission;
        } else {
            $status.innerText = 'Not Supported!';
        }

        // request permission, will entry automatically if already granted
        Notification.requestPermission(function (result) {
            $status.innerText = result;
        });
    }
}


function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}