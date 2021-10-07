import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Profile from "App/Models/Profile";

export default class AuthController {
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
      const profile = await Profile.create({ user_id: user.id });
      console.log(profile);
      logger.info(`User Registered---->${JSON.stringify(user)}`);
      return response.status(200).send(`User Registered!`);
    } catch (error) {
      logger.error(`ERROR==>${JSON.stringify(error)}`);
      return response.status(404).send({ error: { message: "Failure!" } });
    }
  }
  public async login({ request, logger, auth, response }: HttpContextContract) {
    const password = await request.input("password");
    const email = await request.input("email");

    try {
      const token = await auth.use("api").attempt(email, password, {
        expiresIn: "24hours",
      });
      logger.info(`Logged In Successfully with ${token}`);
      return token.toJSON();
    } catch (error) {
      logger.error(`ERROR==>${JSON.stringify(error)}`);
      return response
        .status(400)
        .send({
          error: {
            message: "User with provided credentials could not be found!",
          },
        });
    }
  }
  public async logout({ auth, logger, response }: HttpContextContract) {
    try {
      await auth.logout();
      logger.info(`Logged Out ${{ revoke: true }}`);
      return response.status(200).send("Logged Out Successfully!");
    } catch (error) {
      logger.error(`ERROR==>${JSON.stringify(error)}`);
      return response.status(401).send({ error: { message: "Unauthorized!" } });
    }
  }

}
