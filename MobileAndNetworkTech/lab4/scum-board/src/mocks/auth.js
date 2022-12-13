const USERS = [
    {
        username: 'qwer',
        password: 'qwer'
    },
]

export const signIn = (req, res, ctx) => {
    const { username, password } = req.body;
    var user = getUserByUsernamePassword(username, password)
    if (user.username === undefined) {
        return res(
            ctx.status(401)
        );
    }

    return res(
        ctx.status(200),
        ctx.set('Content-Type', 'application/json'),
        ctx.json({
            token: 'Bearer token_' + user.username + '_' + user.password,
        })
    );
};

export const signUp = (req, res, ctx) => {
    const { username, password } = req.body;
    if (username === '') {
        return res(
            ctx.status(400),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
                error: 'Username mustn\'t be empty'
            })
        );
    }
    if (getUserByUsername(username).username !== undefined) {
        return res(
            ctx.status(400),
            ctx.set('Content-Type', 'application/json'),
            ctx.json({
                error: 'User with such username already exists'
            })
        );
    }

    USERS.push({
        username: username,
        password: password,
    });

    return res(
        ctx.status(201),
    );
};

export const validate = (req, res, ctx) => {
    const headers = req.headers;
    const token = headers.get('Authorization');

    if (doesTokenExists(token).username === undefined) {
        return res(
            ctx.status(401),
        )
    }

    return res(
        ctx.status(200),
    );
};

const getUserByUsername = (username) => {
    for (var i = 0; i < USERS.length; i++) {
        if (username === USERS[i].username) {
            return USERS[i];
        }
    }

    return {};
}

const getUserByUsernamePassword = (username, password) => {
    for (var i = 0; i < USERS.length; i++) {
        if (username === USERS[i].username && password === USERS[i].password) {
            return USERS[i];
        }
    }

    return {};
}

const doesTokenExists = (token) => {
    for (var i = 0; i < USERS.length; i++) {
        if (token === ('Bearer token_' + USERS[i].username + '_' + USERS[i].password)) {
            return USERS[i];
        }
    }

    return {};
}