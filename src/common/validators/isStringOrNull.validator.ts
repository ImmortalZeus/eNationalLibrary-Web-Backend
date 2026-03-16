import { registerDecorator, ValidationOptions, ValidationArguments, isString } from 'class-validator';

export function IsStringOrNull(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
        name: 'IsStringOrNullorUndefined',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
            validate(value: any, args: ValidationArguments): boolean {
                if (value === null) return true;
                return isString(value);
            },
            defaultMessage(args: ValidationArguments): string {
                return `${args.property} must be a string or null`;
            },
        },
        });
    };
}
