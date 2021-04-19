const { SquareMatrix } = require('./Matrix');
const Vector = require('./Vector');

class QRDiagonalization {
  constructor(matrix, epsilon = 0.0001) {
    this.matrix = new SquareMatrix(matrix);
  }
}
