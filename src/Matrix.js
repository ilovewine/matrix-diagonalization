const Vector = require('./Vector');

const ERROR = {
  INCOMPATIBLE: 'Cannot perform the operation - incompatible dimensions',
  WRONG_INDEX: 'Index out of matrix dimension',
  NOT_SQUARE: 'The matrix is not square',
};

class SquareMatrix {
  constructor(elements) {
    this.elements = elements;
    this.dimension = this.elements.length;
    this.testDimensions();
  }

  static filledWith(dimension, value) {
    const elements = [...Array(dimension)].map(() => [...Array(dimension)].fill(value));
    return new SquareMatrix(elements);
  }

  static zeros(dimension) {
    return SquareMatrix.filledWith(dimension, 0);
  }

  row(index) {
    if (index >= 0 && index < this.dimension) {
      return this.elements[index];
    } else throw new Error(ERROR.WRONG_INDEX);
  }

  column(index) {
    if (index >= 0 && index < this.dimension) {
      return this.elements.map(row => row[index]);
    } else throw new Error(ERROR.WRONG_INDEX);
  }

  testDimensions() {
    if (!this.elements.every(row => row.length === this.dimension)) throw new Error(ERROR.NOT_SQUARE);
  }

  multiply(matrix) {
    if (this.dimension === matrix.dimension) {
      const result = [];
      for (let i = 0; i < this.dimension; ++i) {
        let row = [];
        for (let j = 0; j < matrix.dimension; ++j) {
          let vector1 = new Vector(this.row(i));
          let vector2 = new Vector(matrix.column(j));
          row.push(vector1.dot(vector2));
        }
        result.push(row);
      }
      return new SquareMatrix(result);
    } else throw new Error(ERROR.INCOMPATIBLE);
  }

  transpose() {
    const result = SquareMatrix.zeros(this.dimension);
    for (let i = 0; i < this.dimension; ++i) {
      for (let j = 0; j < this.dimension; ++j) {
        result.elements[j][i] = this.elements[i][j];
      }
    }
    return result;
  }
}

class IdentityMatrix extends SquareMatrix {
  constructor(dimension) {
    const matrix = SquareMatrix.zeros(dimension);
    for (let i = 0; i < dimension; ++i) {
      matrix.elements[i][i] = 1;
    }
    super(matrix.elements);
  }
}

module.exports = { SquareMatrix, IdentityMatrix };
