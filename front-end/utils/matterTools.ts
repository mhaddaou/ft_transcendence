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
export class matterJsModules {
    socket: Socket
    modules: MatterModules;
    test: Matter.Body;
    objects: MatterObjects = { engine: null, render: null, runner: null, mouse: null, mouseConstraint: null };
    bodies: MatterBodies
    paddleSide: string = ""
    matterContainer = document.querySelector("#matter-Container") as HTMLElement
    obj: measurements
    constructor(roomId: string) {
        this.socket = io('http://localhost:3008');
        this.obj = this.saveMeasurements(this.matterContainer)
        this.socket.emit('joinRoom', { roomId: roomId, obj: this.obj });
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
        this.test = this.modules.Bodies.circle(400, 240, 20, { isStatic: true })
        this.bodies = {
            ball: this.modules.Bodies.circle(500, 500, 20, { label: "ball" }),

            leftPaddle: this.modules.Bodies.rectangle(this.obj.leftPaddle.x, this.obj.leftPaddle.y, this.obj.leftPaddle.width, this.obj.leftPaddle.height, {
                label: "lPadel",
                isStatic: true, render: {
                    fillStyle: 'green'
                }
            }),
            rightPaddle: this.modules.Bodies.rectangle(this.obj.rightPaddle.x, this.obj.rightPaddle.y, this.obj.rightPaddle.width, this.obj.rightPaddle.height, {
                label: "rPadel",
                isStatic: true, render: {
                    fillStyle: 'red'
                }
            }),
            myPaddle: this.modules.Bodies.rectangle(0, 0, 0, 0, { isStatic: true }),
            othersPaddle: this.modules.Bodies.rectangle(0, 0, 0, 0, { isStatic: true }),
            roof: this.modules.Bodies.rectangle(this.obj.wallTop.x, this.obj.wallTop.y, this.obj.wallTop.width, this.obj.wallTop.height, {
                isStatic: true,
                render: {
                    fillStyle: 'blue'
                }
            }),
            ground: this.modules.Bodies.rectangle(this.obj.wallBottom.x, this.obj.wallBottom.y, this.obj.wallBottom.width, this.obj.wallBottom.height, {
                isStatic: true,
                render: {
                    fillStyle: 'red'
                }
            }),
            wall: this.modules.Bodies.rectangle(this.obj.wallRight.x, this.obj.wallRight.y, this.obj.wallRight.width, this.obj.wallRight.height, {
                isStatic: true,
                render: {
                    fillStyle: 'green'
                }
            }),
            wallLeft: this.modules.Bodies.rectangle(this.obj.wallLeft.x, this.obj.wallLeft.y, this.obj.wallLeft.width, this.obj.wallLeft.height, {
                isStatic: true,
                render: {
                    fillStyle: 'green'
                }
            }),

        }
        this.socket.on("paddleAssigned", (data) => {
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

    saveMeasurements(div: HTMLElement) {
        console.log("height ", div.clientHeight)
        console.log("width ", div.clientWidth)
        const obj = {
            divHeight: div.clientHeight,
            divWidth: div.clientWidth,
            ball: { x: 30, y: 30, radius:  20 },
            wallBottom: { x: div.clientWidth / 2, y: div.clientHeight, width: div.clientWidth, height: 20 },
            wallTop: { x: div.clientWidth / 2, y: 0, width: div.clientWidth, height: 20 },
            wallLeft: { x: 0, y: div.clientHeight / 2, width: 20, height: div.clientHeight },
            wallRight: { x: div.clientWidth, y: div.clientHeight / 2, width: 20, height: div.clientHeight },
            leftPaddle: { x: div.clientWidth / 2 , y: 50, width: 100, height: 20 },
            rightPaddle: { x: div.clientWidth / 2, y: div.clientHeight - 50, width: 100, height: 20 },
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
    // createModules() {
    //     this.objects.engine = this.modules.Engine.create(),
    //         this.objects.render = this.modules.Render.create({
    //             element: document.body,
    //             engine: this.objects.engine,
    //             options: {
    //                 background: "transparent",
    //                 wireframes: false,
    //                 width: 1000,
    //                 height: 600,
    //             }
    //         }),
    //         this.objects.runner = this.modules.Runner.create(),
    //         this.objects.mouse = this.modules.Mouse.create(this.objects.render.canvas),
    //         this.objects.mouseConstraint = this.modules.MouseConstraint.create(this.objects.engine, {
    //             mouse: this.objects.mouse,
    //             constraint: {
    //                 stiffness: 0.2,
    //                 render: {
    //                     visible: false
    //                 }
    //             }
    //         })
    // }

    createBodies() {

        this.modules.Composite.add(this.objects.engine.world, [this.bodies.ball, this.test, this.bodies.leftPaddle, this.bodies.ground, this.bodies.roof, this.bodies.wall, this.bodies.wallLeft, this.bodies.rightPaddle]);
    }
    events() {

        Events.on(this.objects.mouseConstraint, "mousemove", (e) => {
            this.modules.Body.setPosition(this.bodies.myPaddle, { x: e.mouse.position.x, y: this.bodies.myPaddle.position.y });
            console.log(this.bodies.myPaddle.position)
            this.socket?.emit(this.paddleSide, { x:  e.mouse.position.x, y: this.bodies.myPaddle.position.y})

        })

        Events.on(this.objects.mouseConstraint, "mouseup", (e) => {
            // this.modules.Body.setVelocity(this.bodies.ball, { x: 5, y: 5 });
            this.socket?.emit("mouseUp", { x: this.bodies.myPaddle.position.x, y: e.mouse.position.y })

        })
    }

    run() {
        this.modules.Composite.add(this.objects.engine.world, [this.objects.mouseConstraint]);

        this.modules.Render.run(this.objects.render);
        this.modules.Runner.run(this.objects.runner, this.objects.engine);
    }

    socketStuff() {
        this.socket.on('ballPosition', (data) => {
            // Update the ball's position
            this.bodies.ball.position.x = this.obj.divWidth * data.x / 375
            this.bodies.ball.position.y = this.obj.divHeight * data.y / 667
            // console.log(this.bodies.ball.position.x, this.bodies.ball.position.y)

        });


    }

    updateOtherPaddle() {
        if (this.paddleSide.length > 1) {
            // Update the other's paddle position
            if (this.paddleSide == "left")
                this.socket.on("right", (data) => {
                    console.log("we got ipdated")
                    this.modules.Body.setPosition(this.bodies.othersPaddle, { x: data.x , y:  data.y});
                });
            else
                this.socket.on("left", (data) => {
                    this.modules.Body.setPosition(this.bodies.othersPaddle, { x: data.x, y: data.y });
                });

        }
    }

    responsivity(oldScreen: { w: number, h: number }, newScreen: { w: number, h: number }, setHeight: (value: React.SetStateAction<string>) => void) {
        console.log(oldScreen)
        console.log(newScreen)
        // setHeight(`${newScreen.h - 1}vh`)
        this.obj.divWidth = newScreen.w
        this.obj.divHeight= newScreen.h
        this.objects.render.canvas.width = newScreen.w
        this.objects.render.canvas.height = newScreen.h
        this.modules.Composite.allBodies(this.objects.engine.world).forEach(function(body) {
            // Update dimensions
            var  scaleX = newScreen.w / oldScreen.w
            var  scaleY = newScreen.h / oldScreen.h;
            console.log(body.label)
            const scale = (newScreen.w / oldScreen.w + newScreen.h / oldScreen.h) / 2;

            if (body.label !== "ball")
            Matter.Body.scale(body, scaleX, scaleY);
            else
            Matter.Body.scale(body, scale, scale);

            if (body.label == "lPadel")
                console.log(body.bounds.max.x - body.bounds.min.x)
            // Update position
            var newPosition = {
              x: body.position.x * scaleX,
              y: body.position.y * scaleY
            };
            Matter.Body.setPosition(body, newPosition);
          });
          this.socket?.emit("windowResize", { newScreen: newScreen })
        // for (var i = 0; i < this.objects.engine.world.bodies.length; i++) {
        //     var body = this.objects.engine.world.bodies[i];
        //     console.log(body.width)
        //     this.modules.Body.setPosition(body, {
        //         x: body.position.x * (newScreen.w / oldScreen.w),
        //         y: body.position.y * (newScreen.h / oldScreen.h)
        //     });

        // }


    }



}




// createModules() {
//     const matterContainer = document.querySelector("#matter-Container") as HTMLElement
//     if (matterContainer){

//         this.objects.engine = this.modules.Engine.create();
//         this.objects.render = this.modules.Render.create({
//             element: matterContainer,
//             engine: this.objects.engine,
//             options: {
//                 background: "transparent",
//                 wireframes: true,
//                 showAngleIndicator: true,
//                 width: matterContainer.clientWidth,
//                 height: matterContainer.clientHeight,
//             }
//         }),
//         this.objects.runner = this.modules.Runner.create(),
//         this.objects.mouse = this.modules.Mouse.create(this.objects.render.canvas),
//         this.objects.mouseConstraint = this.modules.MouseConstraint.create(this.objects.engine, {
//             mouse: this.objects.mouse,
//             constraint: {
//                 stiffness: 0.2,
//                 render: {
//                     visible: false
//                 }
//             }
//         })
//     }
// }