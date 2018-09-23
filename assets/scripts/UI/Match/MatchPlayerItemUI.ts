import { MatchPlayer } from "../../Framework/MatchManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MatchPlayerUI extends cc.Component {

    @property(cc.Sprite)
    imgPlayerAvatar: cc.Sprite = null;

    @property(cc.Label)
    lblPlayerName: cc.Label = null;

    player: MatchPlayer = null;

    init(player: MatchPlayer) {
        this.player = player;
    }

    start() {
        this.lblPlayerName.string = this.player.name;
    }
}
