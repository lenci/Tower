import FiniteStateMachineState from "../../../Utilities/FiniteStateMashine/FiniteStateMachineState";
import Tower from "../Tower";
import { BrickShape } from "../../Brick/Brick";
import { BrickChangement, BrickState } from "../../Brick/BrickChangementFetcher";
import FiniteStateMachine from "../../../Utilities/FiniteStateMashine/FiniteStateMachine";
import TowerHeightRuler from "../TowerHeightRuler";

export default class TowerUnderConstructionState extends FiniteStateMachineState {

    enter(stateMachine: FiniteStateMachine, ...args) {
        let tower = <Tower>(stateMachine.owner);

        if (!tower.isNetworkClone) {
            tower.nextBrick = tower.generateRandomBrick();
            tower.nextBrick.queue();

            stateMachine.telegram("DROP_BRICK");
        }
    }

    onTelegram(stateMachine: FiniteStateMachine, message: string, ...args) {
        let tower = <Tower>(stateMachine.owner);

        switch (message) {
            case "DROP_BRICK":
                if (tower.isNetworkClone) {
                    cc.error("Tower error: " + tower.builder.playerId);

                } else {
                    let heightRuler = tower.getComponent(TowerHeightRuler);
                    if (heightRuler.checkWin()) {
                        tower.currentBrick = null;

                        stateMachine.telegram("HOLD");

                    } else {
                        tower.currentBrick = tower.nextBrick;
                        tower.nextBrick = tower.generateRandomBrick();
                        tower.nextBrick.queue();

                        tower.currentBrick.node.on("BRICK_PLACED", (event: cc.Event) => {
                            stateMachine.telegram("DROP_BRICK");
                        })
                        tower.currentBrick.node.on("BRICK_GROUNDED", (event: cc.Event) => {
                            stateMachine.telegram("DROP_BRICK");
                        })
                        tower.currentBrick.fall();
                    }
                }

            case "TRANSLATE_BRICK":
                if (tower.isNetworkClone) {
                    cc.error("Tower error: " + tower.builder.playerId);

                } else {
                    if (null != tower.currentBrick) {
                        tower.currentBrick.translate(-1);
                    }
                }
                break;

            case "ROTATE_BRICK":
                if (tower.isNetworkClone) {
                    cc.error("Tower error: " + tower.builder.playerId);

                } else {
                    if (null != tower.currentBrick) {
                        tower.currentBrick.rotate(1);
                    }
                }
                break;

            case "CLONE_BRICK_FROM_NET":
                if (!tower.isNetworkClone) {
                    cc.error("Tower error: " + tower.builder.playerId);

                } else {
                    tower.generateSpecificBrick(1, BrickShape.TetrominoI);
                }
                break;

            case "SYNC_BRICK_FROM_NET":
                if (!tower.isNetworkClone) {
                    cc.error("Tower error: " + tower.builder.playerId);

                } else {
                    let brickChangement: BrickChangement = args[0] as BrickChangement;
                    let brick = tower.getBrickById(brickChangement.brickId);

                    if (brickChangement.hasStateChanged) {
                        switch (brickChangement.newState) {
                            case BrickState.QUEUEING:
                                tower.nextBrick = brick;
                                tower.nextBrick.queue();
                                break;
                            case BrickState.FALLING:
                                if (tower.nextBrick == brick) {
                                    tower.nextBrick = null;
                                }
                                tower.currentBrick = brick;
                                tower.currentBrick.fall();
                                break;
                            case BrickState.PLACED:
                                if (tower.currentBrick == brick) {
                                    tower.currentBrick = null;
                                }
                                brick.place();
                                break;
                            case BrickState.GROUNDED:
                                if (tower.currentBrick == brick) {
                                    tower.currentBrick = null;
                                }
                                brick.ground();
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

            case "MAGIC_TO_BRICK":
                if (null != tower.currentBrick) {
                }
                break;

            case "HOLD":
                stateMachine.changeState(Tower.HoldingState);
                break;

            case "COLLAPSE":
                stateMachine.changeState(Tower.CollapsedState);
                break;

            default:
                super.onTelegram(stateMachine, message, args);
        }
    }
}
