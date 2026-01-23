import { ImageProps, StyleProp, View, ImageStyle } from "react-native";

const cache:Record<string, HTMLImageElement> = {};

export async function prefetch(uris:string[]):Promise<void> {
    await Promise.all(uris.map(uri=>new Promise<void>(res=>{
        const img = createImage(uri, '1px', '1px');
        document.body.appendChild(img);

        const listener = (e:Event) => {
            img.removeEventListener("error", listener);
            img.removeEventListener("load", listener);
            
            if(e.type === "error") {
                console.error("There was a error when precaching: " + uri + "!");
            } else {
                img.style.width = '100%';
                img.style.height = '100%';
                cache[uri] = img;
            }

            document.body.removeChild(img);
            res();
        }

        img.addEventListener("error", listener);
        img.addEventListener("load", listener);
    })))
}

function createImage(src:string, width:string = '100%', height:string = '100%'):HTMLImageElement {
    const img = new window.Image();
    img.src = src;
    img.draggable = false;

    //Match NativeImage Styling 
    img.setAttribute("style", 
        `object-position: left 50% top 50%;
            width: ${width};
            height: ${height};
            position: absolute;
            left: 0px; top: 0px;
            object-fit: cover;
            transition-duration: 0ms;
            transition-timing-function: linear;`.replaceAll(/\s+/g, " ")
        );

    return img;
}

function get(uri:string|undefined):HTMLImageElement {
    uri = uri || "#";
    
    if( !(uri in cache) )
        cache[uri] = createImage(uri);

    return cache[uri];
}

export default function Image({source, ...props}:ImageProps) {

    let uri = typeof source === "object" && "uri" in source
        ? source.uri
        : undefined;

    return (
        <View {...props} ref={ref=>{
            if(ref) {
                (ref as any).innerHTML = "";
                (ref as any).appendChild(get(uri))
            }
        }}></View>
    )
}