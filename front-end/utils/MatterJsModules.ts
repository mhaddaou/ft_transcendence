import Matter, { Events, Engine, World, Bodies } from "matter-js";
import io, { Socket } from "socket.io-client"

interface MatterModules {
    Engine: typeof Matter.Engine;
    Render: typeof Matter.Render;
    Runner: typeof Matter.Runner;
    Bodies: typeof Matter.Bodies;
    Body: typeof Matter.Body;
    Composite: typeof Matter.Composite;
    Mouse: typeof Matter.Mouse;
    MouseConstraint: typeof Matter.MouseConstraint;
}

interface MatterObjects {
    engine: any
    render: any
    runner: any
    mouse: any
    mouseConstraint: any
}

interface MatterBodies {
    ball: Matter.Body
    leftPaddle: Matter.Body
    rightPaddle: Matter.Body
    myPaddle: Matter.Body
    othersPaddle: Matter.Body
    ground: Matter.Body
    roof: Matter.Body
    wall: Matter.Body
    wallLeft: Matter.Body
    circleA: Matter.Body
    circleB: Matter.Body
    circleC: Matter.Body
    centerLine: Matter.Body

}
interface measurements {
    divHeight: number,
    divWidth: number,
    ball: { x: number, y: number, radius: number },
    wallBottom: { x: number, y: number, width: number, height: number },
    wallTop: { x: number, y: number, width: number, height: number },
    wallLeft: { x: number, y: number, width: number, height: number },
    wallRight: { x: number, y: number, width: number, height: number },
    leftPaddle: { x: number, y: number, width: number, height: number },
    rightPaddle: { x: number, y: number, width: number, height: number },

}

interface Score {
    left: number;
    right: number;
}

interface Players {
    p1: string,
    p2: string
}

