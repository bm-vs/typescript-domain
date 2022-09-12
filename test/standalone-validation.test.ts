/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
	AutoBoolean,
	AutoDate,
	AutoNumber,
	AutoString,
	Entity,
	EntityValidation,
	Model
} from '../src/index';
import {DEBUG_INFO} from '../src/validation';

describe('Standalone validation', () => {
	describe('String', () => {
		it('Should validate value into string', () => {
			const {validatedValue, debugInfo} = EntityValidation.string('value');
			expect(validatedValue).toEqual('value');
			expect(debugInfo).toEqual(null);
		});

		it('Should validate invalid value into null', () => {
			// @ts-ignore
			const {validatedValue, debugInfo} = EntityValidation.string(1);
			expect(validatedValue).toEqual(null);
			expect(debugInfo).toEqual(DEBUG_INFO.NOT_STRING);
		});

		it('Should validate undefined value into null', () => {
			// @ts-ignore
			const {validatedValue, debugInfo} = EntityValidation.string();
			expect(validatedValue).toEqual(null);
			expect(debugInfo).toEqual(DEBUG_INFO.EMPTY);
		});

		it('Should validate null value into null', () => {
			const {validatedValue, debugInfo} = EntityValidation.string(null);
			expect(validatedValue).toEqual(null);
			expect(debugInfo).toEqual(null);
		});
	});

	describe('Number', () => {
		it('Should validate value into number', () => {
			const {validatedValue, debugInfo} = EntityValidation.number(1);
			expect(validatedValue).toEqual(1);
			expect(debugInfo).toEqual(null);
		});

		it('Should validate decimal value into number', () => {
			const {validatedValue, debugInfo} = EntityValidation.number(1.6);
			expect(validatedValue).toEqual(1.6);
			expect(debugInfo).toEqual(null);
		});

		it('Should validate invalid value into null', () => {
			// @ts-ignore
			const {validatedValue, debugInfo} = EntityValidation.number('1');
			expect(validatedValue).toEqual(null);
			expect(debugInfo).toEqual(DEBUG_INFO.NOT_NUMBER);
		});

		it('Should validate undefined value into null', () => {
			// @ts-ignore
			const {validatedValue, debugInfo} = EntityValidation.number();
			expect(validatedValue).toEqual(null);
			expect(debugInfo).toEqual(DEBUG_INFO.EMPTY);
		});

		it('Should validate null value into null', () => {
			const {validatedValue, debugInfo} = EntityValidation.number(null);
			expect(validatedValue).toEqual(null);
			expect(debugInfo).toEqual(null);
		});
	});

	describe('Boolean', () => {
		it('Should validate true into boolean', () => {
			const {validatedValue, debugInfo} = EntityValidation.boolean(true);
			expect(validatedValue).toEqual(true);
			expect(debugInfo).toEqual(null);
		});

		it('Should validate false into boolean', () => {
			const {validatedValue, debugInfo} = EntityValidation.boolean(false);
			expect(validatedValue).toEqual(false);
			expect(debugInfo).toEqual(null);
		});

		it('Should validate invalid value into null', () => {
			// @ts-ignore
			const {validatedValue, debugInfo} = EntityValidation.boolean(1);
			expect(validatedValue).toEqual(null);
			expect(debugInfo).toEqual(DEBUG_INFO.NOT_BOOLEAN);
		});

		it('Should validate undefined value into null', () => {
			// @ts-ignore
			const {validatedValue, debugInfo} = EntityValidation.boolean();
			expect(validatedValue).toEqual(null);
			expect(debugInfo).toEqual(DEBUG_INFO.EMPTY);
		});

		it('Should validate null value into null', () => {
			const {validatedValue, debugInfo} = EntityValidation.boolean(null);
			expect(validatedValue).toEqual(null);
			expect(debugInfo).toEqual(null);
		});
	});

	describe('Date', () => {
		it('Should validate number into Date', () => {
			const date = new Date();
			const {validatedValue, debugInfo} = EntityValidation.date(date.getTime());
			expect(validatedValue).toEqual(date);
			expect(debugInfo).toEqual(null);
		});

		it('Should validate string into Date', () => {
			const date = new Date();
			const {validatedValue, debugInfo} = EntityValidation.date(
				date.toISOString()
			);
			expect(validatedValue).toEqual(date);
			expect(debugInfo).toEqual(null);
		});

		it('Should validate date into Date', () => {
			const date = new Date();
			const {validatedValue, debugInfo} = EntityValidation.date(date);
			expect(validatedValue).toEqual(date);
			expect(debugInfo).toEqual(null);
		});

		it('Should validate invalid value into null', () => {
			// @ts-ignore
			const {validatedValue, debugInfo} = EntityValidation.date('26-09-2022');
			expect(validatedValue).toEqual(null);
			expect(debugInfo).toEqual(DEBUG_INFO.NOT_DATE);
		});

		it('Should validate undefined value into null', () => {
			// @ts-ignore
			const {validatedValue, debugInfo} = EntityValidation.date();
			expect(validatedValue).toEqual(null);
			expect(debugInfo).toEqual(DEBUG_INFO.EMPTY);
		});

		it('Should validate null value into null', () => {
			const {validatedValue, debugInfo} = EntityValidation.date(null);
			expect(validatedValue).toEqual(null);
			expect(debugInfo).toEqual(null);
		});
	});

	describe('Enum', () => {
		const countries = ['Norway', 'Sweden', 'Denmark'] as const;
		type Country = typeof countries[number];

		it('Should validate value into enum value', () => {
			const {validatedValue, debugInfo} = EntityValidation.enum<Country>(
				'Norway',
				countries
			);
			expect(validatedValue).toEqual('Norway');
			expect(debugInfo).toEqual(null);
		});

		it('Should validate invalid value into null', () => {
			// @ts-ignore
			const {validatedValue, debugInfo} = EntityValidation.enum(
				'Portugal',
				countries
			);
			expect(validatedValue).toEqual(null);
			expect(debugInfo).toEqual(DEBUG_INFO.NOT_ENUM);
		});

		it('Should validate undefined value into null', () => {
			// @ts-ignore
			const {validatedValue, debugInfo} = EntityValidation.enum(
				undefined,
				countries
			);
			expect(validatedValue).toEqual(null);
			expect(debugInfo).toEqual(DEBUG_INFO.EMPTY);
		});

		it('Should validate null value into null', () => {
			const {validatedValue, debugInfo} = EntityValidation.enum(
				null,
				countries
			);
			expect(validatedValue).toEqual(null);
			expect(debugInfo).toEqual(null);
		});
	});

	describe('Object', () => {
		@Model
		class Address extends Entity<Address> {
			@AutoString street: string | null = null;
			@AutoNumber streetNumber: number | null = null;
			@AutoBoolean isPrimaryAddress: boolean | null = null;
			@AutoDate lastModified: Date | null = null;

			isValid(): boolean {
				return !!this.street;
			}
		}

		it('Should validate value into enum value', () => {
			const lastModified = new Date();
			const {validatedValue, debugInfo} = EntityValidation.object(Address, {
				street: 'Storgata',
				streetNumber: 1,
				isPrimaryAddress: true,
				lastModified
			});
			expect(validatedValue).toEqual(
				expect.objectContaining({
					street: 'Storgata',
					streetNumber: 1,
					isPrimaryAddress: true,
					lastModified
				})
			);
			expect(debugInfo).toEqual(null);
		});

		it('Should validate invalid value into null', () => {
			const {validatedValue, debugInfo} = EntityValidation.object(Address, {
				// @ts-ignore
				something: true
			});
			expect(validatedValue).toEqual(null);
			expect(debugInfo).toEqual(DEBUG_INFO.NOT_VALID_OBJECT);
		});

		it('Should validate undefined value into null', () => {
			// @ts-ignore
			const {validatedValue, debugInfo} = EntityValidation.object(
				Address,
				undefined
			);
			expect(validatedValue).toEqual(null);
			expect(debugInfo).toEqual(DEBUG_INFO.EMPTY);
		});

		it('Should validate null value into null', () => {
			const {validatedValue, debugInfo} = EntityValidation.object(
				Address,
				null
			);
			expect(validatedValue).toEqual(null);
			expect(debugInfo).toEqual(null);
		});
	});

	describe('Array', () => {
		it('Should validate value into array value', () => {
			const {validatedValue, debugInfo} = EntityValidation.array(
				['a', 'b', 'c', 'd'],
				String
			);
			expect(validatedValue).toEqual(['a', 'b', 'c', 'd']);
			expect(debugInfo).toEqual([]);
		});

		it('Should filter invalid values from result', () => {
			// @ts-ignore
			const {validatedValue, debugInfo} = EntityValidation.array(
				['a', 'b', 1, 'd'],
				String
			);
			expect(validatedValue).toEqual(['a', 'b', 'd']);
			expect(debugInfo).toEqual([DEBUG_INFO.NOT_STRING]);
		});

		it('Should validate invalid value into empty array', () => {
			const {validatedValue, debugInfo} = EntityValidation.array(
				// @ts-ignore
				'["a", "b"]',
				String
			);
			expect(validatedValue).toEqual([]);
			expect(debugInfo).toEqual([DEBUG_INFO.NOT_ARRAY]);
		});

		it('Should validate undefined value into empty array', () => {
			// @ts-ignore
			const {validatedValue, debugInfo} = EntityValidation.array(
				undefined,
				String
			);
			expect(validatedValue).toEqual([]);
			expect(debugInfo).toEqual([DEBUG_INFO.EMPTY]);
		});

		it('Should validate null value into empty array', () => {
			// @ts-ignore
			const {validatedValue, debugInfo} = EntityValidation.array(null, String);
			expect(validatedValue).toEqual([]);
			expect(debugInfo).toEqual([]);
		});
	});
});
