import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import { DateTime } from "luxon";
import Profile from "App/Models/Profile";

export default class AuthController {
  //REGISTER

  public async register({ request, logger, response }: HttpContextContract) {
    const validatorSchema = schema.create({
      email: schema.string({}, [
        rules.required(),
        rules.email(),
        rules.unique({ table: "users", column: "email" }),
      ]),
      password: schema.string({}, [rules.required(), rules.minLength(6)]),
    });
    try {
      const data = await request.validate({ schema: validatorSchema });
      const user = await User.create(data);
      await Profile.create({ user_id: user.id });
      logger.info(`User Registered---->${JSON.stringify(user)}`);
      return response.status(200).send(`User Registered!`);
    } catch (error) {
      logger.error(`ERROR==>${JSON.stringify(error)}`);
      return response.status(404).send({ error: { message: "Failure!" } });
    }
  }

  //LOGIN

  public async login({ request, logger, auth, response }: HttpContextContract) {
    const password = await request.input("password");
    const email = await request.input("email");

    try {
      const token = await auth.use("api").attempt(email, password, {
        expiresIn: "24hours",
      });
      logger.info(`Logged In Successfully with ${JSON.stringify(token)}`);
      return token.toJSON();
    } catch (error) {
      logger.error(`ERROR==>${JSON.stringify(error)}`);
      return response.status(400).send({
        error: {
          message: "Incorrect Email or Password!",
        },
      });
    }
  }

  //LOGOUT

  public async logout({ auth, logger, response }: HttpContextContract) {
    try {
      await auth.logout();
      logger.info(`Logged Out ${JSON.stringify({ revoke: true })}`);
      return response.status(200).send("Logged Out Successfully!");
    } catch (error) {
      logger.error(`ERROR==>${JSON.stringify(error)}`);
      return response.status(401).send({ error: { message: "Unauthorized!" } });
    }
  }

  //RESET PASSWORD

  public async resetPassword({
    request,
    logger,
    response,
  }: HttpContextContract) {
    try {
      const email = request.input("email");
      const newPassword = request.input("newPassword");
      const payload = { password: newPassword };
      const user = await User.findBy("email", email);
      let result = await user?.merge(payload).save();
      logger.info(
        `Password Reset on ${result?.updatedAt.toLocaleString(
          DateTime.DATETIME_SHORT
        )}`
      );
      return response
        .status(200)
        .send(
          `Password Reset : ${result?.updatedAt.toLocaleString(
            DateTime.DATETIME_SHORT
          )}`
        );
    } catch (error) {
      logger.error(`ERROR==>${JSON.stringify(error)}`);
      return response.status(401).send({ error: { message: "Unauthorized!" } });
    }
  }

  //EDIT PROFILE
  public async editProfile({
    request,
    auth,
    logger,
    response,
  }: HttpContextContract) {
    try {
      const data = await request.body();
      await auth.use("api").authenticate();
      const id = auth.use("api").user?.$attributes.id;
      const profile = await Profile.findBy("user_id", id);
      let result = await profile?.merge(data).save();
      logger.info(`Profile==>${JSON.stringify(result)}`);
      return response.status(200).send(`Profile Updated!`);
    } catch (error) {
      logger.error(`ERROR==>${JSON.stringify(error)}`);
      return response.status(400).send({
        error: {
          message: "Profile with provided credentials could not be found!",
        },
      });
    }
  }

  //SHOW PROFILE
  public async showProfile({ auth, logger, response }: HttpContextContract) {
    try {
      await auth.use("api").authenticate();
      const id = auth.use("api").user?.$attributes.id;
      const email = auth.use("api").user?.$attributes.email;
      const profile = await Profile.findBy("user_id", id);
      let result = { ...profile?.$attributes, email: email };
      logger.info(`Profile==>${JSON.stringify(result)}`);
      return response.status(200).send(result);
    } catch (error) {
      logger.error(`ERROR==>${JSON.stringify(error)}`);
      return response.status(400).send({
        error: {
          message: "Profile with provided credentials could not be found!",
        },
      });
    }
  }
}
