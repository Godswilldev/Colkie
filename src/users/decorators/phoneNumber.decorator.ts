import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { User } from "src/users/entities/user.entity";

@ValidatorConstraint({ async: true })
export class IsPhoneNumberAlreadyExistConstraint implements ValidatorConstraintInterface {
  validate(phoneNumber: any, args: ValidationArguments) {
    // @ts-ignore
    return User.findOneBy({ phoneNumber }).then((phoneNumber) => {
      if (phoneNumber) return false;
      return true;
    });
  }
}

export function IsPhoneNumberAlreadyExist(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberAlreadyExistConstraint,
    });
  };
}
