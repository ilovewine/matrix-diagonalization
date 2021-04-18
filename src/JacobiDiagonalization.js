const { SquareMatrix, SymmetricMatrix } = require('./Matrix');

class JacobiDiagonalization {
  constructor (symmetricMatrix, epsilon) {
    this.matrix = new SymmetricMatrix(symmetricMatrix);
    this.result = new SquareMatrix(this.matrix.elements);
    this.epsilon = epsilon;
    this.dimension = this.matrix.dimension;
  }

  rotate (p, q) {
    let Omega;
    if (this.result.elements[p][p] === this.result.elements[q][q]) Omega = Math.PI / 4;
    else Omega = Math.atan((2 * this.result.elements[p][q]) / (this.result.elements[p][p] - this.result.elements[q][q])) / 2;
    const elements = [...Array(this.dimension)].map(() => [...Array(this.dimension)].fill(0));
    for (let i = 0; i < this.dimension; ++i) {
      for (let j = 0; j < this.dimension; ++j) {
        if (i === j) {
          if (i === p || i === q) elements[i][j] = Math.cos(Omega);
          else elements[i][j] = 1;
        }
        else if (i === p && j === q) elements[i][j] = -Math.sin(Omega);
        else if (i === q && j === p) elements[i][j] = Math.sin(Omega);
      }
    }
    return new SquareMatrix(elements);
  }

  maxStrategy () {
    let rotation;
    do {
      rotation = this.rotate(...this.result.indexesMax());
      this.result = new SquareMatrix(rotation.transpose().multiply(this.result).multiply(rotation).elements);
    } while (this.testEpsilon());
    return this.result;
  }

  testEpsilon () {
    for (let i = 0; i < this.dimension; ++i) {
      for (let j = i + 1; j < this.dimension; ++j) {
        if (Math.abs(this.result.elements[i][j]) > this.epsilon) return true;
      }
    }
    return false;
  }
}

const A = [
  [4, -30, 60, -35],
  [-30, 300, -675, 420],
  [60, -675, 1620, -1050],
  [-35, 420, -1050, 700]
];
const jacobi = new JacobiDiagonalization(A, 0.1);
console.log(jacobi.maxStrategy());
