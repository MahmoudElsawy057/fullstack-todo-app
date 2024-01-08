import * as yup from "yup";

export const validationSchema = yup
  .object({
    username: yup
      .string()
      .required("username is required")
      .min(5, "username should be atleast 5 characters"),
    email: yup
      .string()
      .required("email is required")
      .matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, "not a valid email"),
    password: yup
      .string()
      .required("password is required")
      .min(6, "password should be atleast 5 characters"),
  })
  .required();

export const validationLoginSchema = yup
  .object({
    identifier: yup
      .string()
      .required("email is required")
      .matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, "not a valid email"),
    password: yup
      .string()
      .required("password is required")
      .min(6, "password should be atleast 5 characters"),
  })
  .required();
