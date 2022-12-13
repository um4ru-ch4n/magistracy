import { rest } from 'msw';

import config from '../cfg';
import { signIn, validate, signUp } from './auth';

export const handlers = [
    rest.post(`${config.apiURI}/auth/login`, signIn),
    rest.get(`${config.apiURI}/auth/validate`, validate),
    rest.post(`${config.apiURI}/auth/register`, signUp),
]