import { Platform } from "react-native";
import * as Device from 'expo-device'
import * as ScreenOrientation from 'expo-screen-orientation';
import { loadState } from "./State";
import { loadServiceWorker } from './ServiceWorker';

/** Force Landscape on Phones and Tablets
 * 
 */
async function forceLandscape() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
}

export function preLoadSettings() {
    //Browser Specific Settings
    if(Platform.OS === "web") {
        document.body.style.backgroundColor = "black";

    //Apple Specific Settings
    } else if (Device.osName === "iOS" || Device.osName === "iPadOS") {
        ScreenOrientation.unlockAsync()
                .then(forceLandscape)
                .catch(console.error);

    //Android Specific Settings
    } else {
        forceLandscape();
    }
}

export function initalLoadData(dispatch:(action:AppAction)=>void) {
    return Promise.all([
        loadState(dispatch),
        loadServiceWorker("sw.js")
    ])
}