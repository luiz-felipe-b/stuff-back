import { AccessRepository } from "./access.repository";
import { AccessService } from "./services/access.service";

const accessRepository = new AccessRepository();

export const accessService = new AccessService(accessRepository);
