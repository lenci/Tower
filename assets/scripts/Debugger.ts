const {ccclass, property} = cc._decorator;

@ccclass
export default class Debugger extends cc.Component {

    onLoad () {
        cc.director.getPhysicsManager().enabledAccumulator = true;
        cc.director.getPhysicsManager().debugDrawFlags = cc.DrawBits.e_aabbBit;
        cc.director.getPhysicsManager().enabled = true;
    }
}
