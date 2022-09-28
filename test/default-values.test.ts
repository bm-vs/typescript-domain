import {
	AutoNumber,
	AutoString,
	Entity,
	EntityValidation,
	Model,
	PlainData
} from '../src/index';

describe('Default values', () => {
	@Model
	class Address extends Entity<Address> {
		@AutoString() street: string | null = null;
		@AutoString() street2: string | null = '123';
		@AutoNumber() streetNumber: number | null = null;
		streetNumber2: number | null;

		constructor(data?: PlainData<Address>) {
			super(data);
			this.streetNumber2 =
				typeof data?.streetNumber === 'number'
					? data.streetNumber * 1000
					: null;
		}
	}

	@Model
	class Dimensions extends Entity<Dimensions> {
		@AutoNumber() height: number | null = null;
		@AutoNumber() length: number | null = null;
		@AutoNumber() width: number | null = null;
		volume: number | null;

		constructor(data?: PlainData<Dimensions>) {
			super(data);
			this.volume =
				EntityValidation.number(data?.volume).validatedValue ??
				(this.height ?? 0) * (this.length ?? 0) * (this.width ?? 0);
		}
	}

	@Model
	class Prices extends Entity<Prices> {
		@AutoNumber() salesPrice = 100;
	}

	it('Should create an object with default values no parameters are passed', () => {
		const address = new Address();
		expect(address).toEqual({
			street: null,
			street2: '123',
			streetNumber: null,
			streetNumber2: null
		});
	});

	it('Should create an object with default values when an empty plain object is passed', () => {
		const address = new Address({});
		expect(address).toEqual({
			street: null,
			street2: '123',
			streetNumber: null,
			streetNumber2: null
		});
	});

	it('Should override default values when plain object has properties defined and valid', () => {
		const address = new Address({
			street: 'Street 1',
			street2: 'Street 2',
			streetNumber: 4
		});
		expect(address).toEqual({
			street: 'Street 1',
			street2: 'Street 2',
			streetNumber: 4,
			streetNumber2: 4000
		});
	});

	it('Should not automatically populate fields not marked with the @Auto decorator', () => {
		const address = new Address({
			street: 'Street 1',
			street2: 'Street 2',
			streetNumber2: 4
		});
		expect(address).toEqual({
			street: 'Street 1',
			street2: 'Street 2',
			streetNumber: null,
			streetNumber2: null
		});
	});

	it('Should explicitly populate fields not marked with the @Auto decorator', () => {
		const dimensions = new Dimensions({
			volume: 4
		});
		expect(dimensions).toEqual({
			height: null,
			length: null,
			width: null,
			volume: 4
		});
	});

	it('Should not use own properties to derive others (use constructor arguments instead)', () => {
		const address = new Dimensions({
			height: 1,
			length: 2,
			width: 6
		});
		expect(address).toEqual({
			height: 1,
			length: 2,
			width: 6,
			volume: 0
		});
	});

	it('Should have default values', () => {
		const prices = new Prices();
		expect(prices).toEqual({
			salesPrice: 100
		});
	});
});
