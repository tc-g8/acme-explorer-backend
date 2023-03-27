"use strict";
import Configuration from "../models/ConfigurationModel.js";

const i18nConfiguration = async (req, res, next) => {
  if (process.env.NODE_ENV !== "testing") {
    const config = await Configuration.find().limit(1);
    if (config[0]) {
      const lang = config[0].defaultLanguage;
      res.setLocale(lang);
    } else {
      res.setLocale("en");
    }
  }
  next();
};

export { i18nConfiguration };