interface SetScoreFn {
    (score: Score): void;
}
interface setModal {
    (open: boolean): void;

}
interface SetCountDownfn {
    (countDown: number): void;
}
interface setPlayersFn {
    (players: Players): void;
}
interface gameTexture {
    leftP: string,
    rightP: string,
    wall: string,
    ball: string,
    background: string,
}
interface setWinner {
    (winner: string): void;
}
interface setGameStatus {
    (msg: boolean): void;

}
interface setGameStatusMsg {
    (msg: string): void;

}
// function saveMeasurements(div: HTMLElement, obj: measurements){
//     obj = {
//         divHeight: div.clientHeight,
//         divWidth: div.clientWidth,
//         wallBottom: {x: div.clientWidth / 2, y : div.clientHeight, width: div.clientWidth, height: 20},
//         wallTop: {x: div.clientWidth / 2, y : 0, width: div.clientWidth, height: 20},
//         wallLeft: {x: 0, y : div.clientHeight / 2, width: 20, height: div.clientHeight},
//         wallRight: {x: div.clientWidth , y : div.clientHeight / 2, width: 20, height: div.clientHeight},
//     }
// }
export class MatterJsModules {
    socket: Socket | undefined
    modules: MatterModules;
    objects: MatterObjects = { engine: null, render: null, runner: null, mouse: null, mouseConstraint: null };
    bodies: MatterBodies
    paddleSide: string = ""
    matterContainer = document.querySelector("#matter-Container") as HTMLElement
    obj: measurements
    colors: gameTexture
    oldDim: { w: number, h: number }
    // solids : solidBodies
    constructor(roomId: string | string[] | undefined, queue: boolean, socket: Socket | undefined) {
        const windowHeight = window.innerHeight;
        this.oldDim = { w: this.matterContainer.clientWidth, h: this.matterContainer.clientHeight }
        this.socket = socket
        this.obj = this.saveMeasurements({ width: this.matterContainer.clientWidth, height: this.matterContainer.clientHeight })
        this.socket?.emit('joinRoom', { roomId: roomId, queue, obj: this.obj });
        this.colors = {
            leftP: "#6DA9E4",
            rightP: "#F6BA6F",
            wall: "#FFEBEB",
            ball: "red",
            background: "#ADE4DB",
        }
        this.modules = {
            Engine: Matter.Engine,
            Render: Matter.Render,
            Runner: Matter.Runner,
            Bodies: Matter.Bodies,
            Body: Matter.Body,
            Composite: Matter.Composite,
            Mouse: Matter.Mouse,
            MouseConstraint: Matter.MouseConstraint,
        }
        this.bodies = {
            ball: this.modules.Bodies.circle(this.obj.divWidth / 2, this.obj.divHeight / 2, this.getBallRadius(), { isStatic: true, label: "ball" }),
            circleA: this.modules.Bodies.circle(this.obj.divWidth / 2, this.obj.divHeight / 2, 80, { isStatic: true, collisionFilter: { group: -1, }, render: { fillStyle: this.colors.wall }, label: "circleA" }),
            circleB: this.modules.Bodies.circle(this.obj.divWidth / 2, this.obj.divHeight / 2, 70, { isStatic: true, collisionFilter: { group: -1, }, render: { fillStyle: this.colors.background }, label: "circleB" }),
            circleC: this.modules.Bodies.circle(this.obj.divWidth / 2, this.obj.divHeight / 2, 10, { isStatic: true, collisionFilter: { group: -1, }, render: { fillStyle: this.colors.wall }, label: "circleC" }),
            centerLine: this.modules.Bodies.rectangle(this.obj.divWidth / 2, this.obj.divHeight / 2, this.obj.divWidth, 10, { isStatic: true, collisionFilter: { group: -1, }, render: { fillStyle: this.colors.wall }, label: "centerLine" }),

            leftPaddle: this.modules.Bodies.rectangle(this.obj.leftPaddle.x, this.obj.leftPaddle.y, this.getPaddleDim().width, this.getPaddleDim().height, {
                label: "lPadel",
                isStatic: true, render: {
                    fillStyle: this.colors.leftP
                }
            }),
            rightPaddle: this.modules.Bodies.rectangle(this.obj.rightPaddle.x, this.obj.rightPaddle.y, this.getPaddleDim().width, this.getPaddleDim().height, {
                label: "rPadel",
                isStatic: true, render: {
                    fillStyle: this.colors.rightP
                }
            }),
            myPaddle: this.modules.Bodies.rectangle(0, 0, 0, 0, { isStatic: true }),
            othersPaddle: this.modules.Bodies.rectangle(0, 0, 0, 0, { isStatic: true }),
            roof: this.modules.Bodies.rectangle(this.obj.wallTop.x, this.obj.wallTop.y, this.obj.wallTop.width, this.obj.wallTop.height, {
                label: "roof",
                isStatic: true,
                render: {
                    fillStyle: 'blue'
                }
            }),
            ground: this.modules.Bodies.rectangle(this.obj.wallBottom.x, this.obj.wallBottom.y, this.obj.wallBottom.width, this.obj.wallBottom.height, {
                label: "ground",
                isStatic: true,
                render: {
                    fillStyle: 'red'
                }
            }),
            wall: this.modules.Bodies.rectangle(this.obj.wallRight.x, this.obj.wallRight.y, this.obj.wallRight.width, this.obj.wallRight.height, {
                label: "wallRight",
                isStatic: true,
                render: {
                    fillStyle: this.colors.wall
                }
            }),
            wallLeft: this.modules.Bodies.rectangle(this.obj.wallLeft.x, this.obj.wallLeft.y, this.obj.wallLeft.width, this.obj.wallLeft.height, {
                label: "wallLeft",
                isStatic: true,
                render: {
                    fillStyle: this.colors.wall
                }
            }),

        }

        this.socket?.on("paddleAssigned", (data) => {
            console.log("recieved paddle", data)
            this.paddleSide = data
            if (this.paddleSide == "left") {
                this.bodies.myPaddle = this.bodies.leftPaddle
                this.bodies.othersPaddle = this.bodies.rightPaddle

            } else {
                this.bodies.myPaddle = this.bodies.rightPaddle
                this.bodies.othersPaddle = this.bodies.leftPaddle

            }

            this.updateOtherPaddle()
        })

    }
    getBallRadius() {

        const widthRatio = this.matterContainer.clientWidth / 375;
        const heightRatio = this.matterContainer.clientHeight / 375 * (16 / 9)
        return 20 * widthRatio
    }

    getPaddleDim() {
        const widthRatio = this.matterContainer.clientWidth / 375;
        const heightRatio = this.matterContainer.clientHeight / 375 * (16 / 9)
        return { width: 100 * widthRatio, height: 20 * widthRatio }
    }

