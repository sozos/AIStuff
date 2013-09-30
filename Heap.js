var debug = false;

// Implementation of a Max binary Heap using an array
// Position 0 = holds the index to 
var Heap = function(comparatorFn) {
	// If no given comparator, assume items have natural ordering
	var comparatorFn = (comparatorFn !== undefined) ? comparatorFn : function(a,b) {if (a===b) {return 0;} else if (a > b) {return 1;} else {return -1;}};

	var elements = new Array();
	elements[0] = 1; // Interpret as: (Heap size + 1) OR (Index of next item)

	this.parentIndex = function(index) {
		if (index === 0) {
			if (debug) {
				console.log("Error. Index 0 is not used to store items.");
			}
			
			return null;
		} else if (index === 1) {
			if (debug) {
				console.log("Error. Root has no parent.");
			}

			return null;
		} else {
			return Math.floor(index/2);
		}
	}

	this.leftChildIndex = function(index) {
		if (index*2 > this.size()) {
			if (debug) {
				console.log("No left child at index " + index + ".");
			}

			return null;
		} else {
			return index*2;
		}
	}

	this.rightChildIndex = function(index) {
		if (index*2+1 > this.size()) {
			if (debug) {
				console.log("No right child at index " + index + ".");
			}

			return null;
		} else {
			return index*2+1;
		}
	}

	this.clear = function() {
		elements = new Array();
		elements[0] = 1;
	}

	this.size = function() {
		return elements[0] - 1;
	}

	this.isEmpty = function() {
		return (this.size() === 0);
	}

	this.pop = function() {
		if (!this.isEmpty()) {
			var maxItem = this.findMax();
			this.deleteMax();
			return maxItem;
		} else {
			if (debug) {
				console.log("There's nothing in the heap.");
			}

			return null;
		}
	}

	this.remove = function(item) {
		var itemIndex = this.findItemIndex(item);
		if (itemIndex !== null) {
			elements[itemIndex] = elements[this.size()];
			elements[0]--;
			this.bubbleDown(itemIndex);
		}
	}

	// Returns null if item is not present
	this.findItemIndex = function(item) {
		return this.findItem(item, 1);
	}

	// Returns null if item is not present
	this.findItem = function(item, searchIndex) {
		var leftResult = null;
		var rightResult = null;
		if (searchIndex < this.size()) {
			if (comparatorFn(item, elements[searchIndex]) === 0) {
				return searchIndex;
			}

			if (comparatorFn(item, elements[searchIndex]) === 1) {
				// item > elements[searchIndex]
				return null;
			}

			// Check left subtree
			if (this.leftChildIndex(searchIndex) != null) {
				leftResult = this.findItem(item, this.leftChildIndex(searchIndex));
			}

			// Check right subtree
			if (this.rightChildIndex(searchIndex) != null) {
				rightResult = this.findItem(item, this.rightChildIndex(searchIndex));
			}

			// Assuming items are unique
			if (leftResult !== null) {
				return leftResult;
			} else {
				return rightResult;
			}
		} else {
			return null;
		}
	}

	this.contains = function(item) {
		var index = this.findItemIndex(item);
		return (index !== null);
	}

	this.print = function() {
		if (debug) {
			console.log("Elements: " + elements);
		}

		var arr = new Array();
		for (var i = 1; i <= this.size(); i++) {
			arr.push(elements[i]);
		}
		return arr;
	}

	// Call this after insertion to maintain heap property
	this.bubbleUp = function(startIndex) {
		var currentIndex = startIndex;
		var itemToBubble = elements[currentIndex];

		while (currentIndex > 1) {
			var parentIndex = this.parentIndex(currentIndex);
			var parentItem = elements[parentIndex];

			if (comparatorFn(itemToBubble, parentItem) === -1) {
				// itemToBubble < parentItem
				break;
			} else {
				// Swap parent downwards, recurse.
				elements[currentIndex] = parentItem;
				elements[parentIndex] = itemToBubble;
				currentIndex = parentIndex;
			}
		}
	}

	// Call this after deletion to maintain heap property
	this.bubbleDown = function(startIndex) {
		var currentIndex = startIndex;
		var itemToBubble = elements[currentIndex];

		while (currentIndex < this.size()) {
			var leftChildIndex = this.leftChildIndex(currentIndex);
			var rightChildIndex = this.rightChildIndex(currentIndex);
			var leftChild = (leftChildIndex === null) ? null : elements[leftChildIndex];
			var rightChild = (rightChildIndex === null) ? null : elements[rightChildIndex];

			// Figure out largest item out of {itemToBubble, leftChild, rightChild}
			var largestIndex = currentIndex;
			var largestItem = itemToBubble;
			if (leftChild !== null
				&& comparatorFn(leftChild, largestItem) === 1) {
				// leftChild > itemToBubble
				largestIndex = leftChildIndex;
				largestItem = leftChild;
			}
			if (rightChild !== null
				&& comparatorFn(rightChild, largestItem) === 1) {
				// rightChild > max{itemToBubble, leftChild}
				largestIndex = rightChildIndex;
				largestItem = rightChild;
			}

			if (largestIndex === currentIndex) {
				break;
			} else {
				// Swap largestItem upwards, recurse.
				elements[currentIndex] = largestItem;
				elements[largestIndex] = itemToBubble;
				currentIndex = largestIndex;
			}
		}
	}


	// Implementation of operations mentioned in:
	// http://en.wikipedia.org/wiki/Heap_(data_structure)
	// [createHeap is kinda redundant]
	// [increaseKey is asymptotically the same as "Delete + Insert"]

	// Overwrites old heap
	this.heapify = function(inputArray) {
		this.clear();
		for (var i = 0; i < inputArray.length; i++) {
			this.insert(inputArray[i]);
		}
	}

	// i.e. Peek
	this.findMax = function() {
		if (!this.isEmpty()) {
			return elements[1];
		} else {
			if (debug) {
				console.log("There's nothing in the heap.");
			}

			return null;
		}
	}

	this.deleteMax = function() {
		if (!this.isEmpty()) {
			// Swap last element in heap into root
			// We have effectively 'removed' the max item
			elements[1] = elements[this.size()];
			elements[0]--; // Reduce size by 1

			// Fix heap property
			this.bubbleDown(1);
		} else {
			if (debug) {
				console.log("There's nothing in the heap.");
			}

			return null;
		}
	}

	this.insert = function(newItem) {
		// Add item to back of heap
		elements[0]++; // Increase size by 1
		elements[this.size()] = newItem;

		// Fix heap property
		this.bubbleUp(this.size());
	}

	this.merge = function(otherHeap) {
		while (!otherHeap.isEmpty()) {
			var fromOtherHeap = otherHeap.pop();
			this.insert(fromOtherHeap);
		}
	}
}