// allow the user to leave whenever he wants by pressing ctrl + c :)
const prompt = require("prompt-sync")({ sigint: true });
const clear = require("clear-screen");

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
    constructor(field) {
        this.field = field;
        this.x = 0;
        this.y = 0;
        this.field[this.x][this.y] = pathCharacter;
        this.isPlaying = true;
    }
    static generateField(fieldH, fieldW, percentage = 0.1) {
        const field = new Array(fieldH)
            .fill(0)
            .map((element) => new Array(fieldW));
        for (let y = 0; y < fieldH; y++) {
            for (let x = 0; x < fieldW; x++) {
                const prob = Math.random();
                field[y][x] = prob > percentage ? fieldCharacter : hole;
            }
        }
        const hatPos = {
            x: Math.floor(Math.random() * fieldW),
            y: Math.floor(Math.random() * fieldH),
        };
        field[hatPos.y][hatPos.x] = hat;
        return field;
    }
    print() {
        console.clear();
        this.field.forEach((element) => console.log(element.join("")));
    }
    play() {
        this.print();
        let futureY, futureX;
        const move = prompt(`which way? d=down u=up l=left r=right\n`);
        switch (move) {
            case "u":
                futureY = this.y - 1;
                futureX = this.x;
                break;
            case "d":
                futureY = this.y + 1;
                futureX = this.x;
                break;
            case "l":
                futureX = this.x - 1;
                futureY = this.y;
                break;
            case "r":
                futureX = this.x + 1;
                futureY = this.y;
                break;
        }
        const isPlayable = this.checkLose(futureX, futureY);
        if (!isPlayable) {
            return this.lose();
        }
        const hasWon = this.checkWin(futureX, futureY);
        if (hasWon) {
            return this.win();
        }
        //update character position
        this.field[futureY][futureX] = pathCharacter;
        this.x = futureX;
        this.y = futureY;
    }
    checkWin(futureX, futureY) {
        //return true as it is a condition
        return this.field[futureY][futureX] === hat;
    }
    checkLose(futureX, futureY) {
        if (
            futureY < 0 ||
            futureY > this.field.length - 1 ||
            futureX < 0 ||
            futureX > this.field[0].length - 1 ||
            this.field[futureY][futureX] === hole
        ) {
            return false;
        }
        return true;
    }
    win() {
        console.log("nice hat");
        this.isPlaying = false;
    }
    lose() {
        console.log("you lost my dude");
        this.isPlaying = false;
    }
    startGame() {
        while (this.isPlaying) {
            this.play();
        }
    }
}

const myField = new Field(Field.generateField(20, 15, 0.1), true);
myField.startGame();
