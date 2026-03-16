import { registerDecorator, ValidationOptions, ValidationArguments, isDate } from 'class-validator';

export function IsDateOrNull(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
        name: 'IsDateOrNull',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
            validate(value: any, args: ValidationArguments): boolean {
                if (value === null) return true;
                return isDate(value);
            },
            defaultMessage(args: ValidationArguments): string {
                return `${args.property} must be a Date or null`;
            },
        },
        });
    };
}
