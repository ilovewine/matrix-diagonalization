function printSolution(eigenvalues, eigenvectors) {
  console.group('EIGENVALUES', eigenvalues);
  console.groupEnd();

  console.group('EIGENVECTORS', eigenvectors);
  console.groupEnd();
}

module.exports = printSolution;
