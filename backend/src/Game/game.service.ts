import { Server, Socket } from 'socket.io';
import { User, channel } from '.prisma/client';
import { Body, Engine, World, Bodies, Composite } from 'matter-js';
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
    }

    return null
}

export function checkQueue(worlds: {}) {
    for (const user in worlds) {

        if (worlds[user] && worlds[user].openGame && !worlds[user].availablePaddle)
            return user
    }

    return null
}

export class matterNode {
    private engine: Engine;
    private world: World;
    private ball: any;
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

    public players: {
        player1: { user: User; client: string };
        player2: { user: User; client: string };
    } = {
            player1: { user: null, client: null },
            player2: { user: null, client: null },
        };
    constructor(server: any, roomId: string, obj: measurements, openGame : boolean) {
        this.roomId = roomId
        this.server = server;
        this.openGame = openGame
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
        this.leftPaddle = Bodies.rectangle(this.obj.leftPaddle.x, this.obj.leftPaddle.y, this.obj.leftPaddle.width, this.obj.leftPaddle.height, { label: "leftPaddle", isStatic: true });
        this.rightPaddle = Bodies.rectangle(this.obj.rightPaddle.x, this.obj.rightPaddle.y, this.obj.rightPaddle.width, this.obj.rightPaddle.height, { label: "rightPaddle", isStatic: true })
        this.paddles = { left: this.leftPaddle, right: this.rightPaddle }
        var roof = Bodies.rectangle(obj.wallTop.x, obj.wallTop.y, obj.wallTop.width, obj.wallTop.height, {
            isStatic: true,
            render: {
                fillStyle: 'blue'
            }
        });
        var wallLeft = Bodies.rectangle(obj.wallLeft.x, obj.wallLeft.y, obj.wallLeft.width, obj.wallLeft.height, {
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
        var wall = Bodies.rectangle(obj.wallRight.x, obj.wallRight.y, obj.wallRight.width, obj.wallRight.height, {
            isStatic: true,
            render: {
                fillStyle: 'green'
            }
        });

        World.add(this.world, [this.ball, wall, wallLeft, this.leftPaddle, this.rightPaddle]);
        // Start the engine and update the ball's position
        Engine.run(this.engine);

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

                    if (this.ball.position.x == -155) {
                        Body.setPosition(this.ball, { x: this.obj.divWidth / 2, y: this.obj.divHeight / 2 });

                        this.server.to(this.roomId).emit('score', { score: this.score });
                        setTimeout(() => {    // after seconds launch the ball again
                            Body.setVelocity(this.ball, { x: 5, y: 6 });
                        }, 5000);

                    }
                    //     // allow computer to control the free paddle
                    //     const availablePaddle = this.availablePaddles[0]
                    //     Body.setPosition(this.paddles[availablePaddle], { x: this.ball.position.x, y: this.paddles[availablePaddle].position.y });
                    //     this.server.to(this.roomId).emit(availablePaddle, { x: this.ball.position.x, y: this.paddles[availablePaddle].position.y });
                    // }
                    // emit the ball position to the channel

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
                        this.server.to(this.roomId).emit('score', { score: this.score });
                        if (this.score.right >= 2) {
                            this.ready = false
                            this.winner = this.players.player2.user.login
                            const resultMatch: storeMatchDto = { loginA: this.winner, scoreA: this.score.left, loginB: this.players.player2.user.login, scoreB: this.score.right, winner: false }

                            this.eventEmitter.emit('settingScores', { resultMatch: resultMatch });
                            this.server.to(this.roomId).emit("gameOver", { gameOver: this.winner });
                        }
                        else
                            setTimeout(() => {    // after seconds launch the ball again
                                Body.setVelocity(this.ball, { x: 5, y: 6 });
                            }, 5000);
                    }
                    else if (this.ball.position.y > this.obj.divHeight) {
                        console.log(this.ball.position.y)

                        Body.setVelocity(this.ball, { x: 0, y: 0 });
                        Body.setPosition(this.ball, { x: this.obj.divWidth / 2, y: this.obj.divHeight / 2 });
                        this.score.left++
                        this.server.to(this.roomId).emit('score', { score: this.score });
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
                else
                    this.server.to(this.roomId).emit('gameOver', { gameOver: this.winner });
            }
            else{
                Body.setVelocity(this.ball, { x: 0, y: 0 });
                Body.setPosition(this.ball, { x: -155, y: this.obj.divHeight / 2 });
                this.score = { left: 0, right: 0 }
                this.server.to(this.roomId).emit('ready', { msg: false});
                this.server.to(this.roomId).emit('gameStatus', { msg: "Waiting for a player to join..." });

            }
        }, 1000 / 60);

    }

    handleConnection(client: Socket, user: User) {
        console.log("someone got in")
        const room = this.server.sockets.adapter.rooms.get(this.roomId);
        let roomArray = []
        if (room) {
            roomArray = Array.from(room.keys())
        }
        console.log("client id", client.id)
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
                    Body.setPosition(this.ball, { x: -155, y: this.obj.divHeight / 2 });
                }
            })
        } else {
            console.log("joining user  forced to disconnect")
            throw new BadRequestException('this room is full'); // No available paddles, disconnect the user
        }
    }
    updateConnectedUsers(user: User, client: Socket) {
        if (user.login == this.roomId)
            this.players.player1 = { user: user, client: client.id }
        else
            this.players.player2 = { user: user, client: client.id }
        // console.log({ user: user, client: client.id })
        // console.log(this.players.player1)
    }
    handleDisconnect(client: Socket) {
        if (client.id === this.players.player1.client) {
            this.server.to(this.roomId).emit('ownerLeft', { ownerLeft: true });

            console.log("deleting the game")
            // this.clearGame()
        }
        else {
            console.log("second player left, putting back their paddle in the list")
            if (this.availablePaddles.length == 1)
                this.availablePaddles.push("right")
        }
    }
    clearGame() {
        clearInterval(this.intervalId)
        console.log("clearing game instance")

        World.clear(this.world);
        Engine.clear(this.engine);
        console.log(this.world)
    }

}