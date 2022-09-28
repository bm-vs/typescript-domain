/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
	AutoBoolean,
	AutoDate,
	AutoEnum,
	AutoNumber,
	AutoObject,
	AutoString,
	AutoStringArray,
	Entity,
	Model
} from '../src/index';
import {DebugOutput} from '../src/types';

describe('Debug info', () => {
	describe('String', () => {
		@Model
		class Address extends Entity<Address> {
			@AutoString() streetName: string | null = null;
		}

		it('Should output information about fields that are undefined', () => {
			const debugOutput: DebugOutput[] = [];
			new Address({}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([
				{
					class: 'Address',
					field: 'streetName',
					value: undefined,
					info: 'value is undefined'
				}
			]);
		});

		it('Should output information about fields that are the wrong type', () => {
			const debugOutput: DebugOutput[] = [];
			// @ts-ignore
			new Address({streetName: 1}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([
				{
					class: 'Address',
					field: 'streetName',
					value: '1',
					info: 'value is not a string'
				}
			]);
		});

		it('Should output no information about fields that are null', () => {
			const debugOutput: DebugOutput[] = [];
			new Address({streetName: null}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([]);
		});

		it('Should output no information when skipping undefined values', () => {
			const debugOutput: DebugOutput[] = [];
			new Address(
				{},
				(output) => {
					debugOutput.push(output);
				},
				true
			);

			expect(debugOutput).toEqual([]);
		});
	});

	describe('Number', () => {
		@Model
		class Address extends Entity<Address> {
			@AutoNumber() streetNumber: number | null = null;
		}

		it('Should output information about fields that are undefined', () => {
			const debugOutput: DebugOutput[] = [];
			new Address({}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([
				{
					class: 'Address',
					field: 'streetNumber',
					value: undefined,
					info: 'value is undefined'
				}
			]);
		});

		it('Should output information about fields that are the wrong type', () => {
			const debugOutput: DebugOutput[] = [];
			// @ts-ignore
			new Address({streetNumber: '1'}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([
				{
					class: 'Address',
					field: 'streetNumber',
					value: '"1"',
					info: 'value is not a number'
				}
			]);
		});

		it('Should output no information about fields that are null', () => {
			const debugOutput: DebugOutput[] = [];
			new Address({streetNumber: null}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([]);
		});

		it('Should output no information when skipping undefined values', () => {
			const debugOutput: DebugOutput[] = [];
			new Address(
				{},
				(output) => {
					debugOutput.push(output);
				},
				true
			);

			expect(debugOutput).toEqual([]);
		});
	});

	describe('Boolean', () => {
		@Model
		class Address extends Entity<Address> {
			@AutoBoolean() isMainAddress: boolean | null = null;
		}

		it('Should output information about fields that are undefined', () => {
			const debugOutput: DebugOutput[] = [];
			new Address({}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([
				{
					class: 'Address',
					field: 'isMainAddress',
					value: undefined,
					info: 'value is undefined'
				}
			]);
		});

		it('Should output information about fields that are the wrong type', () => {
			const debugOutput: DebugOutput[] = [];
			// @ts-ignore
			new Address({isMainAddress: 'true'}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([
				{
					class: 'Address',
					field: 'isMainAddress',
					value: '"true"',
					info: 'value is not a boolean'
				}
			]);
		});

		it('Should output no information about fields that are null', () => {
			const debugOutput: DebugOutput[] = [];
			new Address({isMainAddress: null}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([]);
		});

		it('Should output no information when skipping undefined values', () => {
			const debugOutput: DebugOutput[] = [];
			new Address(
				{},
				(output) => {
					debugOutput.push(output);
				},
				true
			);

			expect(debugOutput).toEqual([]);
		});
	});

	describe('Date', () => {
		@Model
		class Address extends Entity<Address> {
			@AutoDate() moveInDate: Date | null = null;
		}

		it('Should output information about fields that are undefined', () => {
			const debugOutput: DebugOutput[] = [];
			new Address({}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([
				{
					class: 'Address',
					field: 'moveInDate',
					value: undefined,
					info: 'value is undefined'
				}
			]);
		});

		it('Should output information about fields that are the wrong type, invalid date format', () => {
			const debugOutput: DebugOutput[] = [];
			// @ts-ignore
			new Address({moveInDate: '15-06-09'}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([
				{
					class: 'Address',
					field: 'moveInDate',
					value: '"15-06-09"',
					info: 'value cannot be parsed to Date'
				}
			]);
		});

		it('Should output information about fields that are the wrong type, boolean', () => {
			const debugOutput: DebugOutput[] = [];
			// @ts-ignore
			new Address({moveInDate: true}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([
				{
					class: 'Address',
					field: 'moveInDate',
					value: 'true',
					info: 'value cannot be parsed to Date'
				}
			]);
		});

		it('Should output no information about fields that are null', () => {
			const debugOutput: DebugOutput[] = [];
			new Address({moveInDate: null}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([]);
		});

		it('Should output no information when skipping undefined values', () => {
			const debugOutput: DebugOutput[] = [];
			new Address(
				{},
				(output) => {
					debugOutput.push(output);
				},
				true
			);

			expect(debugOutput).toEqual([]);
		});
	});

	describe('Enum', () => {
		const countries = ['Norway', 'Sweden', 'Denmark'] as const;
		type Country = typeof countries[number];
		@Model
		class Address extends Entity<Address> {
			@AutoEnum(countries) country: Country | null = null;
		}

		it('Should output information about fields that are undefined', () => {
			const debugOutput: DebugOutput[] = [];
			new Address({}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([
				{
					class: 'Address',
					field: 'country',
					value: undefined,
					info: 'value is undefined'
				}
			]);
		});

		it('Should output information about fields that are the wrong type', () => {
			const debugOutput: DebugOutput[] = [];
			// @ts-ignore
			new Address({country: 'Portugal'}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([
				{
					class: 'Address',
					field: 'country',
					value: '"Portugal"',
					info: 'value is not option of the enum'
				}
			]);
		});

		it('Should output no information about fields that are null', () => {
			const debugOutput: DebugOutput[] = [];
			new Address({country: null}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([]);
		});

		it('Should output no information when skipping undefined values', () => {
			const debugOutput: DebugOutput[] = [];
			new Address(
				{},
				(output) => {
					debugOutput.push(output);
				},
				true
			);

			expect(debugOutput).toEqual([]);
		});
	});

	describe('Object', () => {
		@Model
		class Address extends Entity<Address> {
			@AutoString() streetName: string | null = null;

			isValid(): boolean {
				return this.streetName !== null;
			}
		}

		@Model
		class Order extends Entity<Order> {
			@AutoObject(Address) address: Address | null = null;
		}

		it('Should output information about fields that are undefined', () => {
			const debugOutput: DebugOutput[] = [];
			new Order({}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([
				{
					class: 'Order',
					field: 'address',
					value: undefined,
					info: 'value is undefined'
				}
			]);
		});

		it('Should output information about fields that are the wrong type', () => {
			const debugOutput: DebugOutput[] = [];
			new Order(
				// @ts-ignore
				{address: 'Storgata 1'},
				(output) => {
					debugOutput.push(output);
				},
				true
			);

			expect(debugOutput).toEqual([
				{
					class: 'Order',
					field: 'address',
					value: '"Storgata 1"',
					info: 'object created from input is not valid'
				}
			]);
		});

		it('Should output no information about fields that are null', () => {
			const debugOutput: DebugOutput[] = [];
			new Order({address: null}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([]);
		});

		it('Should output no information when skipping undefined values', () => {
			const debugOutput: DebugOutput[] = [];
			new Order(
				{},
				(output) => {
					debugOutput.push(output);
				},
				true
			);

			expect(debugOutput).toEqual([]);
		});
	});

	describe('Array', () => {
		@Model
		class Address extends Entity<Address> {
			@AutoStringArray() streetName: string[] = [];
		}

		it('Should output information about fields that are undefined', () => {
			const debugOutput: DebugOutput[] = [];
			new Address({}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([
				{
					class: 'Address',
					field: 'streetName',
					value: undefined,
					info: 'value is undefined'
				}
			]);
		});

		it('Should output information about fields that are the wrong type', () => {
			const debugOutput: DebugOutput[] = [];
			new Address(
				// @ts-ignore
				{streetName: 'Storgata 1'},
				(output) => {
					debugOutput.push(output);
				},
				true
			);

			expect(debugOutput).toEqual([
				{
					class: 'Address',
					field: 'streetName',
					value: '"Storgata 1"',
					info: 'value is not array'
				}
			]);
		});

		it('Should output information about fields items that are the wrong type', () => {
			const debugOutput: DebugOutput[] = [];
			new Address(
				// @ts-ignore
				{streetName: ['Storgata 1', true, 1]},
				(output) => {
					debugOutput.push(output);
				},
				true
			);

			expect(debugOutput).toEqual([
				{
					class: 'Address',
					field: 'streetName',
					value: '["Storgata 1",true,1]',
					info: 'value is not a string,value is not a string'
				}
			]);
		});

		it('Should output no information about fields that are null', () => {
			const debugOutput: DebugOutput[] = [];
			new Address({streetName: null}, (output) => {
				debugOutput.push(output);
			});

			expect(debugOutput).toEqual([]);
		});

		it('Should output no information when skipping undefined values', () => {
			const debugOutput: DebugOutput[] = [];
			new Address(
				{},
				(output) => {
					debugOutput.push(output);
				},
				true
			);

			expect(debugOutput).toEqual([]);
		});
	});
});
