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

  const parts = data.id.split("-");
  if (parts.length !== 3) {
    return [{ message: "Input must be 3 numbers with a dash delimiter like '3-5-4'" }];
  }

  const jug1 = parseFloat(parts[0]);
  const jug2 = parseFloat(parts[1]);
  const goal = parseFloat(parts[2]);

  if (goal <= 0 || (goal > jug1 && goal > jug2)) {
    return [{ message: "Goal amount must be greater than 0 and less than the largest jug." }];
  }

  return [];
};