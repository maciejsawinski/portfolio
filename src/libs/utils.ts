const random = (min: number, max: number) => {
  return Math.floor(min + Math.random() * (max - min + 1));
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export { random, sleep };
