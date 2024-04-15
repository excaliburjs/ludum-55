import { Color, Engine, Font, FontUnit, Label, Scene, SceneActivationContext, TextAlign, vec } from "excalibur";


export class EndScreen extends Scene {

    endLabel: Label;
    font: Font;

    constructor() {
        super();
        this.font = new Font({
            family: 'sans-serif',
            color: Color.White,
            textAlign: TextAlign.Center,
            size: 40,
            unit: FontUnit.Px
        });
        this.endLabel = new Label({
            text: 'Thanks for playing!\nPlay Again?',
            pos: vec(400, 300),
            font: this.font
        });
        this.add(this.endLabel);
    }

    onInitialize(engine: Engine<any>): void {
        this.backgroundColor = Color.Black;
    }
    
    onActivate(context: SceneActivationContext<unknown>): void {
        this.input.pointers.once('down', () => this.engine.goToScene('startScreen'));
        this.input.keyboard.once('press', () => this.engine.goToScene('startScreen'));
    }
}