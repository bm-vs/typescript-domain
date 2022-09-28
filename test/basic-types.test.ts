/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
	AutoBoolean,
	AutoDate,
	AutoEnum,
	AutoNumber,
	AutoString,
	Entity,
	Model
} from '../src/index';

describe('Basic types', () => {
	const countries = ['Norway', 'Sweden', 'Denmark'] as const;
	type Country = typeof countries[number];

	@Model
	class Address extends Entity<Address> {
		@AutoString() street: string | null = null;
		@AutoNumber() streetNumber: number | null = null;
		@AutoBoolean() isPrimaryAddress: boolean | null = null;
		@AutoDate() lastModified: Date | null = null;
		@AutoEnum(countries) country: Country | null = null;
	}

	const validateEmpty = (address: Address) => {
		expect(address).toBeInstanceOf(Address);
		expect(address).toEqual(
			expect.objectContaining({
				street: null,
				streetNumber: null,
				isPrimaryAddress: null,
				lastModified: null,
				country: null
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
				street: null,
				streetNumber: null,
				isPrimaryAddress: null,
				country: null,
				lastModified: null
			})
		);
	});

	it('Should create an object with default values when plain object fields are undefined', () => {
		validateEmpty(
			new Address({
				street: undefined,
				streetNumber: undefined,
				isPrimaryAddress: undefined,
				country: undefined,
				lastModified: undefined
			})
		);
	});

	it('String fields should become null if the plain object has an invalid type for that field', () => {
		// @ts-ignore
		expect(new Address({street: 1}).street).toStrictEqual(null);
		// @ts-ignore
		expect(new Address({street: true}).street).toStrictEqual(null);
		// @ts-ignore
		expect(new Address({street: new Date()}).street).toStrictEqual(null);
	});

	it('Number fields should become null if the plain object has an invalid type for that field', () => {
		// @ts-ignore
		expect(new Address({streetNumber: 'Something'}).streetNumber).toStrictEqual(
			null
		);
		// @ts-ignore
		expect(new Address({streetNumber: true}).streetNumber).toStrictEqual(null);
		// @ts-ignore
		expect(new Address({streetNumber: new Date()}).streetNumber).toStrictEqual(
			null
		);
	});

	it('Boolean fields should become null if the plain object has an invalid type for that field', () => {
		expect(
			// @ts-ignore
			new Address({isPrimaryAddress: 'Something'}).isPrimaryAddress
		).toStrictEqual(null);
		// @ts-ignore
		expect(new Address({isPrimaryAddress: 0}).isPrimaryAddress).toStrictEqual(
			null
		);
		expect(
			// @ts-ignore
			new Address({isPrimaryAddress: new Date()}).isPrimaryAddress
		).toStrictEqual(null);
	});

	it('Date fields should become null if the plain object has an invalid type for that field', () => {
		// @ts-ignore
		expect(new Address({lastModified: 'Something'}).lastModified).toStrictEqual(
			null
		);
		// @ts-ignore
		expect(new Address({lastModified: Infinity}).lastModified).toStrictEqual(
			null
		);
		// @ts-ignore
		expect(new Address({lastModified: false}).lastModified).toStrictEqual(null);
	});

	it('Enum fields should become null if the plain object has an invalid type for that field', () => {
		// @ts-ignore
		expect(new Address({country: 'Something'}).country).toStrictEqual(null);
		// @ts-ignore
		expect(new Address({country: -1}).country).toStrictEqual(null);
		// @ts-ignore
		expect(new Address({country: false}).country).toStrictEqual(null);
		// @ts-ignore
		expect(new Address({country: new Date()}).country).toStrictEqual(null);
	});

	it('String fields should become value from the plain object if valid', () => {
		expect(new Address({street: ''}).street).toStrictEqual('');
		expect(new Address({street: 'Street 1'}).street).toStrictEqual('Street 1');
	});

	it('Number fields should become value from the plain object if valid', () => {
		expect(new Address({streetNumber: 0}).streetNumber).toStrictEqual(0);
		expect(new Address({streetNumber: 10000}).streetNumber).toStrictEqual(
			10000
		);
		expect(new Address({streetNumber: -1}).streetNumber).toStrictEqual(-1);
		expect(new Address({streetNumber: Infinity}).streetNumber).toStrictEqual(
			Infinity
		);
	});

	it('Boolean fields should become value from the plain object if valid', () => {
		expect(
			new Address({isPrimaryAddress: true}).isPrimaryAddress
		).toStrictEqual(true);
		expect(
			new Address({isPrimaryAddress: false}).isPrimaryAddress
		).toStrictEqual(false);
	});

	it('Date fields should become value from the plain object if valid', () => {
		const date = new Date();
		expect(new Address({lastModified: date}).lastModified).toStrictEqual(date);
		expect(
			new Address({lastModified: date.toISOString()}).lastModified
		).toStrictEqual(date);
		expect(
			new Address({lastModified: date.getTime()}).lastModified
		).toStrictEqual(date);
	});

	it('Enum fields should become value from the plain object if valid', () => {
		expect(new Address({country: 'Denmark'}).country).toStrictEqual('Denmark');
		expect(new Address({country: 'Norway'}).country).toStrictEqual('Norway');
		expect(new Address({country: 'Sweden'}).country).toStrictEqual('Sweden');
	});
});
