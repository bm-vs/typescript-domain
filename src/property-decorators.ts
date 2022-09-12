import {defaultMetadataStorage} from './metadata-storage';
import {Constructor} from './types';

type ObjectClassKeys<Class, FieldType> = {
	[Key in keyof Class]-?: FieldType extends Class[Key] ? Key : never;
}[keyof Class];

export const AutoObject =
	<FieldType>(type: Constructor<FieldType>) =>
	// eslint-disable-next-line @typescript-eslint/ban-types
	<Class extends Object>(
		target: Class,
		field: ObjectClassKeys<Class, FieldType>
	) => {
		defaultMetadataStorage.addMetadata({
			target: target.constructor,
			field: field as string,
			type
		});
	};

export const AutoBoolean = <
	Class extends Record<FieldType, boolean | null>,
	FieldType extends string
>(
	target: Class,
	field: FieldType
) => {
	defaultMetadataStorage.addMetadata({
		target: target.constructor,
		field,
		type: Boolean
	});
};

export const AutoString = <
	Class extends Record<FieldType, string | null>,
	FieldType extends string
>(
	target: Class,
	field: FieldType
) => {
	defaultMetadataStorage.addMetadata({
		target: target.constructor,
		field,
		type: String
	});
};

export const AutoNumber = <
	Class extends Record<FieldType, number | null>,
	FieldType extends string
>(
	target: Class,
	field: FieldType
) => {
	defaultMetadataStorage.addMetadata({
		target: target.constructor,
		field,
		type: Number
	});
};

export const AutoDate = <
	Class extends Record<FieldType, Date | null>,
	FieldType extends string
>(
	target: Class,
	field: FieldType
) => {
	defaultMetadataStorage.addMetadata({
		target: target.constructor,
		field,
		type: Date
	});
};

export const AutoEnum =
	<EnumType>(options: readonly EnumType[]) =>
	<Class extends Record<FieldType, EnumType | null>, FieldType extends string>(
		target: Class,
		field: FieldType
	) => {
		defaultMetadataStorage.addMetadata({
			target: target.constructor,
			field,
			type: options
		});
	};

export const AutoObjectArray =
	<FieldType>(type: Constructor<FieldType>) =>
	// eslint-disable-next-line @typescript-eslint/ban-types
	<Class extends Object>(
		target: Class,
		field: ObjectClassKeys<Class, FieldType[]>
	) => {
		defaultMetadataStorage.addMetadata({
			target: target.constructor,
			field: field as string,
			type,
			array: true
		});
	};

export const AutoBooleanArray = <
	Class extends Record<FieldType, boolean[]>,
	FieldType extends string
>(
	target: Class,
	field: FieldType
) => {
	defaultMetadataStorage.addMetadata({
		target: target.constructor,
		field,
		type: Boolean,
		array: true
	});
};

export const AutoStringArray = <
	Class extends Record<FieldType, string[]>,
	FieldType extends string
>(
	target: Class,
	field: FieldType
) => {
	defaultMetadataStorage.addMetadata({
		target: target.constructor,
		field,
		type: String,
		array: true
	});
};

export const AutoNumberArray = <
	Class extends Record<FieldType, number[]>,
	FieldType extends string
>(
	target: Class,
	field: FieldType
) => {
	defaultMetadataStorage.addMetadata({
		target: target.constructor,
		field,
		type: Number,
		array: true
	});
};

export const AutoDateArray = <
	Class extends Record<FieldType, Date[]>,
	FieldType extends string
>(
	target: Class,
	field: FieldType
) => {
	defaultMetadataStorage.addMetadata({
		target: target.constructor,
		field,
		type: Date,
		array: true
	});
};

export const AutoEnumArray =
	<EnumType>(options: readonly EnumType[]) =>
	<Class extends Record<FieldType, EnumType[]>, FieldType extends string>(
		target: Class,
		field: FieldType
	) => {
		defaultMetadataStorage.addMetadata({
			target: target.constructor,
			field,
			type: options,
			array: true
		});
	};
