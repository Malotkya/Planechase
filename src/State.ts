import AsyncStorage from "@react-native-async-storage/async-storage";

const STATE_KEY = "app.state";

export function defaultState(width:number):AppState {
    return {
        current: 0,
        size: width,
        direction: false, 
        selectModal: false,
        aboutModal: false,
        rotate: false
    }
}

export function getDisplayInformation(data:AppAction):{direction:boolean|undefined, size:number|undefined, rotate:boolean|undefined}{
    const direction = data.type === "DISPLAY_HORIZONTAL"
        ? true
        : data.type === "DISPLAY_VERTICAL"
            ? false
            : undefined;

    if(Array.isArray(data.value)) {
        const [size, rotate] = data.value;
        return {direction, size, rotate}
    }

    const type = typeof data.value;
    if(type === "number") {
        return {
            direction,
            size: data.value as number,
            rotate: undefined
        }
    } else if(type === "boolean") {
        return {
            direction,
            size: undefined,
            rotate: data.value as boolean
        }
    }

    return {
        direction,
        size: undefined,
        rotate: undefined
    }
}

/** Update App State Reducer
 * 
 * @param {AppState} state 
 * @param {AppAction} action 
 * @returns {AppState}
 */
function handleAction(state:AppState, action:AppAction):AppState|null{
    switch(action.type){
        case "SHOW_SELECT_MODAL":
            return {
                ...state,
                selectModal: true,
                aboutModal: false
            };

        case "HIDE_SELECT_MODAL":
            return {
                ...state,
                selectModal: false
            };

        case "SHOW_ABOUT_MODAL":
            return {
                ...state,
                aboutModal: true,
                selectModal: false
            };
    
        case "HIDE_ABOUT_MODAL":
            return {
                ...state,
                aboutModal: false
            };

        case "CLOSE_ALL_MODALS":
            if(state.aboutModal !== false || state.selectModal !== false) {
                return {
                    ...state,
                    aboutModal: false,
                    selectModal: false
                };
            }
            break;

        case "DISPLAY_HORIZONTAL":
        case "DISPLAY_VERTICAL":
        case "ROTATE":
        const {direction, size = state.size, rotate} = getDisplayInformation(action);
        let update:AppState|undefined;

        if(direction !== undefined) {
            if(state.direction !== direction || size !== state.size ) {
                update = {...state, direction, size}
            }
        }

        if(rotate !== undefined && rotate !== state.rotate) {
            update = update || {...state};
            update.rotate = rotate;
        }
            
        if(update)
            return update;
        break;  

        case "UPDATE_CURRENT":
            if(typeof action.value === "undefined")
                throw new TypeError("Need value to update Current!");
            return {
                ...state,
                current: typeof action.value === "number"
                    ? action.value
                    : 0
            };
    }

    if(action.state)
        return action.state;

    return null;
}

export function updateState(state:AppState, action:AppAction): AppState {
    const update = handleAction(state, action);
    if(update){
        AsyncStorage.setItem(STATE_KEY, JSON.stringify(update));
        return update;
    }
    
    return state;
}

export async function loadState(dispatch:(action:AppAction)=>void, width:number) {
    const state = await AsyncStorage.getItem("app.state");
    if(state){
        dispatch({
            type: "INIT",
            state: JSON.parse(state)
        });
    } else {
        dispatch({
            type: "INIT",
            state: defaultState(width)
        })
    }
}

export function resetState(width:number): AppState {
    AsyncStorage.clear();
    return defaultState(width);
}