import Configuration from "../models/ConfigurationModel.js";

export async function updateConfiguration(req, res) {
  try {
    const configuration = await Configuration.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    if (configuration) {
      res.send(configuration);
    } else {
      res.status(404).send({
        message: res.__("CONFIGURATION_NOT_FOUND")
      });
    }
  } catch (err) {
    res.status(500).send({
      message: res.__("UNEXPECTED_ERROR"),
      err
    });
  }
}

export async function getConfiguration(req, res) {
  try {
    const configurations = await Configuration.find({});
    res.send(configurations[0]);
  } catch (err) {
    res.status(500).send({
      message: res.__("UNEXPECTED_ERROR"),
      err
    });
  }
}
