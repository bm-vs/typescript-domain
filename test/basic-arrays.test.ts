/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
	AutoBooleanArray,
	AutoDateArray,
	AutoEnumArray,
	AutoNumberArray,
	AutoStringArray,
	Entity,
	Model
} from '../src/index';

describe('Basic arrays', () => {
	const countries = ['Norway', 'Sweden', 'Denmark'] as const;
	type Country = typeof countries[number];

	@Model
	class Address extends Entity<Address> {
		@AutoStringArray streets: string[] = [];
		@AutoNumberArray streetNumbers: number[] = [];
		@AutoBooleanArray isPrimaryAddress: boolean[] = [];
		@AutoDateArray lastModified: Date[] = [];
		@AutoEnumArray(countries) countries: Country[] = [];
	}

	const validateEmpty = (address: Address) => {
		expect(address).toBeInstanceOf(Address);
		expect(address).toEqual(
			expect.objectContaining({
				streets: [],
				streetNumbers: [],
				isPrimaryAddress: [],
				lastModified: [],
				countries: []
			})
		);
	};

	it('Should create an object with default values no parameters are passed', () => {
		validateEmpty(new Address());
	});

	it('Should create an object with default values when an empty plain object is passed', () => {
		validateEmpty(new Address({}));
	});

	it('Should create an object with default values when plain object fields are null', () => {
		validateEmpty(
			new Address({
				streets: null,
				streetNumbers: null,
				isPrimaryAddress: null,
				countries: null,
				lastModified: null
			})
		);
	});

	it('Should create an object with default values when plain object fields are undefined', () => {
		validateEmpty(
			new Address({
				streets: undefined,
				streetNumbers: undefined,
				isPrimaryAddress: undefined,
				countries: undefined,
				lastModified: undefined
			})
		);
	});

	it('String array fields should become null if the plain object has an invalid type for that field', () => {
		// @ts-ignore
		expect(new Address({streets: 'Something'}).streets).toStrictEqual([]);
		// @ts-ignore
		expect(new Address({streets: 1}).streets).toStrictEqual([]);
		// @ts-ignore
		expect(new Address({streets: true}).streets).toStrictEqual([]);
		// @ts-ignore
		expect(new Address({streets: new Date()}).streets).toStrictEqual([]);
	});

	it('Number array fields should become null if the plain object has an invalid type for that field', () => {
		expect(
			// @ts-ignore
			new Address({streetNumbers: 'Something'}).streetNumbers
		).toStrictEqual([]);
		// @ts-ignore
		expect(new Address({streetNumbers: 1}).streetNumbers).toStrictEqual([]);
		// @ts-ignore
		expect(new Address({streetNumbers: true}).streetNumbers).toStrictEqual([]);
		expect(
			// @ts-ignore
			new Address({streetNumbers: new Date()}).streetNumbers
		).toStrictEqual([]);
	});

	it('Boolean array fields should become false if the plain object has an invalid type for that field', () => {
		expect(
			// @ts-ignore
			new Address({isPrimaryAddress: 'Something'}).isPrimaryAddress
		).toStrictEqual([]);
		// @ts-ignore
		expect(new Address({isPrimaryAddress: 1}).isPrimaryAddress).toStrictEqual(
			[]
		);
		expect(
			// @ts-ignore
			new Address({isPrimaryAddress: true}).isPrimaryAddress
		).toStrictEqual([]);
		expect(
			// @ts-ignore
			new Address({isPrimaryAddress: new Date()}).isPrimaryAddress
		).toStrictEqual([]);
	});

	it('Date array fields should become null if the plain object has an invalid type for that field', () => {
		// @ts-ignore
		expect(new Address({lastModified: 'Something'}).lastModified).toStrictEqual(
			[]
		);
		// @ts-ignore
		expect(new Address({lastModified: 1}).lastModified).toStrictEqual([]);
		// @ts-ignore
		expect(new Address({lastModified: true}).lastModified).toStrictEqual([]);
		// @ts-ignore
		expect(new Address({lastModified: new Date()}).lastModified).toStrictEqual(
			[]
		);
	});

	it('Enum array fields should become null if the plain object has an invalid type for that field', () => {
		// @ts-ignore
		expect(new Address({countries: 'Something'}).countries).toStrictEqual([]);
		// @ts-ignore
		expect(new Address({countries: 1}).countries).toStrictEqual([]);
		// @ts-ignore
		expect(new Address({countries: true}).countries).toStrictEqual([]);
		// @ts-ignore
		expect(new Address({countries: new Date()}).countries).toStrictEqual([]);
	});

	it('String array fields should become value from the plain object if valid', () => {
		expect(
			new Address({streets: ['', 'Street 1', 'Street 2']}).streets
		).toStrictEqual(['', 'Street 1', 'Street 2']);
	});

	it('Number array fields should become value from the plain object if valid', () => {
		expect(
			new Address({streetNumbers: [0, 10000, -1, Infinity]}).streetNumbers
		).toStrictEqual([0, 10000, -1, Infinity]);
	});

	it('Boolean array fields should become value from the plain object if valid', () => {
		expect(
			new Address({isPrimaryAddress: [true, false, true]}).isPrimaryAddress
		).toStrictEqual([true, false, true]);
	});

	it('Date array fields should become value from the plain object if valid', () => {
		const date = new Date();
		expect(
			new Address({lastModified: [date, date.toISOString(), date.getTime()]})
				.lastModified
		).toStrictEqual([date, date, date]);
	});

	it('Enum array fields should become value from the plain object if valid', () => {
		expect(
			new Address({countries: ['Denmark', 'Norway', 'Sweden']}).countries
		).toStrictEqual(['Denmark', 'Norway', 'Sweden']);
	});

	it('String array fields should only contain valid values from the plain object', () => {
		expect(
			// @ts-ignore
			new Address({streets: ['Street 1', 1, true, new Date()]}).streets
		).toStrictEqual(['Street 1']);
	});

	it('Number array fields should only contain valid values from the plain object', () => {
		expect(
			// @ts-ignore
			new Address({streetNumbers: ['Street 1', 1, true, new Date()]})
				.streetNumbers
		).toStrictEqual([1]);
	});

	it('Boolean array fields should only contain valid values from the plain object', () => {
		expect(
			// @ts-ignore
			new Address({isPrimaryAddress: ['Street 1', 1, true, new Date()]})
				.isPrimaryAddress
		).toStrictEqual([true]);
	});

	it('Date array fields should only contain valid values from the plain object', () => {
		const date = new Date();
		expect(
			new Address({lastModified: ['Something', Infinity, false, date]})
				.lastModified
		).toStrictEqual([date]);
	});

	it('Enum array fields should become value from the plain object if valid', () => {
		expect(
			new Address({
				// @ts-ignore
				countries: ['Denmark', 'Street 1', 1, true, 'Sweden', new Date()]
			}).countries
		).toStrictEqual(['Denmark', 'Sweden']);
	});
});
