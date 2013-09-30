var debug = false;

var Node = function(name) {
	this.name = name;
	this.neighbours = new Array();
	this.previousNode = null;
	this.g = 0;
	this.h = -1 * Number.MAX_VALUE;
	this.f = Number.MAX_VALUE; // f = (1-ratio)*g + ratio*h
}

function addEdges(node1, node2, distance) {
	node1.neighbours.push([node2, distance]);
	node2.neighbours.push([node1, distance]);
}

// We want a min heap using the provided max heap in Heap.js
function nodeComparatorFn(NodeA, NodeB) {
	if (NodeA.f === NodeB.f) {
		return 0;
	} else if (NodeA.f < NodeB.f) {
		// A > B in the max heap if A has lower cost
		return 1;
	} else {
		return -1;
	}
}

/************
 Set up nodes
 ************/
var Oradea = new Node("Oradea");
var Zerind = new Node("Zerind");
var Arad = new Node("Arad");
var Sibiu = new Node("Sibiu");
var Timisoara = new Node("Timisoara");
var Lugoj = new Node("Lugoj");
var Mehadia = new Node("Mehadia");
var Dobreta = new Node("Dobreta");
var Craiova = new Node("Craiova");
var Rimnicu_Vilcea = new Node("Rimnicu Vilcea");
var Pitesti = new Node("Pitesti");
var Fagaras = new Node("Fagaras");
var Bucharest = new Node("Bucharest");
var Giurgiu = new Node("Giurgiu");
var Urziceni = new Node("Urziceni");
var Hirsova = new Node("Hirsova");
var Eforie = new Node("Eforie");
var Vaslui = new Node("Vaslui");
var Iasi = new Node("Iasi");
var Neamt = new Node("Neamt");

addEdges(Arad, Zerind, 75);
addEdges(Arad, Sibiu, 140);
addEdges(Arad, Timisoara, 118);
addEdges(Zerind, Oradea, 71);
addEdges(Oradea, Sibiu, 151);
addEdges(Timisoara, Lugoj, 111);
addEdges(Lugoj, Mehadia, 70);
addEdges(Mehadia, Dobreta, 75);
addEdges(Dobreta, Craiova, 120);
addEdges(Craiova, Rimnicu_Vilcea, 146);
addEdges(Craiova, Pitesti, 138);
addEdges(Rimnicu_Vilcea, Pitesti, 97);
addEdges(Rimnicu_Vilcea, Sibiu, 80);
addEdges(Sibiu, Fagaras, 99);
addEdges(Fagaras, Bucharest, 211);
addEdges(Bucharest, Pitesti, 101);
addEdges(Bucharest, Giurgiu, 90);
addEdges(Bucharest, Urziceni, 85);
addEdges(Urziceni, Vaslui, 142);
addEdges(Urziceni, Hirsova, 98);
addEdges(Hirsova, Eforie, 86);
addEdges(Vaslui, Iasi, 92);
addEdges(Iasi, Neamt, 87);

var nodeList = new Array();
nodeList.push(Oradea);
nodeList.push(Zerind);
nodeList.push(Arad);
nodeList.push(Sibiu);
nodeList.push(Timisoara);
nodeList.push(Lugoj);
nodeList.push(Mehadia);
nodeList.push(Dobreta);
nodeList.push(Craiova);
nodeList.push(Rimnicu_Vilcea);
nodeList.push(Pitesti);
nodeList.push(Fagaras);
nodeList.push(Bucharest);
nodeList.push(Giurgiu);
nodeList.push(Urziceni);
nodeList.push(Hirsova);
nodeList.push(Eforie);
nodeList.push(Vaslui);
nodeList.push(Iasi);
nodeList.push(Neamt);

/*******************
 Heuristic Functions
 *******************/
