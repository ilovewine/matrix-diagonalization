const ERROR = {
  DIFF_LENGTH: 'Columns have different lengths',
  INCOMPATIBLE: 'Cannot perform the operation - incompatible dimensions',
  WRONG_INDEX: 'Index out of matrix dimension',
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
    if (index >= 0 && index < this.dimensions[0]) {
      return this.elements.map(row => row[index])
    } else throw new Error(ERROR.WRONG_INDEX)
  }

  testDimensions() {
    if (!this.elements.every(row => row.length === this.dimensions[1])) throw new Error(ERROR.DIFF_LENGTH);
  }

  add(matrix) {
    if (this.dimensions[0] === matrix.dimensions[0] && this.dimensions[1] === matrix.dimensions[1]) {
      const result = [];
      for (let i = 0; i < this.dimensions[0]; ++i) {
        let row = [];
        for (let j = 0; j < this.dimensions[1]; ++j) {
          row.push(this.elements[i][j] + matrix.elements[i][j]);
        }
        result.push(row);
      }
      return new Matrix(result);
    } else throw new Error(ERROR.INCOMPATIBLE);
  }

  multiply(matrix) {
    if (this.dimensions[1] === matrix.dimensions[0]) {
      const result = [];
      for (let i = 0; i < this.dimensions[0]; ++i) {
        let row = [];
        for (let j = 0; j < matrix.dimensions[1]; ++j) {
          let vector1 = new Vector(this.row(i))
          let vector2 = new Vector(matrix.column(j))
          row.push(vector1.dot(vector2))
        }
        result.push(row)
      }
      return new Matrix(result)
    } else throw new Error(ERROR.INCOMPATIBLE);
  }
}

module.exports = Matrix;
