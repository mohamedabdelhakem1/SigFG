var addNodeOnClick = false;
var addEdgeSelected = false;

var nodes = [
    { id: '0' },
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' }
];
var edges = [
    { from: '0', to: '1', gain: 1 },
    { from: '1', to: '2', gain: 1 },
    { from: '2', to: '3', gain: 1 },
    { from: '3', to: '4', gain: 1 },
    { from: '4', to: '5', gain: 1 },
    { from: '5', to: '6', gain: 1 },
    { from: '6', to: '7', gain: 1 },
    { from: '7', to: '8', gain: 1 },
    { from: '3', to: '6', gain: 1 },
    { from: '5', to: '7', gain: 1 },
    { from: '5', to: '4', gain: -1 },
    { from: '7', to: '5', gain: -1 },
    { from: '6', to: '2', gain: -1 },
    { from: '7', to: '1', gain: -1 }
];

function addNodeBtn() {
    addNodeOnClick = true;
}

function addEdgeBtn() {
    addEdgeSelected = true;
}