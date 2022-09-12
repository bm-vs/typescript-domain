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

describe('Object types', () => {
	const countries = ['Norway', 'Sweden', 'Denmark'] as const;
	type Country = typeof countries[number];

	@Model
	class Address extends Entity<Address> {
		@AutoString street: string | null = null;
		@AutoNumber streetNumber: number | null = null;
		@AutoBoolean isPrimaryAddress: boolean | null = null;
		@AutoDate lastModified: Date | null = null;
		@AutoEnum(countries) country: Country | null = null;
	}

	@Model
	class Order extends Entity<Order> {
		@AutoObject(Address) address: Address | null = null;
		@AutoObject(Address) clientAddress: Address | null = null;
		@AutoObject(Address) projectAddress: Address | null = null;
	}

	@Model
	class OrderList extends Entity<OrderList> {
		@AutoObjectArray(Order) orders: Order[] = [];
	}

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
		expect(orders.orders.length).toStrictEqual(3);
		expect(orders.orders[0]).toBeInstanceOf(Order);
		expect(orders.orders[1]).toBeInstanceOf(Order);
		expect(orders.orders[1].address).toStrictEqual(null);
		expect(orders.orders[1].clientAddress).toStrictEqual(null);
		expect(orders.orders[1].projectAddress).toStrictEqual(null);
		expect(orders.orders[2]).toBeInstanceOf(Order);
	});

	it('Initialization from plain objects should equal initialization from objects', () => {
		const ordersObj = new OrderList({
			orders: [
				new Order({
					address: new Address({
						street: 'Street 1',
						streetNumber: 2
					}),
					clientAddress: null
				}),
				new Order(),
				new Order({
					clientAddress: new Address({streetNumber: 4}),
					projectAddress: new Address({streetNumber: 2})
				})
			]
		});
		const ordersPlain = new OrderList({
			orders: [
				{
					address: {
						street: 'Street 1',
						streetNumber: 2
					},
					clientAddress: null
				},
				{},
				{
					clientAddress: {streetNumber: 4},
					projectAddress: {streetNumber: 2}
				}
			]
		});
		expect(ordersObj).toEqual(ordersPlain);
	});

	it('Deeply nested object properties should be initialized', () => {
		const orders = new OrderList({
			orders: [
				new Order({
					address: new Address({
						street: 'Street 1',
						streetNumber: 2
					}),
					clientAddress: null
				}),
				new Order(),
				new Order({
					clientAddress: new Address({streetNumber: 4}),
					projectAddress: new Address({streetNumber: 2})
				})
			]
		});
		expect(orders).toBeInstanceOf(OrderList);
		expect(orders.orders[0]).toBeInstanceOf(Order);
		expect(orders.orders[0].address).toBeInstanceOf(Address);
		expect(orders.orders[0].clientAddress).toStrictEqual(null);
		expect(orders.orders[0].projectAddress).toStrictEqual(null);
		expect(orders.orders[0].address?.street).toStrictEqual('Street 1');
		expect(orders.orders[0].address?.streetNumber).toStrictEqual(2);
		expect(orders.orders[0].address?.isPrimaryAddress).toStrictEqual(null);
		expect(orders.orders[0].address?.lastModified).toStrictEqual(null);
		expect(orders.orders[0].address?.country).toStrictEqual(null);

		expect(orders.orders[1]).toBeInstanceOf(Order);
		expect(orders.orders[1].address).toStrictEqual(null);
		expect(orders.orders[1].clientAddress).toStrictEqual(null);
		expect(orders.orders[1].projectAddress).toStrictEqual(null);

		expect(orders.orders[2]).toBeInstanceOf(Order);
		expect(orders.orders[2].address).toStrictEqual(null);
		expect(orders.orders[2].clientAddress).toBeInstanceOf(Address);
		expect(orders.orders[2].projectAddress).toBeInstanceOf(Address);
		expect(orders.orders[2].clientAddress?.street).toStrictEqual(null);
		expect(orders.orders[2].clientAddress?.streetNumber).toStrictEqual(4);
		expect(orders.orders[2].clientAddress?.isPrimaryAddress).toStrictEqual(
			null
		);
		expect(orders.orders[2].clientAddress?.lastModified).toStrictEqual(null);
		expect(orders.orders[2].clientAddress?.country).toStrictEqual(null);
		expect(orders.orders[2].projectAddress?.street).toStrictEqual(null);
		expect(orders.orders[2].projectAddress?.streetNumber).toStrictEqual(2);
		expect(orders.orders[2].projectAddress?.isPrimaryAddress).toStrictEqual(
			null
		);
		expect(orders.orders[2].projectAddress?.lastModified).toStrictEqual(null);
		expect(orders.orders[2].projectAddress?.country).toStrictEqual(null);
	});
});
