import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  registerDecorator,
} from 'class-validator';
import { ValidationOptions } from 'joi';

export class EditMemberDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  group?: string;

  @IsBirthday()
  @IsString()
  @IsOptional()
  birthday?: string;
}

function IsBirthday(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBirthday',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return true;
          const dateRegex =
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
          const match = dateRegex.exec(value);
          if (!match) return false;
          const day = parseInt(match[1], 10);
          const month = parseInt(match[2], 10);
          const year = parseInt(match[3], 10);

          if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return false; // Invalid numbers
          }
          const date = new Date(year, month - 1, day);

          if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
          ) {
            return false; // Date is invalid
          }

          return true; // Date is valid
        },
      },
    });
  };
}
