import process from 'node:process';

export const greet = () => {
  const name = process.env.npm_config_username;
  const insertedName = name ? `, ${name}` : '';

  console.log(`Welcome to the File Manager${insertedName}!`);
}