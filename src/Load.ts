import { Platform } from "react-native";
import * as Device from 'expo-device'
import * as ScreenOrientation from 'expo-screen-orientation';
import { loadState } from "./State";
import { loadServiceWorker } from './ServiceWorker';
import { prefetch } from "./Image";
import { Items } from "./Main";

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

export async function initalLoadData(dispatch:(action:AppAction)=>void) {
    const images = Items.flatMap((g)=>g.flatMap(({value})=>{
        let output: string[] = [];
        for(const name in value) {
            output = output.concat(value[name].map(c=>{
                const src = c.image_uri;
                let i = new window.Image();
                i.src = c.image_uri;
                return src;
            }))
        }
        return output;
    }));

    await Promise.all([
        loadState(dispatch),
        loadServiceWorker("sw.js"),
        prefetch(images)
    ])
}