/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
	AutoDate,
	AutoObject,
	AutoObjectArray,
	AutoBoolean,
	AutoEnum,
	AutoNumber,
	AutoString,
	Entity,
	Model
} from '../src/index';
import {DebugOutput} from '../src/types';

describe('Validation', () => {
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

	@Model
	class OrderList extends Entity<OrderList> {
		@AutoObjectArray(Order) orders: Order[] = [];
	}

	it('Invalid nested objects should become null', () => {
		const order = new Order({
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
		});

		expect(order).toBeInstanceOf(Order);
		expect(order.address).toBeInstanceOf(Address);
		expect(order.address?.street).toStrictEqual('Street 1');
		expect(order.address?.streetNumber).toStrictEqual(2);
		expect(order.clientAddress).toStrictEqual(null);
		expect(order.projectAddress).toBeInstanceOf(Address);
		expect(order.projectAddress?.street).toStrictEqual('Street 2');
		expect(order.projectAddress?.streetNumber).toStrictEqual(null);
	});

	it('Invalid objects in object arrays should be removed', () => {
		const orders = new OrderList({
			orders: [
				{
					address: {
						street: 'Street 1',
						streetNumber: 2
					},
					clientAddress: null
				},
				{
					// @ts-ignore
					invalidOrder: null
				},
				{
					clientAddress: {streetNumber: 4},
					projectAddress: {streetNumber: 2}
				},
				// @ts-ignore
				null
			]
		});

		expect(orders).toBeInstanceOf(OrderList);
		expect(orders.orders.length).toStrictEqual(1);
		expect(orders.orders[0]).toBeInstanceOf(Order);
		expect(orders.orders[0].address).toBeInstanceOf(Address);
	});

	it('Invalid nested objects should become null and debug info should be correct', () => {
		const debugOutput: DebugOutput[] = [];
		const order = new Order(
			{
				address: {
					street: 'Street 1',
					streetNumber: 2,
					isPrimaryAddress: null
				},
				clientAddress: {
					streetNumber: 4
				},
				projectAddress: {
					street: 'Street 2'
				}
			},
			(output) => {
				debugOutput.push(output);
			}
		);

		expect(order).toBeInstanceOf(Order);
		expect(order.address).toBeInstanceOf(Address);
		expect(order.address?.street).toStrictEqual('Street 1');
		expect(order.address?.streetNumber).toStrictEqual(2);
		expect(order.clientAddress).toStrictEqual(null);
		expect(order.projectAddress).toBeInstanceOf(Address);
		expect(order.projectAddress?.street).toStrictEqual('Street 2');
		expect(order.projectAddress?.streetNumber).toStrictEqual(null);
		expect(debugOutput).toEqual([
			{
				class: 'Address',
				field: 'lastModified',
				value: undefined,
				info: 'value is undefined'
			},
			{
				class: 'Address',
				field: 'country',
				value: undefined,
				info: 'value is undefined'
			},
			{
				class: 'Address',
				field: 'street',
				value: undefined,
				info: 'value is undefined'
			},
			{
				class: 'Address',
				field: 'isPrimaryAddress',
				value: undefined,
				info: 'value is undefined'
			},
			{
				class: 'Address',
				field: 'lastModified',
				value: undefined,
				info: 'value is undefined'
			},
			{
				class: 'Address',
				field: 'country',
				value: undefined,
				info: 'value is undefined'
			},
			{
				class: 'Order',
				field: 'clientAddress',
				value: '{"streetNumber":4}',
				info: 'object created from input is not valid'
			},
			{
				class: 'Address',
				field: 'streetNumber',
				value: undefined,
				info: 'value is undefined'
			},
			{
				class: 'Address',
				field: 'isPrimaryAddress',
				value: undefined,
				info: 'value is undefined'
			},
			{
				class: 'Address',
				field: 'lastModified',
				value: undefined,
				info: 'value is undefined'
			},
			{
				class: 'Address',
				field: 'country',
				value: undefined,
				info: 'value is undefined'
			}
		]);
	});

	it('Invalid nested objects should become null and debug info should be correct, skipping empty values', () => {
		const debugOutput: DebugOutput[] = [];
		const order = new Order(
			{
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
			},
			(output) => {
				debugOutput.push(output);
			},
			true
		);

		expect(order).toBeInstanceOf(Order);
		expect(order.address).toBeInstanceOf(Address);
		expect(order.address?.street).toStrictEqual('Street 1');
		expect(order.address?.streetNumber).toStrictEqual(2);
		expect(order.clientAddress).toStrictEqual(null);
		expect(order.projectAddress).toBeInstanceOf(Address);
		expect(order.projectAddress?.street).toStrictEqual('Street 2');
		expect(order.projectAddress?.streetNumber).toStrictEqual(null);
		expect(debugOutput).toEqual([
			{
				class: 'Order',
				field: 'clientAddress',
				value: '{"streetNumber":4}',
				info: 'object created from input is not valid'
			}
		]);
	});

	it('Invalid objects in object arrays should be removed and debug info should be correct', () => {
		const debugOutput: DebugOutput[] = [];
		const orders = new OrderList(
			{
				orders: [
					{
						address: {
							street: 'Street 1',
							streetNumber: 2
						},
						clientAddress: null
					},
					{
						// @ts-ignore
						invalidOrder: null
					},
					{
						clientAddress: {streetNumber: 4},
						projectAddress: {streetNumber: 2}
					},
					// @ts-ignore
					null
				]
			},
			(output) => {
				debugOutput.push(output);
			},
			true
		);

		expect(orders).toBeInstanceOf(OrderList);
		expect(orders.orders.length).toStrictEqual(1);
		expect(orders.orders[0]).toBeInstanceOf(Order);
		expect(orders.orders[0].address).toBeInstanceOf(Address);
	});
});
