import { registerDecorator, ValidationOptions, ValidationArguments, isISO8601, isString } from 'class-validator';

export function IsDateStringOrNull(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
        name: 'IsDateStringOrNull',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
            validate(value: any, args: ValidationArguments): boolean {
                if (value === null) return true;
                if (isString(value)) {
                    return isISO8601(value);
                }
                return false;
            },
            defaultMessage(args: ValidationArguments): string {
                return `${args.property} must be a Date or null`;
            },
        },
        });
    };
}
