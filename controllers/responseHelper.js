const success = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

const error = (res, message = 'Internal Server Error', statusCode = 500, details = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: details
    });
};

module.exports = {
    success,
    error
};
