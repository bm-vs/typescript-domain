/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
	AutoBoolean,
	AutoDate,
	AutoString,
	Entity,
	Model,
	PlainData
} from '../src/index';

describe('Update', () => {
	@Model
	class Address extends Entity<Address> {
		@AutoString() street1: string | null = null;
		@AutoString() street2: string | null = null;
		streetNumber: number | null = null;
		@AutoBoolean() isPrimaryAddress: boolean | null = null;
		@AutoDate() lastModified: Date | null = null;

		constructor(data: PlainData<Address>) {
			super(data);
			this.streetNumber = data.streetNumber ?? 0;
		}
	}

	it('Should update @Auto values that are defined in the new data', () => {
		const date = new Date();
		const address = new Address({
			street1: 'Street 1',
			street2: 'Street 2',
			streetNumber: 3,
			isPrimaryAddress: true,
			lastModified: date
		});

		address.update({
			street2: 'Street 4',
			streetNumber: 6
		});

		expect(address).toEqual(
			expect.objectContaining({
				street1: 'Street 1',
				street2: 'Street 4',
				streetNumber: 3,
				isPrimaryAddress: true,
				lastModified: date
			})
		);
	});
});
