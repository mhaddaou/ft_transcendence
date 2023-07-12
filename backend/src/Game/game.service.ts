import { Server, Socket } from 'socket.io';
import { User, channel } from '.prisma/client';
import { Body, Engine, World, Bodies, Events, Composite } from 'matter-js';
import WebSocket from 'ws';
import { BadRequestException } from '@nestjs/common';
import { EventEmitter } from 'events';
import { storeMatchDto } from 'src/user/dto/user.dto';

export interface measurements {
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
function saveMeasurements(div: { height: number, width: number }) {

    const obj = {
        divWidth: div.width,
        divHeight: div.height,
        ball: { x: div.width / 2, y: div.height / 2, radius: 20 },
        wallBottom: { x: div.width / 2, y: div.height, width: div.width, height: 20 },
        wallTop: { x: div.width / 2, y: 0, width: div.width, height: 20 },
        wallLeft: { x: 0, y: div.height / 2, width: 20, height: div.height },
        wallRight: { x: div.width, y: div.height / 2, width: 20, height: div.height },
        leftPaddle: { x: div.width / 2, y: 50, width: 100, height: 20 },
        rightPaddle: { x: div.width / 2, y: div.height - 50, width: 100, height: 20 },
    }
    return obj
}
export function userInGame(login: string, worlds: {}) {
    for (const user in worlds) {
        if (worlds[user] && worlds[user].players.player2.user && worlds[user].players.player2.user.login === login)
            return user
        if (worlds[user] && worlds[user].players.player1.user && worlds[user].players.player1.user.login === login)
            return user
    }

    return null
}



export function checkQueue(worlds: {}) {
    for (const user in worlds) {
        if (worlds[user] && worlds[user].openGame && worlds[user].availablePaddles.length)
            return user
    }

    return null
}

export class matterNode {
    private engine: Engine;
    private world: World;
    private ball: any;
    private wall: any;
    private wallLeft: any;
    private leftPaddle: any;
    private rightPaddle: any;
    private paddles: {}  // contains the actual matter-js objects for the paddles
    private availablePaddles = ['left', 'right']; // List of available paddles
    public server: any
    public roomId: string
    private obj: measurements  // window measurements, and positions of some objects
    private intervalId: NodeJS.Timeout | null;
    private score = { left: 0, right: 0 }
    private winner = ""
    private ready = true
    private eventEmitter: EventEmitter;
    public openGame = false
    public hostSocket: string
    public players: {
        player1: { user: User; client: string };
        player2: { user: User; client: string };
    } = {
            player1: { user: null, client: null },
            player2: { user: null, client: null },
        };
    private restart : boolean
    constructor(server: any, roomId: string, obj: measurements, openGame: boolean, clientSocket: string) {
        this.hostSocket = clientSocket
        this.roomId = roomId
        this.server = server;
        this.openGame = openGame
        this.restart = true
        // event emitter to signal the socket gateway that a match score needs saving
        this.eventEmitter = new EventEmitter();
        // cords and measurements of objects
        this.obj = saveMeasurements({ width: 375, height: 375 * (16 / 9) })
        // this.translateCords() // translate the cords from frontend screen to backend screen
        obj = this.obj
        this.engine = Engine.create();
        this.world = this.engine.world;
        this.engine.gravity = {
            x: 0,
            y: 0,
            scale: 0
        };
        this.ball = Bodies.circle(-155, this.obj.ball.y, this.obj.ball.radius, { label: "ball", restitution: 1.1, friction: 0, frictionAir: 0, density: 10 });
        this.leftPaddle = Bodies.rectangle(this.obj.leftPaddle.x, this.obj.leftPaddle.y,  this.obj.leftPaddle.width, this.obj.leftPaddle.height, { label: "leftPaddle", isStatic: true });
        this.rightPaddle = Bodies.rectangle(this.obj.rightPaddle.x, this.obj.rightPaddle.y, this.obj.rightPaddle.width, this.obj.rightPaddle.height, { label: "rightPaddle", isStatic: true })
        this.paddles = { left: this.leftPaddle, right: this.rightPaddle }
        var roof = Bodies.rectangle(obj.wallTop.x, obj.wallTop.y, obj.wallTop.width, obj.wallTop.height, {
            isStatic: true,
            render: {
                fillStyle: 'blue'
            }
        });
        this.wallLeft = Bodies.rectangle(obj.wallLeft.x, obj.wallLeft.y, obj.wallLeft.width, obj.wallLeft.height, {
            label: "leftwall",
            isStatic: true,
            render: {
                fillStyle: 'green'
            }
        });
        // Body.setVelocity(this.ball, { x: 5, y: 6 });

        var ground = Bodies.rectangle(obj.wallBottom.x, obj.wallBottom.y, obj.wallBottom.width, obj.wallBottom.height, {
            isStatic: true,
            render: {
                fillStyle: 'red'
            }
        });
        this.wall = Bodies.rectangle(obj.wallRight.x, obj.wallRight.y, obj.wallRight.width, obj.wallRight.height, {
            isStatic: true,
            render: {
                fillStyle: 'green'
            }
        });

        World.add(this.world, [this.ball, this.wall, this.wallLeft, this.leftPaddle, this.rightPaddle]);
        // Start the engine and update the ball's position
        Engine.run(this.engine);
        Events.on(this.engine, 'collisionStart', (event) => {
            const pairs = event.pairs;
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i];
                if (pair.bodyA === this.ball && pair.bodyB === this.wallLeft) {
                    const reflectionAngle = Math.PI / 4;
                    const magnitude = Math.sqrt(this.ball.velocity.x ** 2 + this.ball.velocity.y ** 2);
                    if (this.ball.velocity.y < 0)
                        Body.setVelocity(this.ball, { x: Math.cos(reflectionAngle) * magnitude, y: -Math.cos(reflectionAngle) * magnitude });
                    else
                        Body.setVelocity(this.ball, { x: Math.cos(reflectionAngle) * magnitude, y: Math.cos(reflectionAngle) * magnitude });
                }
                if (pair.bodyA === this.ball && pair.bodyB === this.wall) {
                    const reflectionAngle = Math.PI / 4;
                    const magnitude = Math.sqrt(this.ball.velocity.x ** 2 + this.ball.velocity.y ** 2);
                    if (this.ball.velocity.y < 0)
                        Body.setVelocity(this.ball, { x: Math.cos(reflectionAngle) * magnitude, y: -Math.cos(reflectionAngle) * magnitude });
                    else
                        Body.setVelocity(this.ball, { x: Math.cos(reflectionAngle) * magnitude, y: Math.cos(reflectionAngle) * magnitude });
                }
            }
        })

    }
    onSettingScores(callback: (payload: any) => void): void {
        this.eventEmitter.on('settingScores', callback);
    }

    sendBallPosition() {

        // checking if there are users connected to the socket if false, the game instance is shut down and cleqred
     

        this.intervalId = setInterval(() => {

            if (!this.availablePaddles.length) {
                if (this.ready) {
                    this.server.to(this.roomId).emit('ready', { msg: true });
                    if (this.restart == true) {
                        Body.setPosition(this.ball, { x: this.obj.divWidth / 2, y: this.obj.divHeight / 2 });
                        console.log("game restarted, ball is at ", this.ball.position)

                        this.server.to(this.roomId).emit('score', { score: this.score, players: this.players });
                        this.restart = false
                        setTimeout(() => {    // after seconds launch the ball again
                            Body.setVelocity(this.ball, { x: 5, y: 6 });
                        }, 5000);
                    }
                    // limit the speed of the ball so it doesnt leave the boundries 
                    const speed = Math.sqrt(this.ball.velocity.x ** 2 + this.ball.velocity.y ** 2);
                    if (speed > 20) {
                        // Calculate the scaling factor to adjust the velocity
                        const scalingFactor = 20 / speed;

                        // Scale down the velocity to match the maximum speed limit
                        this.ball.velocity.x *= scalingFactor;
                        this.ball.velocity.y *= scalingFactor;
                        Body.setVelocity(this.ball, { x: this.ball.velocity.x * scalingFactor, y: this.ball.velocity.y * scalingFactor });
                    }
                    // put the ball back in the middle after a player scored
                    if (this.ball.position.y < 0) {
                        Body.setVelocity(this.ball, { x: 0, y: 0 });
                        Body.setPosition(this.ball, { x: this.obj.divWidth / 2, y: this.obj.divHeight / 2 });
                        this.score.right++
                        this.server.to(this.roomId).emit('score', { score: this.score, players: this.players });
                        if (this.score.right >= 2) {
                            this.ready = false
                            this.winner = this.players.player2.user.login
                            const resultMatch: storeMatchDto = { loginA: this.winner, scoreA: this.score.right, loginB: this.players.player1.user.login, scoreB: this.score.left, winner: true }

                            this.eventEmitter.emit('settingScores', { resultMatch: resultMatch });
                            this.server.to(this.roomId).emit("gameOver", { gameOver: this.winner });
                        }
                        else
                            setTimeout(() => {    // after seconds launch the ball again
                                Body.setVelocity(this.ball, { x: 5, y: 6 });
                            }, 5000);
                    }
                    else if (this.ball.position.y > this.obj.divHeight) {
                        Body.setVelocity(this.ball, { x: 0, y: 0 });
                        Body.setPosition(this.ball, { x: this.obj.divWidth / 2, y: this.obj.divHeight / 2 });
                        this.score.left++
                        this.server.to(this.roomId).emit('score', { score: this.score, players: this.players });
                        if (this.score.left >= 2) {
                            this.ready = false
                            this.winner = this.players.player1.user.login
                            const resultMatch: storeMatchDto = { loginA: this.winner, scoreA: this.score.left, loginB: this.players.player2.user.login, scoreB: this.score.right, winner: true }
                            this.eventEmitter.emit('settingScores', { resultMatch: resultMatch });

                            this.server.to(this.roomId).emit("gameOver", { gameOver: this.winner });
                        }
                        else
                            setTimeout(() => {
                                Body.setVelocity(this.ball, { x: 5, y: -6 });
                            }, 5000);
                        // loginplayer A , B   , score A, B , winner
                        // 

                    }
                    this.server.to(this.roomId).emit('ballPosition', { x: this.ball.position.x, y: this.ball.position.y });

                }
                else {
                    this.server.to(this.roomId).emit('ready', { msg: true });

                    this.server.to(this.roomId).emit('gameOver', { gameOver: this.winner });
                }
            }
            else {
                Body.setVelocity(this.ball, { x: 0, y: 0 });
                Body.setPosition(this.ball, { x: -155, y: this.obj.divHeight / 2 });

                // Body.setPosition(this.ball, { x: -155, y: this.obj.divHeight / 2 });
                this.score = { left: 0, right: 0 }
                this.server.to(this.roomId).emit('ready', { msg: false });
                this.server.to(this.roomId).emit('gameStatus', { msg: "Waiting for a player to join..." });

            }
        }, 1000 / 60);

    }

    handleConnection(client: Socket, user: User) {
        const room = this.server.sockets.adapter.rooms.get(this.roomId);
        let roomArray = []
        if (room) {
            roomArray = Array.from(room.keys())
        }
        // console.log("connected to room are: ", roomArray)
        // console.log("available paddles", this.availablePaddles)
        this.updateConnectedUsers(user, client)
        const availablePaddle = this.availablePaddles.shift(); // Get the next available paddle

        if (availablePaddle) {
            client.emit('paddleAssigned', availablePaddle); // Send the paddle assignment to the client
            client.data.paddle = availablePaddle; // Set the paddle assignment to the client
            client.on(availablePaddle, (data: WebSocket.Data) => {
                Body.setPosition(this.paddles[availablePaddle], { x: data.x, y: data.y });
                // Send the paddle assignment to the client
                this.server.to(this.roomId).emit(availablePaddle, { x: data.x, y: data.y });
            });
            client.on("restart", (data: WebSocket.Data) => {
                if (data.restart) {
                    this.server.to(this.roomId).emit('restart', { restart: true });
                    this.score = { left: 0, right: 0 }
                    this.ready = true
                    // Body.setPosition(this.ball, { x: -155, y: this.obj.divHeight / 2 });
                    this.restart = true
                }
            })
        } else {
            throw new BadRequestException('this room is full'); // No available paddles, disconnect the user
        }
    }
    updateConnectedUsers(user: User, client: Socket) {
        if (user.login == this.roomId)
            this.players.player1 = { user: user, client: client.id }
        else
            this.players.player2 = { user: user, client: client.id }

    }
    
    clearGame() {
        clearInterval(this.intervalId)
        World.clear(this.world);
        Engine.clear(this.engine);
    }

}