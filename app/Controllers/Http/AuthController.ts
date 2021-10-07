import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import { rules, schema } from "@ioc:Adonis/Core/Validator";

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
      logger.info(`Logged In Successfully with ${JSON.stringify(token)}`);
      return token.toJSON();
    } catch (error) {
      logger.error(`ERROR==>${JSON.stringify(error)}`);
      return response
        .status(400)
        .send({
          error: {
            message: "Incorrect Email or Password!",
          },
        });
    }
  }
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
  public async resetPassword({ request, logger, response }: HttpContextContract) {
    try {
      const email = request.input('email');
      const newPassword = request.input('newPassword')
      const payload = {password:newPassword}
      const user = await User.findBy("email", email);
      let result = await user?.merge(payload).save();
      logger.info(`Password Reset on ${result?.updatedAt}`);
      return response.status(200).send(`Password Reset : ${result}`);
    } catch (error) {
      logger.error(`ERROR==>${JSON.stringify(error)}`);
      return response.status(401).send({ error: { message: "Unauthorized!" } });
    }
  }

}
