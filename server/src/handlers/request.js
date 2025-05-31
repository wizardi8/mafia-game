const requestHandler = (handler) => {
    return async (req, res, next) => {
        const { baseUrl } = req || {};

        try {
            await handler(req, res, next);

            console.log('Request handler: ' + baseUrl);
        } catch (error) {
            console.log('[ERROR] Request handler error: ' + error);

            next(error);
        }
    };
};

module.exports = { requestHandler };
