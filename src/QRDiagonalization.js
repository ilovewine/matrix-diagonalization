const { SquareMatrix, IdentityMatrix } = require('./Matrix');
const Vector = require('./Vector');
const utils = require('./utils');

class QRDiagonalization {
  constructor(matrix, epsilon = 0.000001) {
    this.matrix = new SquareMatrix(matrix);
    this.dimension = this.matrix.dimension;
    this.epsilon = epsilon;
  }

  proj(u, a) {
    return u.multiply(u.dot(a) / u.dot(u));
  }

  GramSchmidt() {
    const orthonormalVectors = [];
    for (let i = 0; i < this.dimension; ++i) {
      let column = new Vector(this.matrix.column(i));
      let projSum = Vector.zeros(this.dimension);
      for (let j = 0; j < i; ++j) {
        projSum = projSum.add(this.proj(orthonormalVectors[j], column));
      }
      orthonormalVectors.push(column.add(projSum.multiply(-1)).normalized());
    }
    return orthonormalVectors;
  }

  decomposition() {
    const orthonormalVectors = this.GramSchmidt();
    const Q = new SquareMatrix(orthonormalVectors.map(vector => vector.elements)).transpose();
    const R = SquareMatrix.zeros(this.dimension);
    for (let i = 0; i < this.dimension; ++i) {
      for (let j = i; j < this.dimension; ++j) {
        let column = new Vector(this.matrix.column(j));
        R.elements[i][j] = orthonormalVectors[i].dot(column);
      }
    }
    return { Q, R };
  }

  solve() {
    let eigenvectorMatrix = new IdentityMatrix(this.dimension);
    do {
      let { Q, R } = this.decomposition();
      this.matrix = R.multiply(Q);
      eigenvectorMatrix = eigenvectorMatrix.multiply(Q);
    } while (this.testEpsilon());
    const eigenpairs = utils.determineEigenpairs(eigenvectorMatrix, this.matrix, this.dimension);
    utils.printSolution(eigenpairs);
  }

  testEpsilon() {
    for (let i = 0; i < this.dimension; ++i) {
      for (let j = 0; j < i; ++j) {
        if (Math.abs(this.matrix.elements[i][j]) > this.epsilon) return true;
      }
    }
    return false;
  }
}

module.exports = QRDiagonalization;
