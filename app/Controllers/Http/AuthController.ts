import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User"
import {rules,schema} from "@ioc:Adonis/Core/Validator"

export default class AuthController {
    public async register({ request,logger,response }: HttpContextContract) {
      const validatorSchema = schema.create({
        fullname: schema.string({},[rules.required()]),
        email: schema.string({},[rules.required(),rules.email(), rules.unique({ table: 'users', column: 'email' })]),
        phone: schema.string({},[rules.required(),rules.maxLength(10),rules.unique({ table: 'users', column: 'phone'})]),
        password: schema.string({},[rules.required(),rules.minLength(6)]),
      })
      try{
      const data = await request.validate({ schema: validatorSchema })
      const user = await User.create(data);
      logger.info (`User Registered---->${user}`);
      response.status(200).send(`User Registered!`);
      }
      catch(error){
        logger.error(`ERROR==>${JSON.stringify(error)}`);
        response.status(404).send('Failure!')
      }
    }
  }
