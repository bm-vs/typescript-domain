// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = any> = new (...args: any[]) => T;
export type Indexable = {[key: string]: unknown};
export type PlainData<T> = {
	[P in keyof T]?: T[P] extends Array<infer U>
		? Array<PlainData<U>> | null | undefined
		: T[P] extends ReadonlyArray<infer U>
		? ReadonlyArray<PlainData<U>> | null | undefined
		: PlainData<T[P]> | null | undefined;
};
export type EnumOptions = unknown[];
export type BasicTypes =
	| BooleanConstructor
	| DateConstructor
	| NumberConstructor
	| StringConstructor
	| EnumOptions;
export type DebugOutput = {
	class: string;
	field: string;
	value: string;
	info: string;
};
export type DebugFunction = (output: DebugOutput) => void;
