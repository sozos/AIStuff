// Implementation of a Max binary Heap using an array
// Position 0 = holds the index to 
var Heap = function(comparatorFn) {
	// If no given comparator, assume items have natural ordering
	var comparatorFn = (comparatorFn !== undefined) ? comparatorFn : function(a,b) {if (a===b) {return 0;} else if (a > b) {return 1;} else {return -1;}};

	var elements = new Array();
	elements[0] = 1; // Interpret as: (Heap size + 1) OR (Index of next item)

	this.parentIndex = function(index) {
		if (index === 0) {
			console.log("Error. Index 0 is not used to store items.");
			return null;
		} else if (index === 1) {
			console.log("Error. Root has no parent.");
			return null;
		} else {
			return Math.floor(index/2);
		}
	}

	this.leftChildIndex = function(index) {
		if (index*2 > this.size()) {
			console.log("No left child at index " + index + ".");
			return null;
		} else {
			return index*2;
		}
	}

	this.rightChildIndex = function(index) {
		if (index*2+1 > this.size()) {
			console.log("No right child at index " + index + ".");
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
			console.log("There's nothing in the heap.");
			return null;
		}
	}

	// Returns null if item is not present
	this.findItemIndex = function(item) {
		function search(item, searchIndex) {
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
				if (leftChildIndex(searchIndex) != null) {
					leftResult = search(item, leftChildIndex(searchIndex));
				}

				// Check right subtree
				if (rightChildIndex(searchIndex) != null) {
					rightResult = search(item, rightChildIndex(searchIndex));
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
		return search(item, 1);
	}

	this.contains = function(item) {
		var index = findItemIndex(item);
		return (index !== null);
	}

	this.print = function() {
		console.log("Elements: " + elements);
		var arr = new Array();
		for (var i = 1; i <= this.size(); i++) {
			arr.push(elements[i]);
		}
		return arr;
	}

	// Call this after insertion to maintain heap property
	this.bubbleUp = function() {
		var currentIndex = this.size();
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
	this.bubbleDown = function() {
		var currentIndex = 1;
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
			console.log("There's nothing in the heap.");
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
			this.bubbleDown();
		} else {
			console.log("There's nothing in the heap.");
			return null;
		}
	}

	this.increaseKey = function(itemToUpdate, newValue) {
		var itemIndex = this.findItemIndex(itemToUpdate);
		if (itemIndex === null) {
			console.log("No such item");
		} else {
			elements[itemIndex] = newValue;
		}
	}

	this.insert = function(newItem) {
		// Add item to back of heap
		elements[0]++; // Increase size by 1
		elements[this.size()] = newItem;

		// Fix heap property
		this.bubbleUp();
	}

	this.merge = function(otherHeap) {
		while (!otherHeap.isEmpty()) {
			var fromOtherHeap = otherHeap.pop();
			this.insert(fromOtherHeap);
		}
	}
}