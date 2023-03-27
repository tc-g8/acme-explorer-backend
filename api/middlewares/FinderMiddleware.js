"use strict";
import Finder from "../models/FinderModel.js";
import Configuration from "../models/ConfigurationModel.js";

const getLastFinder = async (req, res, next) => {
  const { explorerId } = req.query;
  if (explorerId) {
    try {
      req.cachedResults = false;
      const { keyword, minPrice, maxPrice, minDate, maxDate } = req.query;
      const newFinder = new Finder({
        keyword: keyword ?? null,
        minPrice: minPrice ?? null,
        maxPrice: maxPrice ?? null,
        minDate: minDate ?? null,
        maxDate: maxDate ?? null,
        explorer_id: explorerId,
      });
      let lastFinder = await Finder.find({ explorer_id: explorerId })
        .sort("-date")
        .limit(1);

      if (lastFinder.length > 0) {
        lastFinder = lastFinder[0];

        const isTheSameFinder = (
          lastFinder.keyword === newFinder.keyword &&
          lastFinder.minPrice === newFinder.minPrice &&
          lastFinder.maxPrice === newFinder.maxPrice &&
          lastFinder.minDate === newFinder.minDate &&
          lastFinder.maxDate === newFinder.maxDate
        );

        if (isTheSameFinder) {
          const lastFinderDate = new Date(lastFinder.date);
          const configuration = await Configuration.find().limit(1);
          lastFinderDate.setSeconds(lastFinderDate.getSeconds() + configuration[0].cacheLifeTime);
          const cachedFinder = new Date() < lastFinderDate;

          if (cachedFinder) {
            newFinder.date = lastFinder.date;
            req.cachedResults = true;
          }
        }
      }
      req.newFinder = newFinder;
      next();
    } catch (err) {
      res.status(500).send({
        message: "Unexpected error",
        err
      });
    }
  } else {
    next();
  }
};

export { getLastFinder };
