const getPaginationParams = (query, defaultLimit = 4) => {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || defaultLimit;
    
    const offset = (page - 1) * limit;

    return {
        limit,
        offset,
        page
    };
};

module.exports = { getPaginationParams };