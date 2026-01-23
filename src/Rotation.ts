import { Platform } from "react-native";
import { INVERTSE_RATIO, MAX_SIZE, BUTTON_WIDTH, BUTTON_HEIGHT} from './Constants';
import {deviceType, DeviceType} from "expo-device";

export function shouldRotate():boolean {
    if(Platform.OS !== "web") {
        return false;
    }

    if( deviceType !== DeviceType.PHONE && deviceType !== DeviceType.TABLET ){
        return false;
    }

    return window.screen.orientation.type.includes("portrait");
}

export function getTestOrientation(width:number, height:number, rotated:boolean):[number, number] {
    const testHeight = Math.min(
        Math.ceil((height - (2 *BUTTON_HEIGHT) - 14) * INVERTSE_RATIO),
        MAX_SIZE
    );
    const testWidth = Math.min(
        width - BUTTON_WIDTH,
        MAX_SIZE
    );

    return rotated
        ? [testHeight, testWidth]
        : [testWidth, testHeight]
}