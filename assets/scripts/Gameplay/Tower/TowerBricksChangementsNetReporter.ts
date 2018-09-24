import Tower from "./Tower";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TowerBricksChanngementsNetReporter extends cc.Component {

    @property(Tower)
    tower:Tower = null;
}
