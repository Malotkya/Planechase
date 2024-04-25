import { MAX_SIZE, DEFAULT_FONT_SIZE } from "./Constants";

/** Response Font Size
 * 
 * The goal of this function is to responsivly change the size
 * of the font based on the size of the app.
 * 
 * If the app is at max size 1 = DEFAULT_FONT_SIZE.
 * 
 * @param size 
 * @param width 
 * @returns 
 */
export function fontSize(size:number, width:number = MAX_SIZE) {
    const ratio = (DEFAULT_FONT_SIZE * width) / MAX_SIZE;
    return Math.floor(ratio * size);
}