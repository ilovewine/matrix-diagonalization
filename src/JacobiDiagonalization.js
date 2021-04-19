const { SquareMatrix, IdentityMatrix } = require('./Matrix');
const { inv } = require('mathjs');
const printSolution = require('./printSolution');

class JacobiDiagonalization {
  eigenvalues = [];
  eigenvectors = [];

  constructor(matrix, strategy = 'max', epsilon = 0.000001) {
    this.matrix = new SquareMatrix(matrix);
    this.epsilon = epsilon;
    this.dimension = this.matrix.dimension;
    this.strategy = strategy;
  }

  rotate(p, q) {
    let Omega;
    if (this.matrix.elements[p][p] === this.matrix.elements[q][q]) Omega = Math.PI / 4;
    else Omega = Math.atan((2 * this.matrix.elements[p][q]) / (this.matrix.elements[p][p] - this.matrix.elements[q][q])) / 2;
    const rotationMatrix = SquareMatrix.zeros(this.dimension);
    for (let i = 0; i < this.dimension; ++i) {
      for (let j = 0; j < this.dimension; ++j) {
        if (i === j) {
          if (i === p || i === q) rotationMatrix.elements[i][j] = Math.cos(Omega);
          else rotationMatrix.elements[i][j] = 1;
        } else if (i === p && j === q) rotationMatrix.elements[i][j] = -Math.sin(Omega);
        else if (i === q && j === p) rotationMatrix.elements[i][j] = Math.sin(Omega);
      }
    }
    return rotationMatrix;
  }

  indexesMax() {
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

  indexesCyclic() {
    for (let i = 0; i < this.dimension; ++i) {
      for (let j = i + 1; j < this.dimension; ++j) {
        if (Math.abs(this.matrix[i][j]) > this.epsilon) {
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
      this.matrix = new SquareMatrix(rotation.transpose().multiply(this.matrix).multiply(rotation).elements);
    } while (this.testEpsilon());
    this.eigenvectors = inv(eigenvectorMatrix.elements);
    for (let i = 0; i < this.dimension; ++i) {
      this.eigenvalues.push(this.matrix.elements[i][i]);
    }
    printSolution(this.eigenvalues, this.eigenvectors);
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
        if (Math.abs(this.matrix.elements[i][j]) > this.epsilon) return true;
      }
    }
    return false;
  }
}

module.exports = JacobiDiagonalization;
