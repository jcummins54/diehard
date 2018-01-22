const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });
require("ajv-errors")(ajv, true);

const createEventSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
      pattern: "^([0-9]+(\.[0-9]{1,2})?)\-([0-9]+(\.[0-9]{1,2})?)\-([0-9]+(\.[0-9]{1,2})?)$",
    },
  },
  errorMessage: "Path should be in the form 'decimal-decimal-decimal' e.g. '/solutions/3-5-4'.",
};

const validateSchema = ajv.compile(createEventSchema);

module.exports.validate = (data) => {
  if (!validateSchema(data)) {
    return validateSchema.errors;
  }
  return [];
};