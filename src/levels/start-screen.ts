import { Actor, Color, CoordPlane, Engine, Scene, coroutine, vec } from "excalibur";
import { Resources } from "../resources";


export class StartScreen extends Scene {

    summonCircle: Actor;
    titleText: Actor;
    playNowText: Actor;

    constructor() {
        super();

        this.summonCircle = new Actor({
            pos: vec(400, 300),
            coordPlane: CoordPlane.Screen,
            angularVelocity: 0.1
        });
        this.summonCircle.graphics.add(Resources.LargeSummonCircleImage.toSprite());
        this.add(this.summonCircle);


        this.titleText = new Actor({
            pos: vec(400, 300),
            coordPlane: CoordPlane.Screen
        });
        this.titleText.graphics.add(Resources.TitleTextImage.toSprite());
        this.add(this.titleText);


        this.playNowText = new Actor({
            pos: vec(400, 450),
            coordPlane: CoordPlane.Screen
        });
        this.playNowText.graphics.add(Resources.PlayNowImage.toSprite());
        this.add(this.playNowText);

    }

    onInitialize(engine: Engine<any>): void {
        this.backgroundColor = Color.Black;
        const summonCircle = this.summonCircle;
        coroutine(function * () {
            let scaleFactor = 0.04;
            let scale = 1.0;
            while(true) {
                const elapsed = yield;
                scale += (scaleFactor * (elapsed/1000));
                summonCircle.scale = vec(scale, scale);

                if (scale > 1.5 || scale < 1.0) {
                    scaleFactor = -1 * scaleFactor;
                }
            }
        });

        const playNowText = this.playNowText;
        coroutine(function * () {
            let fadeFactor = 0.7;
            let opacity = 0.0;
            while(true) {
                const elapsed = yield;
                opacity += (fadeFactor * (elapsed/1000));
                playNowText.graphics.opacity = opacity;

                if (opacity >= 1.0 || opacity < 0) {
                    fadeFactor = -1 * fadeFactor;
                }
            }
        });

        this.input.pointers.on('down', () => engine.goToScene('introLevel'));
        this.input.keyboard.on('press', () => engine.goToScene('introLevel'));
    }


}