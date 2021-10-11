/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/
import Route from "@ioc:Adonis/Core/Route";
Route.get("/", "HomeController.index");
Route.post("register", "AuthController.register").as("register");

Route.group(() => {
  Route.post("logout", "AuthController.logout").as("logout");
  Route.post("store-profile", "ProfilesController.storeProfile").as("store-profile");
  Route.get("show-profile", "ProfilesController.showProfile").as("show-profile");
}).middleware(["auth"]);
Route.group(()=> {
 Route.post("admin/store-profile","AdminsController.storeProfile").as("admin/store-profile");
 Route.delete("admin/delete-user","AdminsController.deleteUser").as("admin/delete-user");
}).middleware(["auth","admin"]);
Route.post("login", "AuthController.login").as("login");
