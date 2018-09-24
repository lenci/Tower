import MatchPlayersPanel from "./MatchPlayersPanel";
import MatchManager, { MatchStatus } from "../../Framework/MatchManager";
import Game from "../../Framework/GameManager";
import MatchJoiningPanel from "./MatchJoiningPanel";
import MatchCountingDownForBeginningPanel from "./MatchCountingDownForBeginningPanel";
import MatchStartingPanel from "./MatchStartingPanel";
import MatchTowersPanel from "./MatchTowersPanel";


const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchView extends cc.Component {

    @property(MatchPlayersPanel)
    pnlPlayers: MatchPlayersPanel = null;

    @property(MatchStartingPanel)
    pnlStarting: MatchStartingPanel = null;

    @property(MatchJoiningPanel)
    pnlJoining: MatchJoiningPanel = null;

    @property(MatchCountingDownForBeginningPanel)
    pnlCountingDownForBeginning: MatchCountingDownForBeginningPanel = null;

    @property(MatchTowersPanel)
    pnlTowersPanel: MatchTowersPanel = null;

    private _matchManager:MatchManager = null;

    start() {
        this._matchManager = Game.instance.matchManager;
        this._matchManager.node.on(MatchManager.EVT_MATCH_STATUS_CHANGED, this.onMatchStatusChanged, this);
    }

    private onMatchStatusChanged(status:MatchStatus) {
        if (MatchStatus.Preparing == status) {
            if (this._matchManager.isMyMatch) {
                this.pnlStarting.show();
                this.pnlJoining.hide();
            } else {
                this.pnlStarting.hide();
                this.pnlJoining.show();
            }
            this.pnlCountingDownForBeginning.hide();
            this.pnlTowersPanel.hide();

        } else if (MatchStatus.CountingDownForBeginning == status) {
            this.pnlStarting.hide();
            if (this._matchManager.isMyMatch) {
                this.pnlJoining.hide();
            } else {
                this.pnlJoining.show();
            }
            this.pnlCountingDownForBeginning.show();
            this.pnlTowersPanel.hide();

        } else if (MatchStatus.Playing == status) {
            this.pnlStarting.hide();
            this.pnlJoining.hide();
            this.pnlCountingDownForBeginning.hide();
            this.pnlTowersPanel.show();
        }
    }
}
