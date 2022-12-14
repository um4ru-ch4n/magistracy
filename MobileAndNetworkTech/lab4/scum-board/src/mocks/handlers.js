import { rest } from 'msw';

import config from '../cfg';
import { signIn, validate, signUp } from './auth';
import { updateCard, getBoardList, getBoard } from './board';

export const handlers = [
    rest.post(`${config.apiURI}/auth/login`, signIn),
    rest.get(`${config.apiURI}/auth/validate`, validate),
    rest.post(`${config.apiURI}/auth/register`, signUp),

    rest.post(`${config.apiURI}/board/column/card`, updateCard),
    rest.get(`${config.apiURI}/board`, getBoardList),
    rest.get(`${config.apiURI}/board/:boardID`, getBoard),
]