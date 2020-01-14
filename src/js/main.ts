import { Graphics } from "./canvas/graphics";
import { Function1V } from "./canvas/types";

function main(graphics: Graphics){
    let data = new Function1V("sin", (x)=>Math.sin(x));
    graphics.addDataset(data, 0x56789f);
}

export {main}