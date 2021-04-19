const Vector = require('./Vector');

const ERROR = {
  DIFF_LENGTH: 'Columns have different lengths',
  INCOMPATIBLE: 'Cannot perform the operation - incompatible dimensions',
  WRONG_INDEX: 'Index out of matrix dimension',
  NOT_SQUARE: 'The matrix is not square',
  ASYMMETRIC: 'The matrix is not symmetric',
};

class Matrix {
  constructor(elements) {
    this.elements = elements;
    this.testDimensions();
  }

  get dimensions() {
    const rowLength = this.elements.length;
    const columnLength = this.elements[0].length;
    return [rowLength, columnLength];
  }

  row(index) {
    if (index >= 0 && index < this.dimensions[0]) {
      return this.elements[index];
    } else throw new Error(ERROR.WRONG_INDEX);
  }

  column(index) {
    if (index >= 0 && index < this.dimensions[1]) {
      return this.elements.map(row => row[index]);
    } else throw new Error(ERROR.WRONG_INDEX);
  }

  testDimensions() {
    if (!this.elements.every(row => row.length === this.dimensions[1])) throw new Error(ERROR.DIFF_LENGTH);
  }

  multiply(matrix) {
    if (this.dimensions[1] === matrix.dimensions[0]) {
      const result = [];
      for (let i = 0; i < this.dimensions[0]; ++i) {
        let row = [];
        for (let j = 0; j < matrix.dimensions[1]; ++j) {
          let vector1 = new Vector(this.row(i));
          let vector2 = new Vector(matrix.column(j));
          row.push(vector1.dot(vector2));
        }
        result.push(row);
      }
      return new Matrix(result);
    } else throw new Error(ERROR.INCOMPATIBLE);
  }

  transpose() {
    const result = [...Array(this.dimensions[1]).keys()].map(() => [...Array(this.dimensions[0])]);
    for (let i = 0; i < this.dimensions[0]; ++i) {
      for (let j = 0; j < this.dimensions[1]; ++j) {
        result[j][i] = this.elements[i][j];
      }
    }
    return new Matrix(result);
  }
}

class SquareMatrix extends Matrix {
  constructor(elements) {
    super(elements);
    this.testSquareDimensions();
    this.dimension = this.dimensions[0];
  }

  testSquareDimensions() {
    if (this.dimensions[0] !== this.dimensions[1]) throw new Error(ERROR.NOT_SQUARE);
  }
}

class IdentityMatrix extends SquareMatrix {
  constructor(dimension) {
    const elements = [...Array(dimension)].map(() => [...Array(dimension)].fill(0));
    for (let i = 0; i < dimension; ++i) {
      elements[i][i] = 1;
    }
    super(elements);
  }
}

module.exports = { Matrix, SquareMatrix, IdentityMatrix };
