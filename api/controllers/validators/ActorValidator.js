import { check } from "express-validator";
import Actor from "../../models/ActorModel.js";

const _checkActorEmailValid = async (value, { req }) => {
  try {
    const actorWithSameEmail = await Actor.findOne({ email: value });
    if (actorWithSameEmail) {
      return Promise.reject(new Error("Actor email already exists"));
    } else {
      return Promise.resolve("Actor email OK");
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

const actorValidator = [
  check("name").exists({ checkNull: true, checkFalsy: true })
    .isString()
    .trim()
    .escape(),
  check("surname").exists({ checkNull: true, checkFalsy: true })
    .isString()
    .trim()
    .escape(),
  check("email").exists({ checkNull: true, checkFalsy: true })
    .isString()
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail()
    .custom(_checkActorEmailValid),
  check("preferredLanguage").optional()
    .isLocale()
    .trim()
    .escape(),
  check("phone").optional()
    .exists({ checkNull: true, checkFalsy: true })
    .isString()
    .trim()
    .escape(),
  check("address").optional()
    .exists({ checkNull: true, checkFalsy: true })
    .isString()
    .trim()
    .escape(),
  check("role").exists({ checkNull: true, checkFalsy: true })
    .isArray()
    .isIn(["ADMINISTRATOR", "MANAGER", "EXPLORER", "SPONSOR"]),
  check("banned")
    .not()
    .exists()
];

const passwordValidator = [
  check("password").exists({ checkNull: true, checkFalsy: true })
    .isString()
    .trim()
    .escape()
    .isStrongPassword({ minLength: 5 })
];

const passwordNotPresent = [
  check("password")
    .not()
    .exists()
];

const banValidator = [
  check("banned").exists({ checkNull: true })
    .isBoolean()
];

export {
  actorValidator,
  passwordValidator,
  banValidator,
  passwordNotPresent
};
