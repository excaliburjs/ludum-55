import { Scene, SceneActivationContext, coroutine } from "excalibur";


// How to make it clear to sum the rows and columns
// 

export class Tutorial extends Scene {
    

    constructor() {
        super();
    }

    async onActivate(context: SceneActivationContext<unknown>) {
        await coroutine(function * () {
            yield 2000;
            
        });
    }
}