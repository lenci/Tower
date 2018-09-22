const {ccclass, property} = cc._decorator;

@ccclass
export default class Utility {

    static setAnchorX(node:cc.Node, anchorX: number, rePlaceChildren:boolean = true) {

        let diffX: number = (anchorX - node.anchorX) * node.getContentSize().width * node.scaleX;

        node.anchorX = anchorX;

        node.x += diffX;

        if (rePlaceChildren) {
            node.children.forEach(child => {
                child.x -= diffX;
            });
        }
    }

    static setAnchorY(node:cc.Node, anchorY: number, rePlaceChildren:boolean = true) {
        let diffY: number = (anchorY- node.anchorY) * node.getContentSize().height * node.scaleY;

        node.anchorY = anchorY;

        node.y += diffY;

        if (rePlaceChildren) {
            node.children.forEach(child => {
                child.y -= diffY;
            });
        }
    }
}
