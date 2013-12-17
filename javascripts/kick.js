/** 
 */
var formula_lookup = [];
function formula (distance) {
    var result;
    if (formula_lookup[distance]) {
        result = formula_lookup[distance];
    }else {
        // Three variables control the scaling of the algorithm
        // I call them pitch, yaw, and roll for lack of better terms
        var yaw = distance - 45;
        var roll = .45;
        // Annoying workaround for cube roots of negative numbers
        var absy = Math.abs(yaw);
        var pitch = .18 * ((absy == yaw) ? -1 : 1);
        result = roll + pitch * Math.pow(absy, 1/3.0);
        formula_lookup[distance] = result;
    }
    return result;
}
function oddsof (kicks, nummakes, inx2){
    var result, subkicks, inx, jnx, subtotal;
    if (kicks.length == nummakes) {
        result = 1;
        for (inx in kicks) {
            result *= formula(kicks[inx]);
        }
    } else {
        result = 0;
        for (inx = (inx2 ? inx2 : 0); inx < kicks.length; inx++) {
            subtotal = 1;
            for (jnx = 0; jnx < inx + 1; jnx++) {
                subtotal *= (1 - formula(kicks[jnx]));
            }            
            subkicks = kicks.slice(0);
            subkicks.splice(inx,1);
            result += subtotal * oddsof(subkicks, nummakes, inx + 1);
        }
    }
    return result;
}
/** 
 * Calculates kicker rating
 * taking two arrays as input 
 * and returning a percentage
 */
function calculate (makes, misses) {
    var kicks = makes.concat(misses);
    var numKicks = kicks.length;
    var test = new Array(numKicks + 1);
    var numMisses = misses.length;
    var result = 1;
    for (var inx = 0; inx < numMisses; inx++){
        test[numKicks - inx] = oddsof (kicks, numKicks - inx);
        result -= test[numKicks - inx];
    }
    test[numKicks - numMisses] = oddsof (kicks, numKicks - numMisses);
    result -= 0.5 * test[numKicks - numMisses];
    return result;
}
