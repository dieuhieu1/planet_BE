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

const paginatedSuccess = (res, items, totalItems, page, limit, message = 'Success', statusCode = 200) => {
    const totalPages = Math.ceil(totalItems / limit);
    return res.status(statusCode).json({
        success: true,
        message,
        data: {
            pagination: {
                totalItems,
                totalPages,
                currentPage: Number(page),
                limit: Number(limit)
            },
            items,
        }
    });
};

module.exports = {
    success,
    error,
    paginatedSuccess
};
