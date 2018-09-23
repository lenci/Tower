import Game from "../Framework/GameManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMenu extends cc.Component {

    @property(cc.Button)
    playButton:cc.Button = null;

    play () {
        Game.instance.play();
    }
}
