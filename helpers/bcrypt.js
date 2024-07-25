const { compareSync, hashSync } = require("bcryptjs");

module.exports = {
    hashPassword: (pw) => hashSync(pw),
    comparePassword: (pw, pw_db) => compareSync(pw, pw_db),
};
