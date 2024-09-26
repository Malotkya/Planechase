declare module "*.json" {
    const value: any;
    export default value;
}

interface CardBase {
    name:string,
    text:string,
    type:string,
    image_uri:string
    use?:boolean
}

interface CardList {
    [set:string]:Array<CardBase>
}

interface GameVersion {
    name:string,
    value:CardList
}

interface AllCards {
    Planechase: Array<GameVersion>,
    Bounty: GameVersion,
    Unknown:CardList
}

interface AppState {
    current: number
    size: number
    direction: boolean /* true = horizontal */
    selectModal: boolean
    aboutModal: boolean
}

enum ActionType {
    SHOW_SELECT_MODAL,
    HIDE_SELECT_MODAL,
    FLIP_SELECT_MODAL,
    SHOW_ABOUT_MODAL,
    HIDE_ABOUT_MODAL,
    FLIP_ABOUT_MODAL,
    CLOSE_ALL_MODALS,
    DISPLAY_HORIZONTAL,
    DISPLAY_VERTICAL,
    UPDATE_SIZE,
    UPDATE_CURRENT
}

interface AppAction {
    type:ActionType,
    value?:number
}