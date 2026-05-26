const DIR = { UP: {dx: 0, dy: -1} };
let initialPiecesStr = "[]";
let pieces = [];
pieces.push({
    id: 1,
    gridPaths: [{x:1,y:1}, {x:1,y:2}],
    dir: 'UP',
    dirVec: DIR['UP'],
    offset: 0,
    state: 'IDLE'
});
initialPiecesStr = JSON.stringify(pieces);
console.log(initialPiecesStr);
console.log(JSON.parse(initialPiecesStr));
