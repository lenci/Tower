import Game from "../Framework/Game";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMenu extends cc.Component {

    play() {
        Game.instance.play();
    }
}
