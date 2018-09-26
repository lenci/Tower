const { ccclass, property } = cc._decorator;

class Vertex {
    point: cc.Vec2 = new cc.Vec2(0, 0);
    edges: Edge[] = [];

    pointShrinked: cc.Vec2 = new cc.Vec2(0, 0);

    collider: cc.PhysicsBoxCollider = null;

    constructor(point: cc.Vec2) {
        this.point.x = point.x;
        this.point.y = point.y;
    }

    initCollider(collider: cc.PhysicsBoxCollider) {
        this.collider = collider;
    }
}

class Edge {
    vertices: Vertex[] = [];
    direction: cc.Vec2 = new cc.Vec2(0, 0);

    collider: cc.PhysicsBoxCollider = null;

    constructor(vertex1: Vertex, vertex2: Vertex) {
        this.vertices.push(vertex1);
        this.vertices.push(vertex2);

        vertex1.edges.push(this);
        vertex2.edges.push(this);
    }

    initCollider(collider: cc.PhysicsBoxCollider) {
        this.collider = collider;
    }
}
@ccclass
export default class PlaygroundCollider extends cc.Component {

    private _bodyCollider: cc.PhysicsPolygonCollider = null;

    private _vertices: Vertex[] = [];
    private _edges: Edge[] = [];

    private static _SHRINKING: number = 0.5;
    private static _VERTEX_SENSOR_SIZE: number = 10;

    onLoad() {
        this._bodyCollider = this.getComponent(cc.PhysicsPolygonCollider);

        this._createVerticesAndEdges(this._bodyCollider.points);
        this._shrinkBodyCollider();
        this._createVertexSensors();
        this._createEdgeSensors();
    }

    onDestroy() {
        this._destroyVertexSensors();
        this._destroyEdgeSensors();
    }

    private _createVerticesAndEdges(points: cc.Vec2[]) {
        for (let i: number = 0; i < points.length; ++i) {
            let vertex: Vertex = new Vertex(points[i]);
            this._vertices.push(vertex);
        }

        for (let i: number = 0; i < this._vertices.length; ++i) {
            let edge: Edge = new Edge(this._vertices[i], this._vertices[(i + 1) % this._vertices.length]);
            if (edge.vertices[0].point.x == edge.vertices[1].point.x && edge.vertices[0].point.y != edge.vertices[1].point.y) {
                edge.direction.x = NaN;
                edge.direction.y = 0;
            } else if (edge.vertices[0].point.x != edge.vertices[1].point.x && edge.vertices[0].point.y == edge.vertices[1].point.y) {
                edge.direction.x = 0;
                edge.direction.y = NaN;
            } else {
                cc.error("brick shape error");
                return;
            }
            this._edges.push(edge);
        }

        this._edges.forEach(edge => {
            if (0 == edge.direction.x) {
                let edgeUpCount: number = 0
                let x: number = edge.vertices[0].point.x + (edge.vertices[1].point.x - edge.vertices[0].point.x) * Math.PI / 10;
                this._edges.forEach(edge2 => {
                    if (0 == edge2.direction.x && edge2 != edge) {
                        if (x > Math.min(edge2.vertices[0].point.x, edge2.vertices[1].point.x) &&
                            x < Math.max(edge2.vertices[0].point.x, edge2.vertices[1].point.x)) {
                            if (edge2.vertices[0].point.y > edge.vertices[0].point.y) {
                                ++edgeUpCount;
                            }

                        }
                    }
                });
                if (0 == edgeUpCount % 2) {
                    edge.direction.y = 1;
                } else {
                    edge.direction.y = -1;
                }

            } else if (0 == edge.direction.y) {
                let edgeRightCount: number = 0
                let y: number = edge.vertices[0].point.y + (edge.vertices[1].point.y - edge.vertices[0].point.y) * Math.PI / 10;
                this._edges.forEach(edge2 => {
                    if (0 == edge2.direction.y && edge2 != edge) {
                        if (y > Math.min(edge2.vertices[0].point.y, edge2.vertices[1].point.y) &&
                            y < Math.max(edge2.vertices[0].point.y, edge2.vertices[1].point.y)) {
                            if (edge2.vertices[0].point.x > edge.vertices[0].point.x) {
                                ++edgeRightCount;
                            }
                        }
                    }
                });
                if (0 == edgeRightCount % 2) {
                    edge.direction.x = 1;
                } else {
                    edge.direction.x = -1;
                }
            }
        });
    }

