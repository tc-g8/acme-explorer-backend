import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import actorRoutes from "./api/routes/ActorRoutes.js";
import applicationRoutes from "./api/routes/ApplicationRoutes.js";
import configurationRoutes from "./api/routes/ConfigurationRoutes.js";
import dataWareHouseRoutes from "./api/routes/DataWareHouseRoutes.js";
import tripRoutes from "./api/routes/TripRoutes.js";
import initMongoDBConnection from "./api/config/mongoose.js";
import swagger from "./docs/swagger.js";
import admin from "firebase-admin";
import { initializeDataWarehouseJob } from "./api/services/DataWarehouseServiceProvider.js";
import { I18n } from "i18n";
import { i18nConfiguration } from "./api/middlewares/I18nMiddleware.js";
dotenv.config();

const account = process.env.SERVICE_ACCOUNT || "{}";
const serviceAccount = JSON.parse(account);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const i18n = new I18n({
  locales: ["es", "en"],
  directory: "./locales",
  defaultLocale: "es"
});
const port = process.env.PORT || 8080;
app.use(i18n.init);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(i18nConfiguration);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, idToken");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  next();
});

actorRoutes(app);
applicationRoutes(app);
configurationRoutes(app);
dataWareHouseRoutes(app);
tripRoutes(app);
swagger(app);

if (process.env.NODE_ENV !== "testing") {
  initMongoDBConnection()
    .then(() => {
      app.listen(port, function () {
        console.log("ACME-Explorer RESTful API server started on: " + port);
      });
    })
    .catch((err) => {
      console.error("ACME-Explorer RESTful API could not connect to DB " + err);
    });

  initializeDataWarehouseJob();
} else {
  app.listen(port, function () {
    console.log("ACME-Explorer RESTful API server started on: " + port);
  });
}

export default app;
