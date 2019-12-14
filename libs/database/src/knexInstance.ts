import Knex from 'knex';
import { knexConfig } from '../../../knex.config';

export const knex = Knex(knexConfig);
