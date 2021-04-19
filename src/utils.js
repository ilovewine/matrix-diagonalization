const { inv } = require('mathjs');
const { SquareMatrix } = require('./Matrix');

function printSolution({ eigenvectors, eigenvalues }) {
  console.group('EIGENVALUES', eigenvalues);
  console.groupEnd();

  console.group('EIGENVECTORS', eigenvectors);
  console.groupEnd();
}

function determineEigenpairs(eigenvectorMatrix, matrix, dimension) {
  const eigenvectors = [];
  const eigenvalues = [];
  const invertedVectors = new SquareMatrix(inv(eigenvectorMatrix.elements));
  for (let i = 0; i < dimension; ++i) {
    eigenvectors.push(invertedVectors.column(i));
    eigenvalues.push(matrix.elements[i][i]);
  }
  return { eigenvectors, eigenvalues };
}

module.exports = { printSolution, determineEigenpairs };
