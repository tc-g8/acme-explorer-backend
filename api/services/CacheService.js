"use strict";
import Cache from "../models/CacheModel.js";

const getCachedResults = async (explorerId) => {
  try {
    const cache = await Cache.find({ explorer_id: explorerId }).limit(1);
    return cache[0].results;
  } catch (err) {
    throw new Error("Error accessing cached results: " + err);
  }
};

const saveResultsToCache = async (explorerId, results) => {
  try {
    let cache = await Cache.find({ explorer_id: explorerId });
    if (cache.length > 0) {
      cache = cache[0];
      cache.results = results;
      cache = await cache.save();
    } else {
      cache = await Cache.create({
        explorer_id: explorerId,
        results
      });
    }
    return cache;
  } catch (err) {
    throw new Error("Error caching results: " + err);
  }
};

export { getCachedResults, saveResultsToCache };
