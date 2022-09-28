import {
	AutoBooleanArray,
	AutoDateArray,
	AutoEnumArray,
	AutoNumberArray,
	AutoStringArray,
	Entity,
	Model
} from '../src/index';

describe('Entity', () => {
	const countries = ['Norway', 'Sweden', 'Denmark'] as const;
	type Country = typeof countries[number];

	@Model
	class Address {
		@AutoStringArray() streets: string[] = [];
		@AutoNumberArray() streetNumbers: number[] = [];
		@AutoBooleanArray() isPrimaryAddress: boolean[] = [];
		@AutoDateArray() lastModified: Date[] = [];
		@AutoEnumArray(countries) countries: Country[] = [];
	}

	@Model
	class Dimensions extends Entity<Dimensions> {
		height: number | null = null;
		length: number | null = null;
		width: number | null = null;
	}

	it('Should throw error when annotated with @Model and not extends Entity', () => {
		expect(() => new Address()).toThrow(TypeError);
	});

	it('Should not initialize any fields if none are annotated with @Auto', () => {
		expect(new Dimensions()).toEqual({
			height: null,
			length: null,
			width: null
		});
	});
});
