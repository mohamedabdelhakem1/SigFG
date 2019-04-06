var NonTouchingLoops = [];
var jsonOutput = {};
var ids;

solve('0', '8');

function solve(inNode, outNode) {
	ids = edges.getIds();
    var forward_paths = getForwardPaths(inNode, outNode);
    //cycles
    cycles = getCycles(edges);
    //non touching loops
    getNonTouchingLoops(cycles, 0, []);
    //appending deltas 
    var sum = 0;
    for (var i = 0; i < forward_paths.length; i++) {
        var d = getDeltaForForwardPath(forward_paths[i]);
        forward_paths[i].delta = d;
        sum += d*forward_paths[i].gain;
        
    }
    var overallDelta = getDetla()
    var sol = sum /overallDelta ;
    jsonOutput.forward_paths = forward_paths;
    jsonOutput.loops = cycles;
    jsonOutput.delta = overallDelta;
    jsonOutput.transferFunc = sol;
    jsonOutput.nonTouchingLoops = NonTouchingLoops;
    return jsonOutput;
}


function getForwardPaths(startNode, endNode) {
    var stack = new Array();
    var forward_paths = [];
    if(edges.length == 0) return forward_paths;
    for (var i = 0; i < edges.getIds().length; i++) {
        if (edges.get(ids[i]).from == startNode) {
            var list = [edges.get(ids[i])];
            stack.push(list);
        }
    }
    while (stack.length != 0) {
        var l = stack.pop();
        var edge = l[l.length - 1];
        var node = edge.to;
        var counter = 0;
        if (edge.to == endNode) {
            forward_paths.push(l);
        } else {
            for (var i = 0; i < edges.length; i++) {
                if (edges.get(ids[i]).from == node) {
                    if (counter == 0) {
                        if (check_forward_path(l, edges.get(ids[i]))) {
                            counter++;
                            l.push(edges.get(ids[i]));
                            stack.push(l);

                        }
                    } else {
                        var newl = l.slice(0, l.length - 1);
                        if (check_forward_path(newl, edges.get(ids[i]))) {
                            newl.push(edges.get(ids[i]));
                            stack.push(newl);

                        }
                    }
                }
            }
        }
    }
    forward_paths_and_gains = [];
    for (var i = 0; i < forward_paths.length; i++) {
        forward_paths_and_gains.push({ nodes: convertEdgesToNodes(forward_paths[i]), gain: pathGain(forward_paths[i]) });
        // console.log(forward_paths_and_gains[i]);
    }
    return forward_paths_and_gains;
}

function getNonTouchingLoops(loopsList, start, indexes) {
    for (var j = start; j < loopsList.length; j++) {
        if (!indexes.includes(j)) {
            indexes.push(j);
            if (indexes.length > 1) {
                //  console.log(indexes);
                var N_loops_list = [];
                for (var n = 0; n < indexes.length; n++) {
                    N_loops_list.push(loopsList[indexes[n]]);
                }
                if (check_Non_Touching_loops(N_loops_list)) {
                    NonTouchingLoops.push(N_loops_list);
                }
            }
            getNonTouchingLoops(loopsList, j + 1, indexes);
            indexes.pop();
        }


    }
}

function check_Non_Touching_loops(loopsList) {
    for (var i = 0; i < loopsList.length; i++) {
        for (var j = i + 1; j < loopsList.length; j++) {
            if (check_two_Touching(loopsList[i], loopsList[j])) {
                return false;
            }
        }
    }
    return true;
}

function check_two_Touching(loop1, loop2) {
    for (var i = 0; i < loop1.nodes.length; i++) {
        for (var j = 0; j < loop2.nodes.length; j++) {
            if (loop1.nodes[i] == loop2.nodes[j]) {
                return true;
            }
        }
    }
    return false;

}

function getDetla() {
    var detla = 1;
    for (var i = 0; i < cycles.length; i++) {
        detla -= cycles[i].gain;
    }
    for (var i = 0; i < NonTouchingLoops.length; i++) {
        if (NonTouchingLoops[i].length % 2 == 0) {
            var sum_of_product = 1;
            for (var j = 0; j < NonTouchingLoops[i].length; j++) {
                sum_of_product *= NonTouchingLoops[i][j].gain;
            }
            detla += sum_of_product;
        } else {
            var sum_of_product = 1;
            for (var j = 0; j < NonTouchingLoops[i].length; j++) {
                sum_of_product *= NonTouchingLoops[i][j].gain;
            }
            detla -= sum_of_product;
        }
    }
    return detla;
}

