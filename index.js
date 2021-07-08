const DATASIZE = 1000000;

const fs = require('fs')
const { Chess } = require('chess.js')

const chess = new Chess()

let data = fs.readFileSync('1200to1400.csv').toString().split('\n');

for (let i = 0; i < DATASIZE; i++) {
    let currentPGN = data[Math.floor(Math.random() * data.length)];
    chess.load_pgn(currentPGN);
    console.log(chess.fen());
    fs.appendFileSync('out.txt', chess.fen() + '\n');
}