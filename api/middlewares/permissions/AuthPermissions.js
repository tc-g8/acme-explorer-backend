import Actor from "../../models/ActorModel.js";
import admin from "firebase-admin";

export const getUserIdToken = async (idToken) => {
  try {
    const actorFromFB = await admin.auth().verifyIdToken(idToken);
    const uid = actorFromFB.uid;
    const actor = await Actor.findOne({ email: uid });
    if (!actor) {
      return null;
    } else {
      const id = actor._id;
      return id;
    }
  } catch (err) {
    return false;
  }
};

export const verifyUser = (allowedRoles) => {
  return (req, res, next) => {
    const idToken = req.headers.idtoken;
    if (idToken) {
      admin.auth().verifyIdToken(idToken)
        .then(function (decodedToken) {
          const uid = decodedToken.uid;
          Actor.findOne({ email: uid }, function (err, actor) {
            if (err) {
              res.send(err);
            } else if (!actor) {
              res.status(401).send({ message: "No actor found with the provided email", error: err });
            } else {
              if (allowedRoles.includes(actor.role[0])) {
                next();
              } else {
                res.status(403).send({ message: "The actor has not the required roles", error: err });
              }
            }
          });
        })
        .catch(function (err) {
          res.status(403).send({ message: "The actor has not the required roles", error: err });
        });
    } else {
      res.status(401).send({ message: "An error has occurred. You are probably not registered in the system."});
    }
  };
};
