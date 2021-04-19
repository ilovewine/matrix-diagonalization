const { SquareMatrix, IdentityMatrix } = require('./Matrix');
const math = require('mathjs');

class JacobiDiagonalization {
  eigenvalues = [];
  eigenvectors = [];

  constructor(matrix, strategy = 'max', epsilon = 0.0001) {
    this.result = new SquareMatrix(matrix);
    this.epsilon = epsilon;
    this.dimension = this.result.dimension;
    this.strategy = strategy;
  }

  rotate(p, q) {
    let Omega;
    if (this.result.elements[p][p] === this.result.elements[q][q]) Omega = Math.PI / 4;
    else Omega = Math.atan((2 * this.result.elements[p][q]) / (this.result.elements[p][p] - this.result.elements[q][q])) / 2;
    const elements = [...Array(this.dimension)].map(() => [...Array(this.dimension)].fill(0));
    for (let i = 0; i < this.dimension; ++i) {
      for (let j = 0; j < this.dimension; ++j) {
        if (i === j) {
          if (i === p || i === q) elements[i][j] = Math.cos(Omega);
          else elements[i][j] = 1;
        } else if (i === p && j === q) elements[i][j] = -Math.sin(Omega);
        else if (i === q && j === p) elements[i][j] = Math.sin(Omega);
      }
    }
    return new SquareMatrix(elements);
  }

  indexesMax() {
    let max = 0;
    let indexes = null;
    for (let i = 0; i < this.dimension; ++i) {
      for (let j = i + 1; j < this.dimension; ++j) {
        if (Math.abs(this.result.elements[i][j]) > max) {
          max = Math.abs(this.result.elements[i][j]);
          indexes = [i, j];
        }
      }
    }
    return indexes;
  }

  indexesCyclic() {
    for (let i = 0; i < this.dimension; ++i) {
      for (let j = i + 1; j < this.dimension; ++j) {
        if (Math.abs(this.result[i][j]) > this.epsilon) {
          return [i, j];
        }
      }
    }
  }

  solve() {
    let rotation;
    let indexes = this.chooseStrategy();
    let eigenvectorMatrix = new IdentityMatrix(this.dimension);
    do {
      rotation = this.rotate(...indexes());
      eigenvectorMatrix = new SquareMatrix(rotation.transpose().multiply(eigenvectorMatrix).elements);
      this.result = new SquareMatrix(rotation.transpose().multiply(this.result).multiply(rotation).elements);
    } while (this.testEpsilon());
    this.eigenvectors = math.inv(eigenvectorMatrix.elements);
    for (let i = 0; i < this.dimension; ++i) {
      this.eigenvalues.push(this.result.elements[i][i]);
    }
    this.printSolution();
  }

  chooseStrategy() {
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

  testEpsilon() {
    for (let i = 0; i < this.dimension; ++i) {
      for (let j = i + 1; j < this.dimension; ++j) {
        if (Math.abs(this.result.elements[i][j]) > this.epsilon) return true;
      }
    }
    return false;
  }

  printSolution() {
    console.group('EIGENVALUES', [this.eigenvalues]);
    console.groupEnd();

    console.group('EIGENVECTORS', [...this.eigenvectors]);
    console.groupEnd();

  }
}

const A = [
  [2, -1, 0, 0, 0, 0, 0, 0],
  [-1, 2, -1, 0, 0, 0, 0, 0],
  [0, -1, 2, -1, 0, 0, 0, 0],
  [0, 0, -1, 2, -1, 0, 0, 0],
  [0, 0, 0, -1, 2, -1, 0, 0],
  [0, 0, 0, 0, -1, 2, -1, 0],
  [0, 0, 0, 0, 0, -1, 2, -1],
  [0, 0, 0, 0, 0, 0, -1, 2],
];
const jacobi = new JacobiDiagonalization(A, 'max', 0.00001);
jacobi.solve();
