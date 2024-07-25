async function errorHandler(error, req, res, next) {
    // console.log(error.message,'<<<<<<<<<<<<<<<<<<<<<<<');
    let status = error.status || 500;
    let message = error.message || "Internal server error";
    // console.log(error.name);
    switch (error.name) {
        case "Input is wrong":
            status = 400;
            message = "Email or password is required";
            break;
        case "SequelizeUniqueConstraintError":
        case "SequelizeValidationError":
            status = 400;
            message = error.errors.map((el) => {
                // console.log(el.message);
                return el.message;
            });
            break;
        case "User not found":
            status = 401;
            message = "Your email or password are wrong";
            break;
        case "Invalid Token":
        case "JsonWebTokenError":
            status = 401;
            message = "Unauthenticate";
            break;
        case "Forbidden":
            status = 403;
            message = "Unauthorize";
            break;
        case "NotFound":
            status = 404;
            message = "Data not found";
            break;
    }
    res.status(status).json({ message });
}

module.exports = errorHandler;
