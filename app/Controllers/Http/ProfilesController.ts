import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from "App/Models/Profile";
import Validation from "App/Service/Validation";
export default class ProfilesController {

//STORE PROFILE
  public async storeProfile({
    request,
    auth,
    logger,
    response,
  }: HttpContextContract) {
    try {
      const data = await Validation.sPValidate(request);
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