import MatchPlayersPanel from "./MatchPlayersPanel";
import MatchManager, { MatchStatus } from "../../Framework/MatchManager";
import Game from "../../Framework/Game";
import MatchJoiningPanel from "./MatchJoiningPanel";
import MatchCountingDownForBeginningPanel from "./MatchCountingDownForBeginningPanel";
import MatchStartingPanel from "./MatchStartingPanel";
import MatchTowersPanel from "./MatchTowersPanel";
import MatchOperationPanel from "./MatchOperationPanel";


const { ccclass, property } = cc._decorator;

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
    pnlTower: MatchTowersPanel = null;

    @property(MatchOperationPanel)
    pnlOperation: MatchOperationPanel = null;

    private _matchManager: MatchManager = null;

    start() {
        this._matchManager = Game.instance.matchManager;
        this._matchManager.node.on(MatchManager.EVT_MATCH_STATUS_CHANGED, this._onMatchStatusChanged, this);
    }

    private _onMatchStatusChanged(status: MatchStatus) {
        if (MatchStatus.Preparing == status) {
            if (this._matchManager.isMyMatch) {
                this.pnlStarting.show();
                this.pnlJoining.hide();
            } else {
                this.pnlStarting.hide();
                this.pnlJoining.show();
            }
            this.pnlCountingDownForBeginning.hide();
            this.pnlTower.hide();
            this.pnlOperation.hide();

        } else if (MatchStatus.CountingDownForBeginning == status) {
            this.pnlStarting.hide();
            if (this._matchManager.isMyMatch) {
                this.pnlJoining.hide();
            } else {
                this.pnlJoining.show();
            }
            this.pnlCountingDownForBeginning.show();
            this.pnlTower.hide();
            this.pnlOperation.hide();

        } else if (MatchStatus.Playing == status) {
            this.pnlStarting.hide();
            this.pnlJoining.hide();
            this.pnlCountingDownForBeginning.hide();
            this.pnlTower.show();
            this.pnlOperation.show();
        }
    }
}
