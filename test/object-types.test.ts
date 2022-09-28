import {
	AutoDate,
	AutoObject,
	AutoBoolean,
	AutoEnum,
	AutoNumber,
	AutoString,
	Entity,
	Model,
	PlainData,
	EntityValidation
} from '../src/index';

describe('Object types', () => {
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

	@Model
	class Order extends Entity<Order> {
		@AutoObject(Address) address: Address | null = null;
		@AutoObject(Address) clientAddress: Address | null = null;
		@AutoObject(Address) projectAddress: Address | null = null;
	}

	@Model
	class OrderList extends Entity<OrderList> {
		@AutoObject(Order) orders: Order | null = null;
	}

	@Model
	class NestedObject extends Entity<NestedObject> {
		@AutoNumber() id: number | null = null;
		nested: NestedObject | null = null;

		constructor(data?: PlainData<NestedObject> | null) {
			super(data);
			this.nested = EntityValidation.object(
				NestedObject,
				data?.nested
			).validatedValue;
		}
	}

	it('Should create an object with default values no parameters are passed', () => {
		const order = new Order();
		expect(order.address).toStrictEqual(null);
		expect(order.clientAddress).toStrictEqual(null);
		expect(order.projectAddress).toStrictEqual(null);
	});

	it('Should create an object with default values when an empty plain object is passed', () => {
		const order = new Order({});
		expect(order.address).toStrictEqual(null);
		expect(order.clientAddress).toStrictEqual(null);
		expect(order.projectAddress).toStrictEqual(null);
	});

	it('Should create an object with default values when plain object fields are null', () => {
		const order = new Order({
			address: null,
			clientAddress: null,
			projectAddress: null
		});
		expect(order.address).toStrictEqual(null);
		expect(order.clientAddress).toStrictEqual(null);
		expect(order.projectAddress).toStrictEqual(null);
	});

	it('Should create an object with default values when plain object fields are undefined', () => {
		const order = new Order({
			address: undefined,
			clientAddress: undefined,
			projectAddress: undefined
		});
		expect(order.address).toStrictEqual(null);
		expect(order.clientAddress).toStrictEqual(null);
		expect(order.projectAddress).toStrictEqual(null);
	});

	it('Nested object properties should be initialized', () => {
		const order = new Order({
			address: new Address({
				street: 'Street 1',
				streetNumber: 2
			}),
			clientAddress: null
		});
		expect(order).toBeInstanceOf(Order);
		expect(order.address).toBeInstanceOf(Address);
		expect(order.address?.street).toStrictEqual('Street 1');
		expect(order.address?.streetNumber).toStrictEqual(2);
		expect(order.address?.isPrimaryAddress).toStrictEqual(null);
		expect(order.address?.lastModified).toStrictEqual(null);
		expect(order.address?.country).toStrictEqual(null);
		expect(order.clientAddress).toStrictEqual(null);
		expect(order.projectAddress).toStrictEqual(null);
	});

	it('Deeply nested object properties should be initialized', () => {
		const orders = new OrderList({
			orders: {
				address: {
					street: 'Street 1',
					streetNumber: 2
				},
				clientAddress: null
			}
		});
		expect(orders).toBeInstanceOf(OrderList);
		expect(orders.orders).toBeInstanceOf(Order);
		expect(orders.orders?.address).toBeInstanceOf(Address);
		expect(orders.orders?.clientAddress).toStrictEqual(null);
		expect(orders.orders?.projectAddress).toStrictEqual(null);
		expect(orders.orders?.address?.street).toStrictEqual('Street 1');
		expect(orders.orders?.address?.streetNumber).toStrictEqual(2);
		expect(orders.orders?.address?.isPrimaryAddress).toStrictEqual(null);
		expect(orders.orders?.address?.lastModified).toStrictEqual(null);
		expect(orders.orders?.address?.country).toStrictEqual(null);
	});

	it('Initialization from plain objects should equal initialization from objects', () => {
		const ordersObj = new OrderList({
			orders: new Order({
				address: new Address({
					street: 'Street 1',
					streetNumber: 2
				}),
				clientAddress: null
			})
		});
		const ordersPlain = new OrderList({
			orders: {
				address: {
					street: 'Street 1',
					streetNumber: 2
				},
				clientAddress: null
			}
		});
		expect(ordersObj).toEqual(ordersPlain);
	});

	it('Should not create an infinite loop', () => {
		const nested = new NestedObject({
			id: 1,
			nested: {
				id: 2,
				nested: {
					id: 3,
					nested: {
						id: 4
					}
				}
			}
		});
		expect(nested).toEqual(
			expect.objectContaining({
				id: 1,
				nested: expect.objectContaining({
					id: 2,
					nested: expect.objectContaining({
						id: 3,
						nested: expect.objectContaining({
							id: 4,
							nested: null
						})
					})
				})
			})
		);
	});
});
