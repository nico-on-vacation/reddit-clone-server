import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";
import validator from "validator";
import { FieldError } from "../resolvers/FieldError";

export const validateRegister = (options: UsernamePasswordInput) : FieldError[] => {
  if (!validator.isEmail(options.email)) {
    return [
      {
        field: "email",
        message: "email invalid",
      },
    ];
  }

  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "username must be greater than 2",
      },
    ];
  }

  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "cannot include an @",
      },
    ];
  }

  if (options.password.length <= 2) {
    return [
      {
        field: "password",
        message: "password must be greater than 3",
      },
    ];
  }

  return [];
};
