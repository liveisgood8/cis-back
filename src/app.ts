import loaders from './loaders';


async function main(): Promise<void> {
  await loaders();
}

main().catch(console.error);
