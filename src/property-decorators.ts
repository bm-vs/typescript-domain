import {defaultMetadataStorage} from './metadata-storage';
import {Constructor} from './types';

type ObjectClassKeys<Class, FieldType> = {
	[Key in keyof Class]-?: FieldType extends Class[Key] ? Key : never;
}[keyof Class];

export const AutoObject =
	<FieldType>(type: Constructor<FieldType>, alias?: string) =>
	// eslint-disable-next-line @typescript-eslint/ban-types
	<Class extends Object>(
		target: Class,
		field: ObjectClassKeys<Class, FieldType>
	) => {
		defaultMetadataStorage.addMetadata({
			target: target.constructor,
			field: field as string,
			type,
			alias
		});
	};

export const AutoBoolean =
	(alias?: string) =>
	<Class extends Record<FieldType, boolean | null>, FieldType extends string>(
		target: Class,
		field: FieldType
	) => {
		defaultMetadataStorage.addMetadata({
			target: target.constructor,
			field,
			type: Boolean,
			alias
		});
	};

export const AutoString =
	(alias?: string) =>
	<Class extends Record<FieldType, string | null>, FieldType extends string>(
		target: Class,
		field: FieldType
	) => {
		defaultMetadataStorage.addMetadata({
			target: target.constructor,
			field,
			type: String,
			alias
		});
	};

export const AutoNumber =
	(alias?: string) =>
	<Class extends Record<FieldType, number | null>, FieldType extends string>(
		target: Class,
		field: FieldType
	) => {
		defaultMetadataStorage.addMetadata({
			target: target.constructor,
			field,
			type: Number,
			alias
		});
	};

export const AutoDate =
	(alias?: string) =>
	<Class extends Record<FieldType, Date | null>, FieldType extends string>(
		target: Class,
		field: FieldType
	) => {
		defaultMetadataStorage.addMetadata({
			target: target.constructor,
			field,
			type: Date,
			alias
		});
	};

export const AutoEnum =
	<EnumType>(options: readonly EnumType[], alias?: string) =>
	<Class extends Record<FieldType, EnumType | null>, FieldType extends string>(
		target: Class,
		field: FieldType
	) => {
		defaultMetadataStorage.addMetadata({
			target: target.constructor,
			field,
			type: options,
			alias
		});
	};

export const AutoObjectArray =
	<FieldType>(type: Constructor<FieldType>, alias?: string) =>
	// eslint-disable-next-line @typescript-eslint/ban-types
	<Class extends Object>(
		target: Class,
		field: ObjectClassKeys<Class, FieldType[]>
	) => {
		defaultMetadataStorage.addMetadata({
			target: target.constructor,
			field: field as string,
			type,
			array: true,
			alias
		});
	};

export const AutoBooleanArray =
	(alias?: string) =>
	<Class extends Record<FieldType, boolean[]>, FieldType extends string>(
		target: Class,
		field: FieldType
	) => {
		defaultMetadataStorage.addMetadata({
			target: target.constructor,
			field,
			type: Boolean,
			array: true,
			alias
		});
	};

export const AutoStringArray =
	(alias?: string) =>
	<Class extends Record<FieldType, string[]>, FieldType extends string>(
		target: Class,
		field: FieldType
	) => {
		defaultMetadataStorage.addMetadata({
			target: target.constructor,
			field,
			type: String,
			array: true,
			alias
		});
	};

export const AutoNumberArray =
	(alias?: string) =>
	<Class extends Record<FieldType, number[]>, FieldType extends string>(
		target: Class,
		field: FieldType
	) => {
		defaultMetadataStorage.addMetadata({
			target: target.constructor,
			field,
			type: Number,
			array: true,
			alias
		});
	};

export const AutoDateArray =
	(alias?: string) =>
	<Class extends Record<FieldType, Date[]>, FieldType extends string>(
		target: Class,
		field: FieldType
	) => {
		defaultMetadataStorage.addMetadata({
			target: target.constructor,
			field,
			type: Date,
			array: true,
			alias
		});
	};

export const AutoEnumArray =
	<EnumType>(options: readonly EnumType[], alias?: string) =>
	<Class extends Record<FieldType, EnumType[]>, FieldType extends string>(
		target: Class,
		field: FieldType
	) => {
		defaultMetadataStorage.addMetadata({
			target: target.constructor,
			field,
			type: options,
			array: true,
			alias
		});
	};
