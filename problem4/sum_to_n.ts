// Complexity: O(n)
// Efficiency: Uses little memory, but gets slower as n increases
function sum_to_n_a(n: number): number {
    let sum = 0;
    let i = 1;

    for (i = 1; i <= n; i++) {
        sum += i;
    }

    return sum;
}

// Complexity: O(1)
// Efficiency: Calculates the sum directly, so it's faster for large n.
function sum_to_n_b(n: number): number {
    return (n * (n + 1)) / 2;
}


// Complexity: O(n)
// Efficiency: Simple to understand, but uses more memory and may cause a stack overflow for large n.
function sum_to_n_c(n: number): number {
    if (n <= 0) {
        return 0;
    }
    return n + sum_to_n_c(n - 1);
}

console.log(sum_to_n_b(10));
console.log(sum_to_n_a(10));
console.log(sum_to_n_c(10));