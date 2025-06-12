import Joi from "joi";
import { isValidPhoneNumber } from "../middlewares/validations.js";

const SALUTATION_OPTIONS = ["Mr.", "Ms.", "Mrs.", "Dr."];
const CURRENCY_OPTIONS = ["INR", "USD", "EUR"];
const GST_TREATMENT_OPTIONS = [
  "iGST",
  "CGST & SGST",
  "No GST",
  "Zero Tax",
  "SEZ",
];
const TAX_PREFERENCE_OPTIONS = ["Taxable", "Tax Exempt"];
const CUSTOMER_STATUS_OPTIONS = ["Active", "Inactive"];

const addressSchema = Joi.object({
  addressLine: Joi.string().trim().max(255).required().messages({
    "string.empty": "Address Line cannot be empty.",
    "any.required": "Address Line is required.",
  }),
  street: Joi.string().trim().max(100).allow(null, "").messages({
    "string.max": "Street cannot exceed 100 characters.",
  }),
  area: Joi.string().trim().max(100).allow(null, "").messages({
    "string.max": "Area cannot exceed 100 characters.",
  }),
  city: Joi.string().trim().max(100).required().messages({
    "string.empty": "City cannot be empty.",
    "any.required": "City is required.",
  }),
  state: Joi.string().trim().max(100).required().messages({
    "string.empty": "State cannot be empty.",
    "any.required": "State is required.",
  }),
  country: Joi.string().trim().max(100).required().messages({
    "string.empty": "Country cannot be empty.",
    "any.required": "Country is required.",
  }),
  zipCode: Joi.string()
    .trim()
    .pattern(/^[0-9]{5,10}$/)
    .required()
    .messages({
      "string.empty": "Zip Code cannot be empty.",
      "string.pattern.base": "Zip Code must be between 5 and 10 digits.",
      "any.required": "Zip Code is required.",
    }),
})
  .required()
  .messages({
    "any.required": "Customer address is required.",
  });

const contactPersonSchema = Joi.object({
  salutation: Joi.string()
    .valid(...SALUTATION_OPTIONS)
    .messages({
      "any.only": `Salutation must be one of ${SALUTATION_OPTIONS.join(", ")}.`,
    }),
  firstName: Joi.string().trim().max(100).required(),
  lastName: Joi.string().trim().max(100).required(),
  email: Joi.string().email().max(255).allow(null, "").messages({
    "string.email": "Contact person email must be a valid email address.",
  }),
  phoneNumber: Joi.string()
    .custom((value, helpers) => {
      if (value && !isValidPhoneNumber(value)) {
        return helpers.error("string.phoneNumberInvalid");
      }
      return value;
    }, "Phone Number Validation")
    .allow(null, "")
    .messages({
      "string.phoneNumberInvalid":
        "Contact person phone number format is invalid (e.g., +1234567890).",
    }),
  designation: Joi.string().trim().max(100).allow(null, ""),
});

const paymentTermsSchema = Joi.object({
  term_name: Joi.string().trim().max(100).required().messages({
    "string.empty": "Payment term name cannot be empty.",
    "any.required": "Payment term name is required.",
  }),
  days: Joi.number().integer().min(0).required().messages({
    "number.base": "Payment term days must be a number.",
    "number.integer": "Payment term days must be an integer.",
    "number.min": "Payment term days cannot be negative.",
    "any.required": "Payment term days is required.",
  }),
  is_default: Joi.boolean().required().messages({
    "boolean.base": "Payment term default status must be a boolean.",
    "any.required": "Payment term default status is required.",
  }),
})
  .required()
  .messages({
    "any.required": "Payment terms are required.",
  });

