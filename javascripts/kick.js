/** 
 * Calculates kicker rating
 * taking two arrays as input 
 * and returning a percentage
 */
function calculate (makes, misses) {
	// Three variables control the scaling of the algorithm
	// I call them pitch, yaw, and roll for lack of better terms
	// Affects the size of the penalty for missed kicks  
	var pitch = 20.0;
	// Determines the start for bonus points for longer makes and
	// affects the decrease of the size of the penalty for longer misses
	// yaw + pitch equals the point at which there is zero penalty for missing
	// var yaw = 30.0; // high school
	var yaw = 35.0; // NCAA
	// var yaw = 40.0; // NFL
	// The rate at which bonus points are awarded for longer kicks
	var roll = 10.0;
	// Some temporary values
	var value, oldValue, current, sortedMisses;
	// Provide a small starting value so the kicker starts 
	// with a grade of 100% 
//	var numerator = 1, denominator;
	var numerator = 10, denominator;

	// Go through the makes first,
	// adding to the numerator and denominator
	for (var inx in makes) {
		current = Number(makes[inx]);
		// Sometimes an extra space gets recorded as a zero
		if (current === 0) {
			continue;
		}
		numerator += current;
		// Assign bonus points to longer kicks
		if (current > yaw) {
			numerator += roll * (current - yaw);
		}
	}
	denominator = numerator;
	
	// Go through the misses next,
	// sort so we consider shorter misses first
    sortedMisses = misses.sort();
	// penalizing the kicker by increasing
	// the denominator faster than the numerator
	for (inx in sortedMisses) {
		current = Number(sortedMisses[inx]);
		// Sometimes an extra space gets recorded as a zero
		if (current === 0) {
			continue;
		}
		// Increase the severity of missing shorter kicks
		current = Math.max((current - pitch), 0);
		// Only consider misses that lower the average
		oldValue = numerator / denominator;
		value = (numerator + current) / (denominator + yaw);
		if (oldValue > value) {
			numerator += current;
			denominator += yaw;
		}
	}

    // Cubing the result creates a nice curve
    value = Math.pow((numerator / denominator), 3.0);
	return value;
}
