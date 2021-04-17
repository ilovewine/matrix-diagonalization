const Matrix = require('./assets/Matrix');

const A = new Matrix([[1,2,3],[3,4,5],[5,6,7]])
const B = new Matrix([[1,1,1],[1,1,1],[1,1,1]])

console.log(A.add(B))