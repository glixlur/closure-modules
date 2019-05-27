import { basename, extname } from "path";

/**
 * @example
 * asyncFlatMap :: (a -> Promise (Either b List b)) -> List a -> Promise List b
 */
export function asyncFlatMap<T, R>(fn: (value: T) => Promise<R[] | R>, list: T[]) {
  return Promise.all(list.map(fn)).then(arr => arr.flat() as R[])
}

/**
 * Removes extension from a file name.
 */
export function dropExt(filename: string) {
  return basename(filename, extname(filename));
}