import type {Entity} from './entity';
import type {BasicTypes, Constructor, DebugFunction} from './types';

export enum DEBUG_INFO {
	EMPTY = 'value is undefined',
	NOT_ARRAY = 'value is not array',
	NOT_BOOLEAN = 'value is not a boolean',
	NOT_DATE = 'value cannot be parsed to Date',
	NOT_ENUM = 'value is not option of the enum',
	NOT_NUMBER = 'value is not a number',
	NOT_STRING = 'value is not a string',
	NOT_VALID_OBJECT = 'object created from input is not valid'
}

export const validateValue = (
	value: unknown | null | undefined,
	// eslint-disable-next-line @typescript-eslint/ban-types
	type: BasicTypes | Object,
	array?: boolean,
	debugFunction?: DebugFunction,
	debugSkipUndef?: boolean
): {validatedValue: unknown; debugInfo: string | null} => {
	if (array) {
		const {validatedValue, debugInfo} = EntityValidation.array(
			value as unknown[],
			type,
			debugFunction,
			debugSkipUndef
		);
		return {validatedValue, debugInfo: debugInfo.join(',')};
	}

	const empty = validateEmpty(value);
	if (empty) {
		return empty;
	}

	switch (type) {
		case Boolean:
			return EntityValidation.boolean(value as boolean);
		case Date:
			return EntityValidation.date(value as Date);
		case Number:
			return EntityValidation.number(value as number);
		case String:
			return EntityValidation.string(value as string);
		default:
			return Array.isArray(type)
				? EntityValidation.enum(value, type)
				: EntityValidation.object(
						type as Constructor,
						value,
						debugFunction,
						debugSkipUndef
				  );
	}
};

const validateEmpty = (
	value: unknown | null | undefined
): {validatedValue: null; debugInfo: DEBUG_INFO | null} | null => {
	if (value === undefined) {
		return {
			validatedValue: null,
			debugInfo: DEBUG_INFO.EMPTY
		};
	}
	if (value === null) {
		return {
			validatedValue: null,
			debugInfo: null
		};
	}

	return null;
};

export class EntityValidation {
	public static array<Input>(
		data: (Input | null)[] | undefined,
		// eslint-disable-next-line @typescript-eslint/ban-types
		type: BasicTypes | Object,
		debugFunction?: DebugFunction,
		debugSkipUndef?: boolean
	): {validatedValue: Input[]; debugInfo: DEBUG_INFO[]} {
		if (data === undefined) {
			return {
				validatedValue: [],
				debugInfo: [DEBUG_INFO.EMPTY]
			};
		}

		if (data === null) {
			return {
				validatedValue: [],
				debugInfo: []
			};
		}

		if (!Array.isArray(data)) {
			return {
				validatedValue: [],
				debugInfo: [DEBUG_INFO.NOT_ARRAY]
			};
		}

		const validatedValue: Input[] = [];
		const debugInfo: DEBUG_INFO[] = [];
		for (const child of data) {
			const childValue = validateValue(
				child,
				type,
				Array.isArray(child),
				debugFunction,
				debugSkipUndef
			);
			if (childValue.validatedValue !== null) {
				validatedValue.push(childValue.validatedValue as Input);
			}
			if (childValue.debugInfo !== null) {
				debugInfo.push(childValue.debugInfo as DEBUG_INFO);
			}
		}

		return {validatedValue, debugInfo};
	}

	public static boolean(value: boolean | null | undefined): {
		validatedValue: boolean | null;
		debugInfo: DEBUG_INFO | null;
	} {
		const empty = validateEmpty(value);
		if (empty) {
			return empty;
		}
		if (typeof value === 'boolean') {
			return {
				validatedValue: value,
				debugInfo: null
			};
		}

		return {
			validatedValue: null,
			debugInfo: DEBUG_INFO.NOT_BOOLEAN
		};
	}

	public static date(value: Date | number | string | null | undefined): {
		validatedValue: Date | null;
		debugInfo: DEBUG_INFO | null;
	} {
		const empty = validateEmpty(value);
		if (empty) {
			return empty;
		}
		if (
			typeof value !== 'string' &&
			typeof value !== 'number' &&
			!(value instanceof Date)
		) {
			return {
				validatedValue: null,
				debugInfo: DEBUG_INFO.NOT_DATE
			};
		}

		const date = new Date(value);
		if (isNaN(date.getTime())) {
			return {
				validatedValue: null,
				debugInfo: DEBUG_INFO.NOT_DATE
			};
		}

		return {
			validatedValue: date,
			debugInfo: null
		};
	}

	public static enum<Type>(
		value: Type | null | undefined,
		options: readonly Type[]
	): {validatedValue: Type | null; debugInfo: DEBUG_INFO | null} {
		const empty = validateEmpty(value);
		if (empty) {
			return empty;
		}
		if (value && options.includes(value as Type)) {
			return {
				validatedValue: value,
				debugInfo: null
			};
		}

		return {
			validatedValue: null,
			debugInfo: DEBUG_INFO.NOT_ENUM
		};
	}

	public static number(value: number | null | undefined): {
		validatedValue: number | null;
		debugInfo: DEBUG_INFO | null;
	} {
		const empty = validateEmpty(value);
		if (empty) {
			return empty;
		}
		if (typeof value === 'number') {
			return {
				validatedValue: value,
				debugInfo: null
			};
		}

		return {
			validatedValue: null,
			debugInfo: DEBUG_INFO.NOT_NUMBER
		};
	}

	public static object<Output extends Entity<T>, Input, T>(
		Type: new (
			data?: Input | null,
			debugFunction?: DebugFunction,
			debugSkipUndef?: boolean
		) => Output,
		data: Input | null | undefined,
		debugFunction?: DebugFunction,
		debugSkipUndef?: boolean
	): {validatedValue: Output | null; debugInfo: DEBUG_INFO | null} {
		const empty = validateEmpty(data);
		if (empty) {
			return empty;
		}
		const object = new Type(data, debugFunction, debugSkipUndef);
		if (object.isValid()) {
			return {
				validatedValue: object,
				debugInfo: null
			};
		}

		return {
			validatedValue: null,
			debugInfo: DEBUG_INFO.NOT_VALID_OBJECT
		};
	}

	public static string(value: string | null | undefined): {
		validatedValue: string | null;
		debugInfo: DEBUG_INFO | null;
	} {
		const empty = validateEmpty(value);
		if (empty) {
			return empty;
		}

		if (typeof value === 'string') {
			return {
				validatedValue: value,
				debugInfo: null
			};
		}

		return {
			validatedValue: null,
			debugInfo: DEBUG_INFO.NOT_STRING
		};
	}
}
