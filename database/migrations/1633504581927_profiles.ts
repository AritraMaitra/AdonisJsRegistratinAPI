import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Profiles extends BaseSchema {
  protected tableName = "profiles";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.string("firstname").nullable();
      table.string("middlename").nullable();
      table.string("lastname").nullable();
      table.string("phone").nullable();
      table.string("address").nullable();
      table.string("country").nullable();
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
