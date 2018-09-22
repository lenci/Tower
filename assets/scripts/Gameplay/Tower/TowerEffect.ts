import Tower from "./Tower";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TowerEffect extends cc.Component {

    private tower: Tower;

    start () {
        this.tower = this.getComponent(Tower);
    }

    // update (delta) {}
}
