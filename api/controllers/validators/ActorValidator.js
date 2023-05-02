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
    .trim(),
  check("surname").exists({ checkNull: true, checkFalsy: true })
    .isString()
    .trim(),
  check("preferredLanguage").optional()
    .isLocale()
    .trim()
    .escape(),
  check("phone").optional()
    .isString()
    .trim(),
  check("address").optional()
    .isString()
    .trim(),
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
    .isStrongPassword({ minLength: 5 })
];

const passwordNotPresent = [
  check("password")
    .not()
    .exists()
];

const emailValidator = [
  check("email").exists({ checkNull: true, checkFalsy: true })
    .isString()
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail()
    .custom(_checkActorEmailValid)
];

const emailNotPreset = [
  check("email")
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
  passwordNotPresent,
  emailValidator,
  emailNotPreset
};
