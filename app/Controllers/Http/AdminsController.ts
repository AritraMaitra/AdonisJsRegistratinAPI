import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validation from "App/Service/Validation";
import User from 'App/Models/User';
import Profile from 'App/Models/Profile'
export default class AdminsController {
    //ADMIN STORE PROFILE
    public async storeProfile({
        request,
        logger,
        response,
      }: HttpContextContract) {
        try {
          const data = await Validation.aSPValidate(request);
          
          const profile = await Profile.findBy("user_id", data.user_id);
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
    public async deleteUser({request,
        logger,
        response,
      }: HttpContextContract) {
        try {
            const {user_id} = await request.body();
            const user = await User.findBy("id",user_id)
            const profile = await Profile.findBy("user_id", user_id);
            logger.info(`User==>${JSON.stringify(user)}`);
            logger.info(`Profile==>${JSON.stringify(profile)}`);
            await profile?.delete();
            await user?.delete();
            return response.status(200).send(`User Deleted!`);
          } catch (error) {
            logger.error(`ERROR==>${error}`);
            return response.status(400).send({
              error: {
                message: "Profile with provided credentials could not be found!",
              },
            });
          }
      }
}
