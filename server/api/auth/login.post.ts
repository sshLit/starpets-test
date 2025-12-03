export default defineEventHandler(async (event) => {
  await readBody(event);

  const balance = 9999;
  const login = 'StarPets LTD';

  return {
    balance,
    login,
  };
});