    private _shrinkBodyCollider() {
        this._bodyCollider.points = [];

        for (let i: number = 0; i < this._vertices.length; ++i) {
            const vertex: Vertex = this._vertices[i];
            let point: cc.Vec2 = new cc.Vec2(vertex.point.x, vertex.point.y);
            for (let j: number = 0; j < 2; ++j) {
                const edge: Edge = vertex.edges[j];
                if (0 == edge.direction.x) {
                    point.y -= edge.direction.y * PlaygroundCollider._SHRINKING;
                } else if (0 == edge.direction.y) {
                    point.x -= edge.direction.x * PlaygroundCollider._SHRINKING;
                }
            }
            vertex.pointShrinked.x = point.x;
            vertex.pointShrinked.y = point.y;
            this._bodyCollider.points.push(point);
        }

        this._bodyCollider.apply();
    }

    private _createVertexSensors() {
        this._vertices.forEach(vertex => {
            vertex.collider = this.addComponent(cc.PhysicsBoxCollider);
            vertex.collider.offset.x = vertex.pointShrinked.x - (vertex.point.x - vertex.pointShrinked.x) / PlaygroundCollider._SHRINKING * PlaygroundCollider._VERTEX_SENSOR_SIZE / 2;
            vertex.collider.offset.y = vertex.pointShrinked.y - (vertex.point.y - vertex.pointShrinked.y) / PlaygroundCollider._SHRINKING * PlaygroundCollider._VERTEX_SENSOR_SIZE / 2;
            vertex.collider.size = new cc.Size(PlaygroundCollider._VERTEX_SENSOR_SIZE, PlaygroundCollider._VERTEX_SENSOR_SIZE);
            vertex.collider.apply();

            vertex.collider.sensor = true;
            vertex.collider.enabled = false;
        });
    }

    private _createEdgeSensors() {
        this._edges.forEach(edge => {
            edge.collider = this.addComponent(cc.PhysicsBoxCollider);
            if (0 == edge.direction.x) {
                edge.collider.offset.x = (edge.vertices[0].collider.offset.x + edge.vertices[1].collider.offset.x) / 2;
                edge.collider.offset.y = edge.vertices[0].collider.offset.y;
                edge.collider.size.width = Math.abs(edge.vertices[0].collider.offset.x - edge.vertices[1].collider.offset.x) - PlaygroundCollider._VERTEX_SENSOR_SIZE;
                edge.collider.size.height = PlaygroundCollider._VERTEX_SENSOR_SIZE;
            } else if (0 == edge.direction.y) {
                edge.collider.offset.x = edge.vertices[0].collider.offset.x;
                edge.collider.offset.y = (edge.vertices[0].collider.offset.y + edge.vertices[1].collider.offset.y) / 2;
                edge.collider.size.width = PlaygroundCollider._VERTEX_SENSOR_SIZE;
                edge.collider.size.height = Math.abs(edge.vertices[0].collider.offset.y - edge.vertices[1].collider.offset.y) - PlaygroundCollider._VERTEX_SENSOR_SIZE;
            }
            edge.collider.apply();

            edge.collider.sensor = true;
            edge.collider.enabled = false;
        })
    }

    private _destroyVertexSensors() {
        this._vertices.forEach(vertex => {
            vertex.collider.destroy();
        });
    }

    private _destroyEdgeSensors() {
        this._edges.forEach(edge => {
            edge.collider.destroy();
        })
    }

    enableEdgeSensors(direction: cc.Vec2) {
        this._edges.forEach(edge => {
            if (edge.direction.x == direction.x && edge.direction.y == direction.y) {
                edge.collider.enabled = true;
            }
        });
    }

    disableEdgeSensors(direction: cc.Vec2) {
        this._edges.forEach(edge => {
            if (edge.direction.x == direction.x && edge.direction.y == direction.y) {
                edge.collider.enabled = false;
            }
        });
    }

    enableVertexSensors() {
        this._vertices.forEach(vertex => {
            vertex.collider.enabled = true;
        });
    }

    disableVertexSensors() {
        this._vertices.forEach(vertex => {
            vertex.collider.enabled = false;
        });
    }

    enableBodyCollider() {
        this._bodyCollider.enabled = true;
    }

    disableBodyCollider() {
        this._bodyCollider.enabled = false;
    }

    resize(scale: number) {
        this._destroyVertexSensors();
        this._destroyEdgeSensors();

        let points: cc.Vec2[] = [];
        this._vertices.forEach(vertex => {
            points.push(vertex.point.mul(scale));
        });
        this._vertices = [];
        this._edges = [];

        this._createVerticesAndEdges(points);
        this._shrinkBodyCollider();
        this._createVertexSensors();
        this._createEdgeSensors();
    }
}
