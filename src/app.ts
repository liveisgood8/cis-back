import loaders from './loaders';
import { getRepository } from 'typeorm';
import { User } from './models/user';


async function main() {
  await loaders();

  const userRepo = getRepository(User);
  console.log(await userRepo.find());
}

main().catch(console.error);
