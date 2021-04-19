const ERROR = {
  DIFF_LENGTH: 'Vectors have different lengths',
};

class Vector {
  constructor(vector) {
    this.elements = vector;
    this.dimension = this.elements.length;
  }

  get norm() {
    return Math.sqrt(this.elements.reduce((accumulator, value) => accumulator + value ** 2, 0));
  }

  static zeros(dimension) {
    return new Vector([...Array(dimension)].fill(0));
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

  add(vector) {
    if (this.dimension === vector.dimension) {
      return new Vector(this.elements.map((el, index) => el + vector.elements[index]));
    } else throw new Error(ERROR.DIFF_LENGTH);
  }

  multiply(scalar) {
    return new Vector(this.elements.map(x => x * scalar));
  }

  normalized() {
    return this.multiply(this.norm);
  }
}

module.exports = Vector;
