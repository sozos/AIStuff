function heapSort(arr) {
	var output = new Array();
	var heap = new Heap();
	heap.heapify(arr);

	while (!heap.isEmpty()) {
		output.push(heap.pop());
	}

	// Because its a max heap, it is sorted in descending order
	output.reverse();
	return output;
}