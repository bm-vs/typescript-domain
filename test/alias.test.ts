/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
	AutoBoolean,
	AutoBooleanArray,
	AutoDate,
	AutoDateArray,
	AutoEnum,
	AutoEnumArray,
	AutoNumber,
	AutoNumberArray,
	AutoObject,
	AutoObjectArray,
	AutoString,
	AutoStringArray,
	Entity,
	Model
} from '../src/index';

describe('Alias', () => {
	it('Should initialize fields using the values from the aliases', () => {
		const countries = ['Norway', 'Sweden', 'Denmark'] as const;
		type Country = typeof countries[number];

		@Model
		class Resident extends Entity<Resident> {
			@AutoString('resident_name') name: string | null = null;
		}

		@Model
		class Address extends Entity<Address> {
			@AutoString('address_street_name') street: string | null = null;
			@AutoNumber('address_street_number') streetNumber: number | null = null;
			@AutoBoolean('address_is_primary_address') isPrimaryAddress:
				| boolean
				| null = null;
			@AutoDate('address_last_modified') lastModified: Date | null = null;
			@AutoEnum(countries, 'address_country') country: Country | null = null;
			@AutoObject(Resident, 'address_resident') resident: Resident | null =
				null;
		}

		const date = new Date();
		const data = {
			address_street_name: 'Street',
			address_street_number: 4,
			address_is_primary_address: true,
			address_last_modified: date,
			address_country: 'Norway',
			address_resident: {
				resident_name: 'Me'
			}
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const address = new Address(data as any);
		expect(address).toEqual(
			expect.objectContaining({
				street: 'Street',
				streetNumber: 4,
				isPrimaryAddress: true,
				lastModified: date,
				country: 'Norway',
				resident: expect.objectContaining({
					name: 'Me'
				})
			})
		);
	});

	it('Should initialize array fields using the values from the aliases', () => {
		const countries = ['Norway', 'Sweden', 'Denmark'] as const;
		type Country = typeof countries[number];

		@Model
		class Resident extends Entity<Resident> {
			@AutoStringArray('resident_name') name: string[] = [];
		}

		@Model
		class Address extends Entity<Address> {
			@AutoStringArray('address_street_name') street: string[] = [];
			@AutoNumberArray('address_street_number') streetNumber: number[] = [];
			@AutoBooleanArray('address_is_primary_address')
			isPrimaryAddress: boolean[] = [];
			@AutoDateArray('address_last_modified') lastModified: Date[] = [];
			@AutoEnumArray(countries, 'address_country') country: Country[] = [];
			@AutoObjectArray(Resident, 'address_resident') resident: Resident[] = [];
		}

		const date = new Date();
		const data = {
			address_street_name: ['Street 1', 'Street 2', 2],
			address_street_number: [4, '6', 8],
			address_is_primary_address: [true, 1, false],
			address_last_modified: [date, date.getTime(), date.toISOString()],
			address_country: ['Norway', 'Portugal'],
			address_resident: [
				{
					resident_name: ['Me']
				},
				{
					resident_name: ['You']
				},
				{
					resident_name: 3
				},
				{
					resident_name: 'Someone else'
				},
				'Something else'
			]
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const address = new Address(data as any);
		expect(address).toEqual(
			expect.objectContaining({
				street: ['Street 1', 'Street 2'],
				streetNumber: [4, 8],
				isPrimaryAddress: [true, false],
				lastModified: [date, date, date],
				country: ['Norway'],
				resident: [
					expect.objectContaining({
						name: ['Me']
					}),
					expect.objectContaining({
						name: ['You']
					}),
					expect.objectContaining({
						name: []
					}),
					expect.objectContaining({
						name: []
					}),
					expect.objectContaining({
						name: []
					})
				]
			})
		);
	});

	it("Should initialize field using field with same name if alias doesn't exist", () => {
		@Model
		class Address extends Entity<Address> {
			@AutoString('address_street_name') street: string | null = null;
		}

		const address = new Address({
			street: 'Street 1'
		});
		expect(address).toEqual(
			expect.objectContaining({
				street: 'Street 1'
			})
		);
	});

	it('Should prioritize alias over field with same name', () => {
		@Model
		class Address extends Entity<Address> {
			@AutoString('address_street_name') street: string | null = null;
		}

		const address = new Address({
			street: 'Street 1',
			address_street_name: 'Street 2'
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);
		expect(address).toEqual(
			expect.objectContaining({
				street: 'Street 2'
			})
		);
	});

	it('Should prioritize alias over field with same name, even when value for alias is invalid', () => {
		@Model
		class Address extends Entity<Address> {
			@AutoString('address_street_name') street: string | null = null;
		}

		const address = new Address({
			street: 'Street 1',
			address_street_name: 2
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);
		expect(address).toEqual(
			expect.objectContaining({
				street: null
			})
		);
	});
});
