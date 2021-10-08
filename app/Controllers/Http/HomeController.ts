export default class HomeController {
  public async index({ response, logger }) {
    logger.info({ message: "Homepage" });
    response.status(200).send("Welcome to the Home Page");
  }
}
