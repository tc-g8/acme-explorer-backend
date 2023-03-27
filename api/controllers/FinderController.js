"use strict";

export async function addFinder(req, res, next) {
  const finder = req.newFinder;
  if (finder) {
    try {
      await finder.save();
      next();
    } catch (err) {
      if (err.name === "ValidationError") {
        res.status(422).send(err);
      } else {
        res.status(500).send(err);
      }
    }
  } else {
    next();
  }
}
