const ERROR = {
  DIFF_LENGTH: 'Vectors have different lengths',
};

class Vector {
  constructor(vector) {
    this.elements = vector;
    this.dimension = this.elements.length;
  }

  dot(vector) {
    if (this.dimension === vector.dimension) {
      let result = 0;
      for (let i = 0; i < this.dimension; ++i) {
        result += this.elements[i] * vector.elements[i];
      }
      return result;
    } else throw new Error(ERROR.DIFF_LENGTH);
  }
}

module.exports = Vector;