    saveMeasurements(div: { height: number, width: number }) {

        const obj = {
            divWidth: div.width,
            divHeight: div.height,
            ball: { x: div.height / 2, y: div.width / 2, radius: 20 },
            wallBottom: { x: div.width / 2, y: div.height, width: div.width, height: 20 },
            wallTop: { x: div.width / 2, y: 0, width: div.width, height: 20 },
            wallLeft: { x: 0, y: div.height / 2, width: 20, height: div.height },
            wallRight: { x: div.width, y: div.height / 2, width: 20, height: div.height },
            leftPaddle: { x: div.width / 2, y: 50, width: 100, height: 20 },
            rightPaddle: { x: div.width / 2, y: div.height - 50, width: 100, height: 20 },
        }
        return obj
    }
    createModules() {
        if (this.matterContainer) {

            this.objects.engine = this.modules.Engine.create();
            this.objects.render = this.modules.Render.create({
                element: this.matterContainer,
                engine: this.objects.engine,
                options: {
                    background: "transparent",
                    wireframes: false,
                    showAngleIndicator: false,
                    width: this.matterContainer.clientWidth,
                    height: this.matterContainer.clientHeight,
                }
            }),
                this.objects.runner = this.modules.Runner.create(),
                this.objects.mouse = this.modules.Mouse.create(this.objects.render.canvas),
                this.objects.mouseConstraint = this.modules.MouseConstraint.create(this.objects.engine, {
                    mouse: this.objects.mouse,
                    constraint: {
                        stiffness: 0.2,
                        render: {
                            visible: false
                        }
                    }
                })
        }
    }


    createBodies() {

        this.modules.Composite.add(this.objects.engine.world, [this.bodies.circleA, this.bodies.circleB, this.bodies.circleC, this.bodies.centerLine, this.bodies.ball, this.bodies.leftPaddle, this.bodies.wall, this.bodies.wallLeft, this.bodies.rightPaddle]);
    }
    events() {

        Events.on(this.objects.mouseConstraint, "mousemove", (e) => {
            this.modules.Body.setPosition(this.bodies.myPaddle, { x: e.mouse.position.x, y: this.bodies.myPaddle.position.y });
            const oldWidth = this.matterContainer.clientWidth;
            const oldHeight = this.matterContainer.clientHeight;
            const newWidth = 375
            const newHeight = 375 * (16 / 9)
            const { widthRatio, heightRatio } = this.getResizeRatio(oldWidth, oldHeight, newWidth, newHeight)
            this.socket?.emit(this.paddleSide, { x: e.mouse.position.x * widthRatio, y: this.bodies.myPaddle.position.y * heightRatio })

        })


    }

    run() {
        this.modules.Composite.add(this.objects.engine.world, [this.objects.mouseConstraint]);

        this.modules.Render.run(this.objects.render);
        this.modules.Runner.run(this.objects.runner, this.objects.engine);
    }

    windowSizeEvent(height: number) {


        this.onWindowSizeChange()


    }
    onWindowSizeChange() {
        function calculateRectangleVertices(dimensions: { width: number, height: number, x: number, y: number }) {
            const halfWidth = dimensions.width / 2;
            const halfHeight = dimensions.height / 2;

            const vertices = [
                { x: dimensions.x - halfWidth, y: dimensions.y - halfHeight },   // Top-left vertex
                { x: dimensions.x + halfWidth, y: dimensions.y - halfHeight },   // Top-right vertex
                { x: dimensions.x + halfWidth, y: dimensions.y + halfHeight },   // Bottom-right vertex
                { x: dimensions.x - halfWidth, y: dimensions.y + halfHeight }    // Bottom-left vertex
            ];

            return vertices;
        }

        const aspectRatio = 16 / 9; // Replace with your desired aspect ratio
        const newWidth = this.matterContainer.clientWidth; // Replace with your desired width
        const newHeight = this.matterContainer.clientHeight; // Replace with your desired height
        const oldWidth = this.oldDim.w
        const oldHeight = this.oldDim.h
        const widthRatio = newWidth / oldWidth;
        const heightRatio = newHeight / oldHeight;
        // this.modules.Body.set(ground, 'width', window.innerWidth);
        const modules = this.modules
        const dimenssions = this.obj
        const bodies = this.bodies
        this.modules.Composite.allBodies(this.objects.engine.world).forEach(function (body) {

            if (body.label !== "ball")
                Matter.Body.scale(body, widthRatio, heightRatio);
            else
                Matter.Body.scale(body, widthRatio, widthRatio);

            var newPosition = {
                x: body.position.x * widthRatio,
                y: body.position.y * heightRatio
            };
            Matter.Body.setPosition(body, newPosition);
            // var  scaleX = newScreen.w / oldScreen.w
            // var  scaleY = newScreen.h / oldScreen.h;
            // console.log(body.label)
            // if (body.label !== "ball")
            // Matter.Body.scale(body, scaleX, scaleY);
            // // Update dimensions
            // var  scaleX = newWidth / oldWidth
            // var  scaleY = newHeight / oldHeight
            // // Update position
            // var newPosition = {
            //   x: body.position.x * scaleX,
            //   y: body.position.y * scaleY
            // };
            // Matter.Body.setPosition(body, newPosition);
        });
        this.modules.Engine.update(this.objects.engine)
        this.oldDim = { w: newWidth, h: newHeight }
        this.objects.render.canvas.width = newWidth
        this.objects.render.canvas.height = newHeight
    }

