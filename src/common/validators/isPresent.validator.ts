import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsPresent(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
        name: 'IsPresent',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
            validate(value: any, args: ValidationArguments): boolean {
                if (value === undefined) return false;
                return Reflect.has(args.object, args.property);
            },
            defaultMessage(args: ValidationArguments): string {
                return `${args.property} must be provided in request body`;
            },
        },
        });
    };
}
