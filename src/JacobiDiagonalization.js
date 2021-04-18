const { SquareMatrix, SymmetricMatrix } = require('./Matrix');

class JacobiDiagonalization {
  constructor (symmetricMatrix, strategy = 'max', epsilon = 0.0001) {
    this.matrix = new SquareMatrix(symmetricMatrix);
    this.epsilon = epsilon;
    this.dimension = this.matrix.dimension;
    this.strategy = strategy;
  }

  rotate (p, q) {
    let Omega;
    if (this.matrix.elements[p][p] === this.matrix.elements[q][q]) Omega = Math.PI / 4;
    else Omega = Math.atan((2 * this.matrix.elements[p][q]) / (this.matrix.elements[p][p] - this.matrix.elements[q][q])) / 2;
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

  indexesMax () {
    let max = 0;
    let indexes = null;
    for (let i = 0; i < this.dimension; ++i) {
      for (let j = i + 1; j < this.dimension; ++j) {
        if (Math.abs(this.matrix.elements[i][j]) > max) {
          max = Math.abs(this.matrix.elements[i][j]);
          indexes = [i, j];
        }
      }
    }
    return indexes;
  }

  indexesCyclic () {
    for (let i = 0; i < this.dimension; ++i) {
      for (let j = i + 1; j < this.dimension; ++j) {
        if (Math.abs(this.matrix[i][j]) > this.epsilon) {
          return [i, j];
        }
      }
    }
  }

  solve () {
    let rotation;
    let indexes = this.chooseStrategy();
    do {
      rotation = this.rotate(...indexes());
      this.matrix = new SquareMatrix(rotation.transpose().multiply(this.matrix).multiply(rotation).elements);
    } while (this.testEpsilon());
    return this.matrix;
  }

  chooseStrategy () {
    let strategyMethod;
    switch (this.strategy) {
      case 'cyclic':
        strategyMethod = this.indexesCyclic.bind(this);
        break;
      case 'max':
      default:
        strategyMethod = this.indexesMax.bind(this);
    }
    return strategyMethod;
  }

  testEpsilon () {
    for (let i = 0; i < this.dimension; ++i) {
      for (let j = i + 1; j < this.dimension; ++j) {
        if (Math.abs(this.matrix.elements[i][j]) > this.epsilon) return true;
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
const jacobi = new JacobiDiagonalization(A, 'max', 0.00001);
console.log(jacobi.solve());
