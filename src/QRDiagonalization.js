const { SquareMatrix, IdentityMatrix } = require('./Matrix');
const Vector = require('./Vector');
const printSolution = require('./printSolution');

class QRDiagonalization {
  constructor(matrix, epsilon = 0.000001) {
    this.matrix = new SquareMatrix(matrix);
    this.dimension = this.matrix.dimension;
    this.epsilon = epsilon;
    this.eigenvalues = [];
    this.eigenvectors = [];
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
    let eigenvectors = new IdentityMatrix(this.dimension);
    do {
      let { Q, R } = this.decomposition();
      this.matrix = R.multiply(Q);
      eigenvectors = eigenvectors.multiply(Q);
    } while (this.testEpsilon());

    for (let i = 0; i < this.dimension; ++i) {
      this.eigenvectors.push(eigenvectors.column(i));
      this.eigenvalues.push(this.matrix.elements[i][i]);
    }

    printSolution(this.eigenvalues, this.eigenvectors);
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

const B = [
  [12, -51, 4],
  [6, 167, -68],
  [-4, 24, -41],
];
const qr = new QRDiagonalization(B);
qr.solve();