function getDeltaForForwardPath(forward_path) {
    var detla = 1;
    for (var i = 0; i < cycles.length; i++) {
        if (!check_two_Touching(cycles[i], forward_path)) {
            detla -= cycles[i].gain;
        }

    }
    for (var i = 0; i < NonTouchingLoops.length; i++) {
        if (NonTouchingLoops[i].length % 2 == 0) {
            var sum_of_product = 1;
            for (var j = 0; j < NonTouchingLoops[i].length; j++) {
                if (check_two_Touching(NonTouchingLoops[i][j], forward_path)) {
                    sum_of_product = 0
                    break;
                } else {
                    sum_of_product *= NonTouchingLoops[i][j].gain;
                }

            }
            detla += sum_of_product;
        } else {
            var sum_of_product = 1;
            for (var j = 0; j < NonTouchingLoops[i].length; j++) {
                if (check_two_Touching(NonTouchingLoops[i][j], forward_path)) {
                    sum_of_product = 0
                    break;
                } else {
                    sum_of_product *= NonTouchingLoops[i][j].gain;
                }
            }
            detla -= sum_of_product;
        }
    }
    return detla;
}

function convertEdgesToNodes(edgeslist) {
    nodes_list = [];
    for (var i = 0; i < edgeslist.length; i++) {
        nodes_list.push(edgeslist[i].from);
    }
    nodes_list.push(edgeslist[edgeslist.length - 1].to);
    return nodes_list;
}

function getCycles(edges) {
    var stack = new Array();
    var loops = [];
    if(edges.length == 0) return loops;
    startNode = edges.get(ids[0]).from;
    for (var i = 0; i < edges.length; i++) {
        if (edges.get(ids[i]).from == startNode) {
            var list = [edges.get(ids[i])];
            stack.push(list);
        }
    }
    while (stack.length != 0) {
        var loop = stack.pop();
        var edge = loop[loop.length - 1];
        var node = edge.to;
        var counter = 0;
        if (edge.to == edge.from) {
            remove_redundant_edges(loop, edge);
            loop.push(edge);
            if (!contains(loops, loop)) {
                loops.push(loop);
            }
        } else {
            for (var i = 0; i < edges.length; i++) {
                if (edges.get(ids[i]).from == node) {
                    if (counter == 0) {
                        counter++;
                        if (check_loop(loop, edges.get(ids[i]))) {
                            remove_redundant_edges(loop, edges.get(ids[i]));
                            loop.push(edges.get(ids[i]));
                            if (!contains(loops, loop)) {
                                loops.push(loop);
                            }
                        } else {
                            loop.push(edges.get(ids[i]));
                            stack.push(loop);
                        }
                    } else {
                        var newloop = loop.slice(0, loop.length - 1);
                        if (check_loop(newloop, edges.get(ids[i]))) {
                            remove_redundant_edges(newloop, edges.get(ids[i]));
                            newloop.push(edges.get(ids[i]));
                            if (!contains(loops, newloop)) {
                                loops.push(newloop);
                            }
                        } else {
                            newloop.push(edges.get(ids[i]));
                            stack.push(newloop);
                        }
                    }
                }
            }
        }
    }
    //  console.log("loops");
    loops_and_gains = [];
    for (var i = 0; i < loops.length; i++) {
        loops_and_gains.push({ nodes: convertEdgesToNodes(loops[i]), gain: pathGain(loops[i]) });
        //   console.log(loops_and_gains[i]);
    }
    return loops_and_gains;
}

function pathGain(edges) {
    var gain = 1;
    for (var j = 0; j < edges.length; j++) {
        gain = gain * edges[j].gain;
    }
    return gain;
}
/*
{
    forward: [{
        path: [],
        gain: 56,

    },
    {
        path: [],
        gain: 77,
    }],

}
*/

function contains(loops, loop) {
    for (var i = 0; i < loops.length; i++) {
        if (loops[i].length == loop.length) {
            if (equalLoop(loop, loops[i])) {
                return true;
            }
        }
    }
    return false;
}

function equalLoop(loop1, loop2) {
    for (var i = 0; i < loop1.length; i++) {
        if (!loop2.includes(loop1[i])) {
            return false;
        }
    }
    return true;
}

function check_loop(loop_edges, edge) {

    for (var i = 0; i < loop_edges.length; i++) {
        if (loop_edges[i].from == edge.to) {
            return true;
        }
    }

    return false;
}

function check_forward_path(list_edges, edge) {

    for (var i = 0; i < list_edges.length; i++) {
        if (list_edges[i].to == edge.to || list_edges[i].from == edge.to) {
            return false;
        }
    }
    return true;
}

function remove_redundant_edges(loop, edge) {
    if (edge.to == edge.from) {
        loop.splice(0, loop.length);
        return;
    }
    for (var i = 0; i < loop.length; i++) {
        if (edge.to == loop[i].from) {
            loop.splice(0, i);
            break;
        }
    }
}
function solveBtn(){
	inputNode = document.getElementById("inNode").value;
	outputNode = document.getElementById("outNode").value;
	output = solve(inputNode, outputNode);
	console.log(output);
	//console.log(edges.getIds());
}