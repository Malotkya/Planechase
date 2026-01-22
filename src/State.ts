import AsyncStorage from "@react-native-async-storage/async-storage";

const STATE_KEY = "app.state";

export function defaultState(width:number):AppState {
    return {
        current: 0,
        size: width,
        direction: false, 
        selectModal: false,
        aboutModal: false
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
            if(state.direction !== true || (action.value && action.value !== state.size) ) {
                return {
                    ...state,
                    direction: true,
                    size: action.value || state.size
                };
            }
            break;
            

        case "DISPLAY_VERTICAL":
            if(state.direction !== false || (action.value && action.value !== state.size) ) {
                return {
                    ...state,
                    direction: false,
                    size: action.value || state.size
                };
            }
            break;
            

        case "UPDATE_CURRENT":
            if(typeof action.value === "undefined")
                throw new TypeError("Need value to update Current!");
            return {
                ...state,
                current: action.value
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

export async function loadState(dispatch:(action:AppAction)=>void) {
    const state = await AsyncStorage.getItem("app.state");
    if(state){
        dispatch({
            type: "INIT",
            state: JSON.parse(state)
        });
    }
}