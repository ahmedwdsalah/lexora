export {};

declare global {
  type Include<T, K extends string, V> = T & {
    [P in K]: V;
  };
}
