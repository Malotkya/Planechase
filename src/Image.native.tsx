import { Image } from "expo-image";

export async function prefetch(uris:string[]):Promise<void> {
    await Image.prefetch(uris, "memory-disk")
}

export default Image;