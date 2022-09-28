import type {Entity} from './entity';
import type {DebugFunction} from './types';

export function array<T, Input, Output extends Entity<T>>(
	Type: new (
		data: Input,
		debugFunction?: DebugFunction,
		debugSkipUndef?: boolean
	) => Output,
	debugFunction?: DebugFunction,
	debugSkipUndef?: boolean
): (data: Input[]) => Output[] {
	return (data) =>
		Array.isArray(data)
			? data
					.map((element) => new Type(element, debugFunction, debugSkipUndef))
					.filter((element) => element.isValid())
			: [];
}

export function object<T, Input, Output extends Entity<T>>(
	Type: new (
		data: Input,
		debugFunction?: DebugFunction,
		debugSkipUndef?: boolean
	) => Output,
	debugFunction?: DebugFunction,
	debugSkipUndef?: boolean
): (data: Input) => Output | null {
	return (data: Input) => {
		const parsedResponse = new Type(data, debugFunction, debugSkipUndef);
		return parsedResponse.isValid() ? parsedResponse : null;
	};
}
