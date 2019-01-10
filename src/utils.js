export const debounce = fn => {
  let timer = null;
  return function() {
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      clearTimeout(timer);
      fn.apply(this, args);
    }, 500);
  };
};
