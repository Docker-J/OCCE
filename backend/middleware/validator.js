import { validator } from "hono/validator";

/**
 * Validates request JSON body against specified required fields and custom rules.
 *
 * @param {Array<string>|Object} rules - Array of required keys, or rule definition object
 * @returns {import("hono").MiddlewareHandler}
 */
export const validateJson = (rules) => {
  return validator("json", (value, c) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return c.json(
        {
          error: "ValidationError",
          message: "Request body must be a valid JSON object",
        },
        400
      );
    }

    if (Array.isArray(rules)) {
      const missing = rules.filter((key) => {
        const val = value[key];
        return (
          val === undefined ||
          val === null ||
          (typeof val === "string" && !val.trim())
        );
      });

      if (missing.length > 0) {
        return c.json(
          {
            error: "ValidationError",
            message: `Missing or empty required field(s): ${missing.join(", ")}`,
          },
          400
        );
      }
    } else if (typeof rules === "object") {
      for (const [key, rule] of Object.entries(rules)) {
        const val = value[key];

        if (
          rule.required &&
          (val === undefined ||
            val === null ||
            (typeof val === "string" && !val.trim()))
        ) {
          return c.json(
            {
              error: "ValidationError",
              message: rule.message || `Field '${key}' is required`,
            },
            400
          );
        }

        if (val !== undefined && val !== null) {
          if (rule.type && typeof val !== rule.type) {
            return c.json(
              {
                error: "ValidationError",
                message: `Field '${key}' must be of type ${rule.type}`,
              },
              400
            );
          }

          if (rule.pattern && !rule.pattern.test(val)) {
            return c.json(
              {
                error: "ValidationError",
                message:
                  rule.message || `Field '${key}' has an invalid format`,
              },
              400
            );
          }
        }
      }
    }

    return value;
  });
};

/**
 * Validates URL route parameters (e.g. :id, :date, :username).
 *
 * @param {Object} rules - Object where key is param name and value is rule { required, pattern, message }
 * @returns {import("hono").MiddlewareHandler}
 */
export const validateParam = (rules) => {
  return validator("param", (value, c) => {
    for (const [key, rule] of Object.entries(rules)) {
      const val = value[key];

      if (rule.required && (!val || !val.trim())) {
        return c.json(
          {
            error: "ValidationError",
            message: rule.message || `URL parameter '${key}' is required`,
          },
          400
        );
      }

      if (val && rule.pattern && !rule.pattern.test(val)) {
        return c.json(
          {
            error: "ValidationError",
            message:
              rule.message || `URL parameter '${key}' format is invalid`,
          },
          400
        );
      }
    }
    return value;
  });
};

/**
 * Validates Query parameters (e.g. ?page=, ?phone=).
 *
 * @param {Object} rules - Object where key is query name and value is rule { required, pattern, message }
 * @returns {import("hono").MiddlewareHandler}
 */
export const validateQuery = (rules) => {
  return validator("query", (value, c) => {
    for (const [key, rule] of Object.entries(rules)) {
      const val = value[key];

      if (rule.required && (!val || !val.trim())) {
        return c.json(
          {
            error: "ValidationError",
            message: rule.message || `Query parameter '${key}' is required`,
          },
          400
        );
      }

      if (val && rule.pattern && !rule.pattern.test(val)) {
        return c.json(
          {
            error: "ValidationError",
            message:
              rule.message || `Query parameter '${key}' format is invalid`,
          },
          400
        );
      }
    }
    return value;
  });
};
