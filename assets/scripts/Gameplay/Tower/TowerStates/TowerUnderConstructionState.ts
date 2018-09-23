import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import Tower from "../Tower";
import Brick, { BrickShape } from "../../Brick/Brick";
import { BrickChangement, BrickState } from "../../Brick/BrickChangementFetcher";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";
import TowerHeightRuler from "../TowerHeightRuler";

export default class TowerUnderConstructionState extends FiniteStateMachineState {

    async enter(stateMachine: FiniteStateMachine, ...args) {
        let tower = <Tower>(stateMachine.owner);

        if (!tower.isNetworkClone) {
            tower.nextBrick = tower.generateRandomBrick();
            tower.nextBrick.stateMachine.telegram(Brick.MSG_QUEUE);

            stateMachine.telegram(Tower.MSG_DROP_BRICK);
        }
    }

    async onTelegram(stateMachine: FiniteStateMachine, message: string, ...args) {
        let tower = <Tower>(stateMachine.owner);

        switch (message) {
            case Tower.MSG_DROP_BRICK:
                if (tower.isNetworkClone) {
                    cc.error("Tower error: " + tower.builder.player.id);

                } else {
                    let heightRuler = tower.getComponent(TowerHeightRuler);
                    if (heightRuler.checkWin()) {
                        tower.currentBrick = null;

                        stateMachine.telegram(Tower.MSG_HOLD);

                    } else {
                        tower.currentBrick = tower.nextBrick;
                        tower.nextBrick = tower.generateRandomBrick();
                        tower.nextBrick.stateMachine.telegram(Brick.MSG_QUEUE);

                        tower.currentBrick.node.on(Brick.EVT_PLACED, () => {
                            stateMachine.telegram(Tower.MSG_DROP_BRICK);
                        })
                        tower.currentBrick.node.on(Brick.EVT_LOST, () => {
                            stateMachine.telegram(Tower.MSG_DROP_BRICK);
                        })
                        tower.currentBrick.stateMachine.telegram(Brick.MSG_FALL);
                    }
                }

            case Tower.MSG_TRANSLATE_BRICK:
                if (tower.isNetworkClone) {
                    cc.error("Tower error: " + tower.builder.player.id);

                } else {
                    if (null != tower.currentBrick) {
                        tower.currentBrick.stateMachine.telegram(Brick.MSG_TRANSLATE, args[0]);
                    }
                }
                break;

            case Tower.MSG_ROTATE_BRICK:
                if (tower.isNetworkClone) {
                    cc.error("Tower error: " + tower.builder.player.id);

                } else {
                    if (null != tower.currentBrick) {
                        tower.currentBrick.stateMachine.telegram(Brick.MSG_ROTATE, args[0]);
                    }
                }
                break;

            case Tower.MSG_CLONE_BRICK_FROM_NET:
                if (!tower.isNetworkClone) {
                    cc.error("Tower error: " + tower.builder.player.id);

                } else {
                    tower.generateSpecificBrick(1, BrickShape.TetrominoI);
                }
                break;

            case Tower.MSG_SYNC_BRICK_FROM_NET:
                if (!tower.isNetworkClone) {
                    cc.error("Tower error: " + tower.builder.player.id);

                } else {
                    let brickChangement: BrickChangement = args[0] as BrickChangement;
                    let brick = tower.getBrickById(brickChangement.brickId);

                    if (brickChangement.hasStateChanged) {
                        switch (brickChangement.newState) {
                            case BrickState.QUEUEING:
                                tower.nextBrick = brick;
                                tower.nextBrick.stateMachine.telegram(Brick.MSG_QUEUE);
                                break;
                            case BrickState.FALLING:
                                if (tower.nextBrick == brick) {
                                    tower.nextBrick = null;
                                }
                                tower.currentBrick = brick;
                                tower.currentBrick.stateMachine.telegram(Brick.MSG_FALL);
                                break;
                            case BrickState.PLACED:
                                if (tower.currentBrick == brick) {
                                    tower.currentBrick = null;
                                }
                                brick.place();
                                break;
                            case BrickState.LOST:
                                if (tower.currentBrick == brick) {
                                    tower.currentBrick = null;
                                }
                                brick.lose();
                                tower.removeBrick(brick.id);
                                break;
                        }
                    }

                    if (brickChangement.hasPositionChanged) {
                        brick.syncPosition(brickChangement.newPosition);
                    }

                    if (brickChangement.hasRotationChanged) {
                        brick.syncRotation(brickChangement.newRotation);
                    }
                }
                break;

            case Tower.MSG_MAGIC_TO_BRICK:
                if (null != tower.currentBrick) {
                }
                break;

            case Tower.MSG_HOLD:
                stateMachine.changeState(Tower.holdingState);
                break;

            case Tower.MSG_COLLAPSE:
                stateMachine.changeState(Tower.collapsedState);
                break;

            default:
                super.onTelegram(stateMachine, message, args);
        }
    }
}
