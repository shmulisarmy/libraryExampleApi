import * as csstype from "csstype";
import { JSX } from "solid-js/jsx-runtime";

export interface CSSProperties extends csstype.PropertiesHyphen {
  // Override
  [key: `-${string}`]: string | number | undefined;
}


export default function Tag({border_size = ".1px", padding_y = "0px", padding_x = "8px", style = {}, background = "white", children, color = "black", text = ""}: {
    border_size?: string;
    padding_y?: string;
    padding_x?: string;
    style?: CSSProperties;
    background?: string;
    children?: JSX.Element;
    color?: string;
    text?: string;
}){
    const default_style = {
        border: `solid ${border_size} ${color}`,
        color: `${color}`,
        padding: `${padding_y} ${padding_x}`,
        "border-radius": "10px",
        background: background
    }
    return <span style={{
        ...default_style,
        ...style,
}}>
        {text}
        {children}
    </span>
}