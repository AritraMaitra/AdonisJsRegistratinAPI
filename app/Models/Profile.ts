import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @column()
  public user_id: number;

  @column()
  public firstname?: string;

  @column()
  public middlename?: string;

  @column()
  public lastname?: string;

  @column()
  public phone?: string;

  @column()
  public address?: string;

  @column()
  public country?: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
