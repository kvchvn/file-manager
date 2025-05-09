import process from 'node:process';

export const bye = () => {
  const name = process.env.npm_config_username;
  const insertedName = name ? `, ${name}` : '';

  console.log(`\nThank you for using File Manager${insertedName}, goodbye!`);
}