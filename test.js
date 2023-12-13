function add(a, b) {
  return a + b;
}

function sub(a, b) {
  return a - b;
}

function useCallback(callback) {
  return callback();
}

const result = useCallback(() => add(1, 2));

console.log(result);
