//import file system and chess program
const fs = require('fs'); 
const { Chess } = require('chess.js');

//random function
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const DATASIZE = 1e6;

const chess = new Chess();
const data = fs.readFileSync('1200to1400.csv').toString().split(/\r?\n/); //splits data to an array per line

console.log('Data iterations starting');

let startTime = +new Date();
let elapsedTime = startTime;
let outString = '';
let invalidFens = [];

for (let i = 0; i < DATASIZE; i++) {
	const currentPgn = data[random(0, data.length)]; //selects a random data point from the list
	if (!currentPgn) continue;

	const pgnList = currentPgn.split(/ +/);
	const moveList = pgnList.filter(item => !item.match(/\d+\.|\d-\d/)); // remove move nums and ending status

	const moveIndex = random(0, moveList.length - 1); //randomly select a random length of moves
	const currentMove = moveList[moveIndex];
	const prevMoves = moveList.slice(0, moveIndex);

	let prevPgn = '';
	for (let j in prevMoves) {
		if (j % 2 === 0) {
			prevPgn += (j / 2 + 1) + '. '; //inserts the move number every second move "1. e4 e5 2. d4 d5..."
		}
		prevPgn += prevMoves[j] + ' ';
	}
	prevPgn = prevPgn.trim(); //removes excess lines

	chess.load_pgn(prevPgn);

	if (!chess.moves().includes(currentMove)) {
		// Make sure the move is allowed
		invalidFens.push(prevPgn);
	} else {
		// Add valid fen to list
		outString += chess.fen() + ", " + currentMove + '\n';
	}

  // Dump fens to file (usage of backticks to simplify data logging)
	if (i > 0 && i % 1000 === 0) {
		console.log([
			`${i} iterations complete`,
			`t=${(+new Date() - elapsedTime) / 1000}s`,
			`total time ${(+new Date() - startTime) / 1000}s`,
			`${invalidFens.length} total invalid (${invalidFens.length / i * 100}%)`,
			`data dumped to file`,
		].join(' | '));
		elapsedTime = +new Date();
		fs.appendFileSync('out.txt', outString);
		outString = '';
	}
}
console.log('Data dump complete');

if (invalidFens.length > 0) {
	console.error(`Invalid (${invalidFens.length}):`, invalidFens);
}
