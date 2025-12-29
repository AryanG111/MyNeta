module.exports = function validate(schema) {
	return (req, res, next) => {
		if (!schema || !schema.body) return next();
		const { error, value } = schema.body.validate(req.body, { abortEarly: false, stripUnknown: true });
		if (error) {
			return res.status(400).json({ message: 'Validation failed', errors: error.details.map(d => d.message) });
		}
		req.body = value;
		next();
	};
};

function validate(schema) {
  return async (req, res, next) => {
    try {
      const value = await schema.validateAsync({
        body: req.body,
        params: req.params,
        query: req.query
      }, { abortEarly: false, stripUnknown: true });
      req.body = value.body || req.body;
      req.params = value.params || req.params;
      req.query = value.query || req.query;
      next();
    } catch (err) {
      return res.status(400).json({ message: 'Validation error', details: err.details });
    }
  };
}

module.exports = validate;

