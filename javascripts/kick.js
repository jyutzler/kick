/**
 * Calculates kicker rating
 * @param {Array} makes - Array of successful kick distances in yards
 * @param {Array} misses - Array of missed kick distances in yards
 * @param {number} yaw - Bonus threshold distance in yards
 *                       Typical values: 30.0 (HS), 35.0 (NCAA, default), 40.0 (NFL)
 * @returns {number} Rating as decimal (0.0-1.0 range before percentage conversion)
 */
function calculate (makes, misses, yaw) {
	// Default to NCAA if yaw not provided
	if (yaw === undefined) {
		yaw = 35.0;
	}
	// Three variables control the scaling of the algorithm
	// I call them pitch, yaw, and roll for lack of better terms
	// Affects the size of the penalty for missed kicks
	var pitch = 20.0;
	// yaw determines the start for bonus points for longer makes and
	// affects the decrease of the size of the penalty for longer misses
	// yaw + pitch equals the point at which there is zero penalty for missing
	// The rate at which bonus points are awarded for longer kicks
	var roll = 10.0;
	var gentleman = .75; // Gentlemen's C
	var exp = 4.0;
	// Some temporary values
	var current, sortedMisses;
	// Provide a small starting value so the kicker starts 
	// with a grade of 100% 
	var numerator = 0, denominator;

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
        numerator += Math.max(current - yaw, 0) * roll;
	}
	denominator = numerator + pitch;
	// Decrease the numerator to keep values below 100%
	// This will assign a "Gentleman's C" to blank entries
	numerator = denominator - (pitch * (1 - Math.pow(gentleman,1/exp)));
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
		// Cap the penalty of missing shorter kicks
		current = Math.max((current - pitch), pitch);
		// Only consider misses that lower the rating
		if (numerator * yaw > denominator * current) {
			numerator += current;
			denominator += yaw;
		}
	}

    // Cubing the result creates a nice curve
	return Math.pow((numerator / denominator), exp);
}
