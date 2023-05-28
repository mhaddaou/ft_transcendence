import { WebSocketGateway, WebSocketServer, OnGatewayInit, ConnectedSocket, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Body, Engine, World, Bodies, Composite } from 'matter-js';
import WebSocket from 'ws';

interface measurements{
    divHeight: number,
    divWidth: number,
    ball:{ x: number, y: number, radius: number},
    wallBottom:{ x: number, y: number, width: number, height: number },
    wallTop:{ x: number, y: number, width: number, height: number },
    wallLeft:{ x: number, y: number, width: number, height: number },
    wallRight:{ x: number, y: number, width: number, height: number },
    leftPaddle:{ x: number, y: number, width: number, height: number },
    rightPaddle:{ x: number, y: number, width: number, height: number },

}
interface aspectRatio{
    w: number
    h: number
    ratio: number
}

class matterNode {
    private aspectRatio: aspectRatio;
    private engine: Engine;
    private world: World;
    private ball: any;
    private leftPaddle: any;
    private rightPaddle: any;
    private paddles: {}  // contains the actual matter-js objects for the paddles
    private availablePaddles = ['left', 'right']; // List of available paddles
    private server: any
    private roomId: string
    private obj: measurements  // window measurements, and positions of some objects

    constructor(server: any, roomId: string, obj: measurements ) {
        this.aspectRatio = {
            w: 375,
            h: 667,
            ratio: 16/9,
        }
        this.roomId = roomId
        this.server = server;
        // cords and measurements of objects
        this.obj = obj
        // this.translateCords() // translate the cords from frontend screen to backend screen
        obj = this.obj
        this.engine = Engine.create();
        this.world = this.engine.world;
        this.engine.gravity = {
            x: 0,
            y: 0,
            scale: 0
        };
        this.ball = Bodies.circle(this.obj.ball.x, this.obj.ball.y, this.obj.ball.radius, { label: "ball", restitution: 1.05, friction: 0, frictionAir: 0, density: 0.1 });
        this.leftPaddle = Bodies.rectangle(this.obj.leftPaddle.x, this.obj.leftPaddle.y, this.obj.leftPaddle.width, this.obj.leftPaddle.height, { label: "leftPaddle", isStatic: true });
        this.rightPaddle = Bodies.rectangle(this.obj.rightPaddle.x, this.obj.rightPaddle.y, this.obj.rightPaddle.width, this.obj.rightPaddle.height, {label: "rightPaddle", isStatic: true })
        this.paddles = { left: this.leftPaddle, right: this.rightPaddle }
        var roof = Bodies.rectangle(obj.wallTop.x, obj.wallTop.y, obj.wallTop.width, obj.wallTop.height, {
            isStatic: true,
            render: {
                fillStyle: 'blue'
            }
        });
        var wallLeft = Bodies.rectangle(obj.wallLeft.x, obj.wallLeft.y, obj.wallLeft.width, obj.wallLeft.height, {
            label:"leftwall",
            isStatic: true,
            render: {
                fillStyle: 'green'
            }
        });
        Body.setVelocity(this.ball, { x: 2, y: 5 });

        var ground = Bodies.rectangle(obj.wallBottom.x, obj.wallBottom.y, obj.wallBottom.width, obj.wallBottom.height, {
            isStatic: true,
            render: {
                fillStyle: 'red'
            }
        });
        var wall = Bodies.rectangle(obj.wallRight.x, obj.wallRight.y, obj.wallRight.width, obj.wallRight.height, {
            isStatic: true,
            render: {
                fillStyle: 'green'
            }
        });

        World.add(this.world, [this.ball, ground, wall, wallLeft, this.leftPaddle, this.rightPaddle]);
        // Start the engine and update the ball's position
        Engine.run(this.engine);

    }

    sendBallPosition() {
        setInterval(() => {
            if (this.availablePaddles.length ){
                const availablePaddle = this.availablePaddles[0]
                Body.setPosition(this.paddles[availablePaddle], { x: this.ball.position.x, y: this.paddles[availablePaddle].position.y });
                this.server.to(this.roomId).emit(availablePaddle, { x: this.ball.position.x, y: this.paddles[availablePaddle].position.y }); 
            }
            this.server.to(this.roomId).emit('ballPosition', { x: this.ball.position.x, y: this.ball.position.y });
            if (this.ball.position.y < 5)
            console.log("bottom player won")
            // Send the paddle assignment to the client


        }, 1000 / 60);
    }
    handleConnection(client: Socket) {
        console.log("someone got in")
        const availablePaddle = this.availablePaddles.shift(); // Get the next available paddle
        if (availablePaddle) {
            client.emit('paddleAssigned', availablePaddle); // Send the paddle assignment to the client
            client.data.paddle = availablePaddle; // Set the paddle assignment to the client
            client.on(availablePaddle, (data: WebSocket.Data) => {
                Body.setPosition(this.paddles[availablePaddle], { x: this.aspectRatio.w * data.x / this.obj.divWidth, y: this.aspectRatio.h * data.y / this.obj.divHeight });
                // Send the paddle assignment to the client
                this.server.to(this.roomId).emit(availablePaddle, { x: this.aspectRatio.w * data.x / this.obj.divWidth, y: this.aspectRatio.h * data.y / this.obj.divHeight }); 
            });
            client.on("mouseUp", (data: WebSocket.Data) => {
                Body.setPosition(this.paddles[availablePaddle], { x: this.aspectRatio.w * data.x / this.obj.divWidth, y: this.aspectRatio.h * data.y / this.obj.divHeight });
                // Send the paddle assignment to the client
                Body.setVelocity(this.ball, { x: 5, y:0});
                this.server.to(this.roomId).emit(availablePaddle, { x: this.aspectRatio.w * data.x / this.obj.divWidth, y: this.aspectRatio.h * data.y / this.obj.divHeight }); 
            });
    
   
        } else {
            console.log("joining user  forced to disconnect")
            client.disconnect(); // No available paddles, disconnect the user
        }
    }

    handleDisconnect(client: Socket) {
        console.log("user left and his paddle is:", client.data.paddle)
        if (client.data !== undefined)
        this.availablePaddles.push(client.data.paddle)
        console.log(this.availablePaddles)
    }


}

@WebSocketGateway(3008, { cors: "*" })
export class GameGateway implements OnGatewayInit {
    @WebSocketServer() server;
    private worlds = {};
    private world: matterNode
    constructor() { }
    afterInit() {
        this.worlds = {};
        //     console.log("server")
        //     console.log(this.server)
        //     this.MatterNode = new matterNode(this.server)
        //     this.MatterNode.sendBallPosition()

    }

  
    @SubscribeMessage('joinRoom')

    handleJoinRoom(@MessageBody() data: { roomId: string,  obj: measurements }, @ConnectedSocket() client: Socket) {
        const { roomId } = data;
        console.log("user joined room", roomId, "and page height is", data)
        if (!this.worlds[roomId]) {
            this.world = new matterNode(this.server, roomId, data.obj);
            this.worlds[roomId] = this.world
        }
        else
            this.world = this.worlds[roomId];

        client.join(roomId); // add the client to the specified room
        this.world.handleConnection(client)
        this.world.sendBallPosition()

    }

    handleConnection(client: Socket) {
        console.log("user connected handle connection.")
    }

    handleDisconnect(client: Socket) {
        console.log(this.world)
        this.world?.handleDisconnect(client);
    }

}