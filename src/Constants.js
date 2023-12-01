/** /src/Constants
 * 
 * @author Alex Malotky
 */

//Ratio to switch from Width to Height
export const RATIO = 0.69841;
//Ratio to switch from Height to Width
export const INVERTSE_RATIO = 1 / RATIO;

//Max Width of the App
export const MAX_SIZE = 850;//px

//Default Dimensions of a button.
export const BUTTON_WIDTH = 100;//px
export const BUTTON_HEIGHT = 35;//px

//Default Button Styling
export const BUTTON_DEFAULT = {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    flexGrow: 1,
    backgroundColor: "rgb(33, 150, 243)",
    color: "white",
    padding: 8,
    textTransform: "uppercase",
    textAlign: "center",
    borderRadius: 3
}