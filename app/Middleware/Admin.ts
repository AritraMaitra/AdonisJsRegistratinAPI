import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InvalidAccessException from 'App/Exceptions/InvalidAccessException';
export default class Admin {

  public async handle ({auth}: HttpContextContract, next: () => Promise<void>) {
    await auth.use('api').authenticate();
    const user = auth.use('api').user;
    if (user?.role_cd!= "admin")
      throw new InvalidAccessException(
      'You are not an Admin....',
      403
      );
    await next();
  }
}