const createCustomerSchema = Joi.object({
  salutation: Joi.string()
    .valid(...SALUTATION_OPTIONS)
    .required()
    .messages({
      "any.only": `Salutation must be one of ${SALUTATION_OPTIONS.join(", ")}.`,
      "any.required": "Salutation is required.",
    }),
  firstName: Joi.string().trim().max(100).required().messages({
    "string.empty": "First Name cannot be empty.",
    "any.required": "First Name is required.",
  }),
  lastName: Joi.string().trim().max(100).required().messages({
    "string.empty": "Last Name cannot be empty.",
    "any.required": "Last Name is required.",
  }),
  email: Joi.string().email().max(255).required().messages({
    "string.empty": "Email cannot be empty.",
    "string.email": "Email must be a valid email address.",
    "any.required": "Email is required.",
  }),
  phoneNumber: Joi.string()
    .custom((value, helpers) => {
      if (!isValidPhoneNumber(value)) {
        return helpers.error("string.phoneNumberInvalid");
      }
      return value;
    }, "Phone Number Validation")
    .required()
    .messages({
      "string.empty": "Primary Phone Number cannot be empty.",
      "string.phoneNumberInvalid":
        "Primary Phone Number format is invalid (e.g., +1234567890).",
      "any.required": "Primary Phone Number is required.",
    }),
  secondaryPhoneNumber: Joi.string()
    .custom((value, helpers) => {
      if (value && !isValidPhoneNumber(value)) {
        return helpers.error("string.phoneNumberInvalid");
      }
      return value;
    }, "Phone Number Validation")
    .allow(null, "")
    .messages({
      "string.phoneNumberInvalid":
        "Secondary Phone Number format is invalid (e.g., +1234567890).",
    }),
  address: addressSchema, // Use the nested address schema
  companyName: Joi.string().trim().max(128).required().messages({
    "string.empty": "Company Name cannot be empty.",
    "any.required": "Company Name is required.",
  }),
  displayName: Joi.string().trim().max(128).required().messages({
    "string.empty": "Display Name cannot be empty.",
    "any.required": "Display Name is required.",
  }),
  gstin: Joi.string()
    .trim()
    .length(15)
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/)
    .required()
    .messages({
      "string.empty": "GSTIN cannot be empty.",
      "string.length": "GSTIN must be 15 characters long.",
      "string.pattern.base": "Invalid GSTIN format.",
      "any.required": "GSTIN is required.",
    }),
  currencyCode: Joi.string()
    .valid(...CURRENCY_OPTIONS)
    .required()
    .messages({
      "any.only": `Currency Code must be one of ${CURRENCY_OPTIONS.join(
        ", "
      )}.`,
      "any.required": "Currency Code is required.",
    }),
  gst_treatment: Joi.string()
    .valid(...GST_TREATMENT_OPTIONS)
    .required()
    .messages({
      "any.only": `GST Treatment must be one of ${GST_TREATMENT_OPTIONS.join(
        ", "
      )}.`,
      "any.required": "GST Treatment is required.",
    }),
  tax_preference: Joi.string()
    .valid(...TAX_PREFERENCE_OPTIONS)
    .required()
    .messages({
      "any.only": `Tax Preference must be one of ${TAX_PREFERENCE_OPTIONS.join(
        ", "
      )}.`,
      "any.required": "Tax Preference is required.",
    }),
  exemption_reason: Joi.string()
    .trim()
    .max(500)
    .when("tax_preference", {
      is: "Tax Exempt",
      then: Joi.required().messages({
        "string.empty":
          'Tax Exemption Reason is required when Tax Preference is "Tax Exempt".',
        "any.required":
          'Tax Exemption Reason is required when Tax Preference is "Tax Exempt".',
      }),
      otherwise: Joi.allow(null, ""),
    })
    .messages({
      "string.max": "Tax Exemption Reason cannot exceed 500 characters.",
    }),
  contactPersons: Joi.array().items(contactPersonSchema).default([]),
  payment_terms: paymentTermsSchema, // Use the nested payment terms schema
  notes: Joi.string().trim().max(1000).allow(null, "").messages({
    "string.max": "Notes cannot exceed 1000 characters.",
  }),
  customerStatus: Joi.string()
    .valid(...CUSTOMER_STATUS_OPTIONS)
    .default("Active")
    .messages({
      "any.only": `Customer Status must be one of ${CUSTOMER_STATUS_OPTIONS.join(
        ", "
      )}.`,
    }),
});

const updateCustomerSchema = Joi.object({
  salutation: Joi.string()
    .valid(...SALUTATION_OPTIONS)
    .messages({
      "any.only": `Salutation must be one of ${SALUTATION_OPTIONS.join(", ")}.`,
    }),
  firstName: Joi.string().trim().max(100),
  lastName: Joi.string().trim().max(100),
  email: Joi.string().email().max(255).messages({
    "string.email": "Email must be a valid email address.",
  }),
  phoneNumber: Joi.string()
    .custom((value, helpers) => {
      if (value && !isValidPhoneNumber(value)) {
        return helpers.error("string.phoneNumberInvalid");
      }
      return value;
    }, "Phone Number Validation")
    .messages({
      "string.phoneNumberInvalid":
        "Primary Phone Number format is invalid (e.g., +1234567890).",
    }),
  secondaryPhoneNumber: Joi.string()
    .custom((value, helpers) => {
      if (value && !isValidPhoneNumber(value)) {
        return helpers.error("string.phoneNumberInvalid");
      }
      return value;
    }, "Phone Number Validation")
    .allow(null, ""),
  address: addressSchema, // Use the nested address schema for updates too
  companyName: Joi.string().trim().max(128),
  displayName: Joi.string().trim().max(128),
  gstin: Joi.string()
    .trim()
    .length(15)
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/)
    .messages({
      "string.length": "GSTIN must be 15 characters long.",
      "string.pattern.base": "Invalid GSTIN format.",
    }),
  currencyCode: Joi.string().valid(...CURRENCY_OPTIONS),
  gst_treatment: Joi.string().valid(...GST_TREATMENT_OPTIONS),
  tax_preference: Joi.string().valid(...TAX_PREFERENCE_OPTIONS),
  exemption_reason: Joi.string()
    .trim()
    .max(500)
    .when("tax_preference", {
      is: "Tax Exempt",
      then: Joi.required().messages({
        "string.empty":
          'Tax Exemption Reason is required when Tax Preference is "Tax Exempt".',
        "any.required":
          'Tax Exemption Reason is required when Tax Preference is "Tax Exempt".',
      }),
      otherwise: Joi.allow(null, ""),
    }),
  contactPersons: Joi.array().items(contactPersonSchema),
  payment_terms: paymentTermsSchema,
  notes: Joi.string().trim().max(1000).allow(null, ""),
  customerStatus: Joi.string().valid(...CUSTOMER_STATUS_OPTIONS),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update.",
});

export const paymentTermSchemas = {
    addPaymentTerm: Joi.object({
        termName: Joi.string().trim().max(50).required().label('Term Name'),
        days: Joi.number().integer().min(0).required().label('Days'),
    }),
    updatePaymentTerm: Joi.object({
        termName: Joi.string().trim().max(50).optional().label('Term Name'),
        days: Joi.number().integer().min(0).optional().label('Days'),
    }).min(1)
};

export { createCustomerSchema, updateCustomerSchema };
