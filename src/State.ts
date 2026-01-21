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
function handleAction(state:AppState, action:AppAction):AppState{
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
                selectModal: false,
                aboutModal: false
            };

        case "FLIP_SELECT_MODAL":
            return {
                ...state,
                selectModal: !state.selectModal,
                aboutModal: false
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
                aboutModal: false,
                selectModal: false
            };
    
        case "FLIP_ABOUT_MODAL":
            return {
                ...state,
                aboutModal: !state.aboutModal,
                selectModal: false
            };

        case "CLOSE_ALL_MODALS":
            return {
                ...state,
                aboutModal: false,
                selectModal: false
            };

        case "DISPLAY_HORIZONTAL":
            const hValue = action.value || state.size;
            return {
                ...state,
                direction: true,
                size: hValue
            };

        case "DISPLAY_VERTICAL":
            const vValue = action.value || state.size;
            return {
                ...state,
                direction: false,
                size: vValue
            };

        case "UPDATE_SIZE":
            if(typeof action.value === "undefined")
                throw new TypeError("Need value to update Size!");
            return {
                ...state,
                size: action.value
            };

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

    throw new Error(`Unknow Action type: ${action.type}`);
}

export function updateState(state:AppState, action:AppAction): AppState{
    state = handleAction(state, action);
    AsyncStorage.setItem(STATE_KEY, JSON.stringify(state));
    return state;
}

export async function loadState(dispatch:(action:AppAction)=>void) {
    const state = await AsyncStorage.getItem("app.state");
    if(state){
        dispatch({
            type: "INIT" as any,
            state: JSON.parse(state)
        });
    }
}