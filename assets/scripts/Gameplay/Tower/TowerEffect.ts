import Tower from "./Tower";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TowerEffect extends cc.Component {

    private _tower: Tower;

    start () {
        this._tower = this.getComponent(Tower);
    }

    // update (delta) {}
}