    socketStuff() {
        const newWidth = this.matterContainer.clientWidth; // Replace with your desired width
        const newHeight = this.matterContainer.clientHeight; // Replace with your desired height
        const oldWidth = 375
        const oldHeight = 375 * (16 / 9)
        const widthRatio = newWidth / oldWidth;
        const heightRatio = newHeight / oldHeight;
        this.socket?.on('ballPosition', (data) => {
            const oldWidth = 375
            const oldHeight = 375 * (16 / 9)
            const newWidth = this.matterContainer.clientWidth;
            const newHeight = this.matterContainer.clientHeight;
            const { widthRatio, heightRatio } = this.getResizeRatio(oldWidth, oldHeight, newWidth, newHeight)
            // Update the ball's position
            this.bodies.ball.position.x = data.x * widthRatio
            this.bodies.ball.position.y = data.y * heightRatio
            // Matter.Body.scale(this.bodies.ball, widthRatio, widthRatio);
            // console.log(this.bodies.ball.position.x, this.bodies.ball.position.y)

        });


    }

    getResizeRatio(oldWidth: number, oldHeight: number, newWidth: number, newHeight: number) {
        const widthRatio = newWidth / oldWidth;
        const heightRatio = newHeight / oldHeight;
        return { widthRatio, heightRatio }
    }

    updateOtherPaddle() {
        if (this.paddleSide.length > 1) {
            // Update the other's paddle position
            if (this.paddleSide == "left")
                this.socket?.on("right", (data) => {
                    const oldWidth = 375
                    const oldHeight = 375 * (16 / 9)
                    const newWidth = this.matterContainer.clientWidth;
                    const newHeight = this.matterContainer.clientHeight;
                    const { widthRatio, heightRatio } = this.getResizeRatio(oldWidth, oldHeight, newWidth, newHeight)
                    this.modules.Body.setPosition(this.bodies.othersPaddle, { x: data.x * widthRatio, y: data.y * heightRatio });
                });
            else
                this.socket?.on("left", (data) => {
                    const oldWidth = 375
                    const oldHeight = 375 * (16 / 9)
                    const newWidth = this.matterContainer.clientWidth;
                    const newHeight = this.matterContainer.clientHeight;
                    const { widthRatio, heightRatio } = this.getResizeRatio(oldWidth, oldHeight, newWidth, newHeight)
                    this.modules.Body.setPosition(this.bodies.othersPaddle, { x: data.x * widthRatio, y: data.y * heightRatio });
                });

        }
    }

    updateGameScore(setScore: SetScoreFn, setCountDown: SetCountDownfn, setPlayer: setPlayersFn) {
        this.socket?.on('score', (data) => {
            const receivedScore = data.score;
            const players = data.players;
            console.log(players)
            if (players)
                setPlayer({ p1: players.player1.user.login, p2: players.player2.user.login })
            setScore(receivedScore);
            setCountDown(0)
            console.log(receivedScore)
        });
    }

    gameOverListener(setIsModalOpen: setModal, setWinner: setWinner) {
        this.socket?.on('gameOver', (data) => {
            setIsModalOpen(true);
            setWinner(data.gameOver)
        });

    }

    restartMatch(setWinner: setWinner, setRestart: setGameStatus) {
        this.socket?.emit("restart", { restart: true })
        setWinner("")
        setRestart(false)
    }

    restartGameListener(setIsModalOpen: setModal) {
        this.socket?.on('restart', (data) => {
            setIsModalOpen(false);
        });
    }

    gameStatusListener(setGameStatus: setGameStatus, setGameStatusMsg: setGameStatusMsg) {
        this.socket?.on('ready', (data) => {
            const { msg } = data
            setGameStatus(msg);
        });
        this.socket?.on('gameStatus', (data) => {
            const { msg } = data
            setGameStatusMsg(msg);
        });
        this.socket?.on('cancelGame', (data) => {
            const { msg } = data
            setGameStatusMsg(`${`${msg} canceled the invitation, fuck off`}`);
        });
    }

}


