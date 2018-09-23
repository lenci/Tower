import MatchPlayersPanel from "./MatchPlayersPanel";
import MatchManager, { MatchStatus } from "../../Framework/MatchManager";
import GameManager from "../../Framework/GameManager";
import MatchJoiningPanel from "./MatchJoiningPanel";
import MatchCountingDownForBeginningPanel from "./MatchCountingDownForBeginningPanel";


const {ccclass, property} = cc._decorator;

@ccclass
export default class MatchUI extends cc.Component {

    @property(MatchPlayersPanel)
    pnlPlayers: MatchPlayersPanel = null; 

    @property(MatchJoiningPanel)
    pnlJoining: MatchJoiningPanel = null;

    @property(MatchCountingDownForBeginningPanel)
    pnlCountingDownForBeginning: MatchJoiningPanel = null;

    private _matchManager:MatchManager = null;

    start() {
        this._matchManager = GameManager.instance.matchManager;
        this._matchManager.node.on(MatchManager.EVT_MATCH_STATUS_CHANGED, this.onMatchStatusChanged, this);
    }

    private onMatchStatusChanged(status:MatchStatus) {
        if (MatchStatus.Preparing == status) {
            this.setPanelEnabled(this.pnlJoining, true);
            this.setPanelEnabled(this.pnlCountingDownForBeginning, false);

        } else if (MatchStatus.CountingDownForBeginning == status) {
            this.setPanelEnabled(this.pnlJoining, true);
            this.setPanelEnabled(this.pnlCountingDownForBeginning, true);

        } else if (MatchStatus.Playing == status) {
            this.setPanelEnabled(this.pnlJoining, false);
            this.setPanelEnabled(this.pnlCountingDownForBeginning, false);
        }
    }

    private setPanelEnabled(panel:cc.Component, enabled:boolean) {
        panel.node.active = panel.enabled = enabled;
    }
}