// Straight line distance
function SLD_To_Bucharest(node, goal) {
	if (goal !== Bucharest) {
		console.log("Goal must be Bucharest");
	}

	switch(node) {
		case Arad:
			return 366;
		case Bucharest:
			return 0;
		case Craiova:
			return 160;
		case Dobreta:
			return 242;
		case Eforie:
			return 161;
		case Fagaras:
			return 176;
		case Giurgiu:
			return 77;
		case Hirsova:
			return 151;
		case Iasi:
			return 226;
		case Lugoj:
			return 244;
		case Mehadia:
			return 241;
		case Neamt:
			return 234;
		case Oradea:
			return 380;
		case Pitesti:
			return 100;
		case Rimnicu_Vilcea:
			return 193;
		case Sibiu:
			return 253;
		case Timisoara:
			return 329;
		case Urziceni:
			return 80;
		case Vaslui:
			return 199;
		case Zerind:
			return 374;
		default:
			console.log("Invalid node");
	}
}

/**********
 Execute A*
 **********/
// ratio = 1/3 means f = (1 - 1/3)*g + (1/3)*h
// f = A* cost; g = actual cost so far; h = heuristic cost
// ratio = 0 is equivalent to uniform cost search (i.e. Dijkstra's)
// evalH is a function to evaluate heuristic cost
function AStar(startNode, goalNode, ratio, evalH) {
	// Set up h for each node
	for (var i = 0; i < nodeList.length; i++) {
		nodeList[i].h = evalH(nodeList[i], goalNode);
	}

	var reached = false;
	var explored = {}; // Visited.
	var frontier = new Heap(nodeComparatorFn); // Possible nodes to explore next

	startNode.g = 0;
	startNode.f = (1 - ratio)*0 + ratio*startNode.h;
	frontier.insert(startNode);

	while (!frontier.isEmpty()) {
		if (debug) {
			console.log(frontier.print());
		}

		var currentNode = frontier.pop();
		explored[currentNode.name] = true;

		if (currentNode === goalNode) {
			var result = new Array();
			// Reached goal. Terminate!
			result[0] = "We have reached the goal with cost of: " + currentNode.g;
			
			var pathOutput = currentNode.name;
			var visitChain = currentNode.previousNode;
			while (visitChain != null) {
				pathOutput += " <- " + visitChain.name;
				visitChain = visitChain.previousNode;
			}
			result[1] = "Path: " + pathOutput;

			result[2] = "Number of nodes explored: " + Object.keys(explored).length;
			return result;
		} else {
			var costSoFar = currentNode.g;
			var neighbours = currentNode.neighbours;

			for (var i = 0; i < neighbours.length; i++) {
				// Recall that neighbours are a pairing [City, Distance]
				var neighbour = neighbours[i][0];
				var distToNeighbour = neighbours[i][1];

				if (!explored.hasOwnProperty(neighbour.name)) {
					var newg = costSoFar + distToNeighbour;
					var newf = (1-ratio)*newg + ratio*neighbour.h;
					
					if (frontier.contains(neighbour)) {
						// Update weight if it is still in frontier and the new distance is shorter
						if (newf < neighbour.f) {
							frontier.remove(neighbour);
							neighbour.previousNode = currentNode;
							neighbour.g = newg;
							neighbour.f = newf;
							frontier.insert(neighbour);

							if (debug) {
								console.log(currentNode.name + " updates " + neighbour.name);
							}
						}
					} else {
						// Add city to frontier
						neighbour.previousNode = currentNode;
						neighbour.g = newg;
						neighbour.f = newf;

						frontier.insert(neighbour);

						if (debug) {
							console.log(currentNode.name + "->" + neighbour.name);
						}
					}
				}
			}
		}
	}

	return ["Cannot reach goal"];
}

console.log("Uniform Cost Search (Dijstra's):");
console.log(AStar(Arad, Bucharest, 0, SLD_To_Bucharest)); // UCS
console.log("A* Search:");
console.log(AStar(Arad, Bucharest, 0.5, SLD_To_Bucharest)); // A*
console.log("Best First Search:");
console.log(AStar(Arad, Bucharest, 1, SLD_To_Bucharest)); // BFS