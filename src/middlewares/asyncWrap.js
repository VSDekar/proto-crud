/**
 * @param {import("express").RequestHandler} fn
 * @returns {import("express").RequestHandler}
 */
export const wrapAsync = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
