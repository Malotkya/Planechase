import { ImageProps, StyleProp, View, ImageStyle } from "react-native";

const cache:Record<string, HTMLImageElement> = {};

export async function prefetch(uris:string[]):Promise<void> {
    for(const uri of uris) {
        const img = createImage(uri, '1px', '1px');
        document.body.appendChild(img);
        cache[uri] = img;
    }
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
    

    const elm = cache[uri];

    if(document.body.contains(elm)) {
        document.body.removeChild(elm);
        elm.style.width = "100%";
        elm.style.height = "100%";
    }

    return elm;
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