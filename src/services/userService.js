import db from '../models/db.js';

export const getUserByUsername = async (username) => {
  const row = await db('users').where({ username }).first();
  return row;
};

export const getUserById = async (id) => {
  return db('users').where({ id }).first();
};
