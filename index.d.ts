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