/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
	AutoBoolean,
	AutoDate,
	AutoEnum,
	AutoNumber,
	AutoObject,
	AutoString,
	Entity,
	EntityConverter,
	Model,
	PlainData
} from '../src/index';

describe('Conversion', () => {
	const countries = ['Norway', 'Sweden', 'Denmark'] as const;
	type Country = typeof countries[number];

	@Model
	class Address extends Entity<Address> {
		@AutoString street: string | null = null;
		@AutoNumber streetNumber: number | null = null;
		@AutoBoolean isPrimaryAddress: boolean | null = null;
		@AutoDate lastModified: Date | null = null;
		@AutoEnum(countries) country: Country | null = null;

		public isValid(): boolean {
			return this.street !== null;
		}
	}

	@Model
	class Order extends Entity<Order> {
		@AutoObject(Address) address: Address | null = null;
		@AutoObject(Address) clientAddress: Address | null = null;
		@AutoObject(Address) projectAddress: Address | null = null;

		public isValid(): boolean {
			return this.address !== null;
		}
	}

	it('Should return converted Entity if valid', () => {
		const data: PlainData<Order> = {
			address: {
				street: 'Street 1',
				streetNumber: 2
			},
			clientAddress: {
				streetNumber: 4
			},
			projectAddress: {
				street: 'Street 2'
			}
		};

		const dataParser = EntityConverter.object(Order);
		const order = dataParser(data);
		expect(order).toEqual(
			expect.objectContaining({
				address: {
					country: null,
					isPrimaryAddress: null,
					lastModified: null,
					street: 'Street 1',
					streetNumber: 2
				},
				clientAddress: null,
				projectAddress: {
					country: null,
					isPrimaryAddress: null,
					lastModified: null,
					street: 'Street 2',
					streetNumber: null
				}
			})
		);
	});

	it('Should return null if converted Entity is not valid', () => {
		const data: PlainData<Order> = {
			address: {
				street: null,
				streetNumber: 2
			},
			clientAddress: {
				streetNumber: 4
			},
			projectAddress: {
				street: 'Street 2'
			}
		};

		const dataParser = EntityConverter.object(Order);
		const order = dataParser(data);
		expect(order).toEqual(null);
	});

	it("Should return null if Entity doesn't match passed data", () => {
		const dataParser = EntityConverter.object(Address);
		const address = dataParser(new Address());
		expect(address).toEqual(null);
	});

	it('Should only return valid members from an array', () => {
		const data1: PlainData<Order> = {
			address: {
				street: 'Street 1',
				streetNumber: 2
			},
			clientAddress: {
				streetNumber: 4
			},
			projectAddress: {
				street: 'Street 2'
			}
		};

		const data2: PlainData<Order> = {
			address: {
				street: null,
				streetNumber: 2
			},
			clientAddress: {
				streetNumber: 4
			},
			projectAddress: {
				street: 'Street 2'
			}
		};

		const dataParser = EntityConverter.array(Order);
		const orders = dataParser([data1, data2]);
		expect(orders).toEqual([
			expect.objectContaining({
				address: {
					country: null,
					isPrimaryAddress: null,
					lastModified: null,
					street: 'Street 1',
					streetNumber: 2
				},
				clientAddress: null,
				projectAddress: {
					country: null,
					isPrimaryAddress: null,
					lastModified: null,
					street: 'Street 2',
					streetNumber: null
				}
			})
		]);
	});

	it('Should return an empty array if the data is null', () => {
		const dataParser = EntityConverter.array(Order);
		// @ts-ignore
		const order = dataParser(null);
		expect(order).toEqual([]);
	});

	it('Should return an empty array if the data is invalid', () => {
		const dataParser = EntityConverter.array(Order);
		// @ts-ignore
		const order = dataParser(new Order());
		expect(order).toEqual([]);
	});
});
