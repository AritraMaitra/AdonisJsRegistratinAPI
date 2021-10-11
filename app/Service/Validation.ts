import { rules, schema } from "@ioc:Adonis/Core/Validator";
export default class Validation { 
    public static async rValidate(request){
    const validatorSchema = schema.create({
        email: schema.string({}, [
          rules.required(),
          rules.email(),
          rules.unique({ table: "users", column: "email" }),
        ]),
        password: schema.string({}, [rules.required(), rules.minLength(6)]),
        role_cd: schema.string()
      });
      const data = await request.validate({ schema: validatorSchema });
      return data;
    }
    public static async lValidate(request){
      const validatorSchema = schema.create({
          email: schema.string({}, [
            rules.required(),
            rules.email(),
          ]),
          password: schema.string({}, [rules.required(), rules.minLength(6)]),
        });
        const data = await request.validate({ schema: validatorSchema });
        return data;
    }
    public static async sPValidate(request){
      const validatorSchema = schema.create({
          firstname: schema.string.optional(),
          middlename: schema.string.optional(),
          lastname: schema.string.optional(),
          phone: schema.string.optional(),
          address: schema.string.optional(),
          country: schema.string.optional(),
        });
        const data = await request.validate({ schema: validatorSchema });
        return data;
      } 
      public static async aSPValidate(request){
        const validatorSchema = schema.create({
            user_id: schema.string(),
            firstname: schema.string.optional(),
            middlename: schema.string.optional(),
            lastname: schema.string.optional(),
            phone: schema.string.optional(),
            address: schema.string.optional(),
            country: schema.string.optional(),
          });
          const data = await request.validate({ schema: validatorSchema });
          return data;
        } 

}