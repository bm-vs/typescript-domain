# typescript-domain

Parsing and validation of JSON, or Javascript objects literals, into classes.

Aims at creating consistency for types both at compile time and runtime.

<br>
<br>

## Contents
* [Installation](#installation)
* [Objective](#objective)
* [Motivation](#motivation)
  + [API requests](#api-requests)
  + [Initializing class objects](#initializing-class-objects)
* [Solution](#solution)
* [How it works](#how-it-works)
  + [Flow](#flow)
  + [Parsing and validation](#parsing-and-validation)
  + [Alias](#alias)
  + [Debugging](#debugging)
* [Use cases](#use-cases)
  + [Basic types](#basic-types)
  + [Enums](#enums)
  + [Dates](#dates)
  + [Objects](#objects)
  + [Arrays](#arrays)
  + [Debug info](#debug-info)
  + [Manually initialized fields](#manually-initialized-fields)
  + [Default values](#default-values)
* [Limitations](#limitations)


<br>
<br>

## Installation

This package doesn't dependent on anything else. Just do:

```sh
npm i typescript-domain
```



<br>
<br>

## Objective

Typescript is great!

It helps you to prevent messing up your types during development, reminds you that certain variables can be undefined, gives you some useful come completion.

And it all ultimately cuts down on how many pesky runtime errors you face, which are a hassle for both developer and user.

This works great if whatever you're developing is self-contained but, as soon as you start communicating with external systems and get data from various sources, all of your typings are more like assumptions or good wishes. If a wacky API throws you something you're not expecting you're screwed, and so is your user.

This poses two problems:

1. How do you handle all of these "quirks"? Say if for some reason, the API sometimes returns a number when you're expecting a string; do you just do call toString everywhere, just in case?

2. How can you identify what these corner cases are? How can you address them if they only happen rarely or in a manner that is hard to reproduce?


<br>
<br>

## Motivation

<br>

### API requests

The straight-forward approach to making requests in Typescript is to:

1. use `fetch` or some other package

2. pass the result through `JSON.parse`

3. annotate that the returned object literal is of type `interface`

4. bada bing bada boom, all done

From here you end up with a variable that is an assumption - you're hoping that the fields are correct but you can't be sure.

For example, you get some data with the format:

```json
[{
	"streetName": "Dakota Street",
	"streetNumber": "3600",
	"postalCode": "213",
	"city": "Sunzhuang"
}, {
	"streetName": "Hagan Avenue",
	"streetNumber": "06",
	"postalCode": "91130",
	"city": "Sanom"
}]
```

You then define an interface that matches the data you're expecting:

```ts
interface Address {
	streetAddress: string;
	streetNumber: string;
	postalCode: string;
	city: string;
}
```

And when using `fetch` you can do:

```typescript
fetch('user/1/addresses').then((addresses: Address[]) => {})
```

**Addresses here are just whatever was returned. No type integrity is enforced, so these object literals can have other fields, missing fields, different types, you name it**.

<br>

### Initializing class objects

It's a pain in the ass to create and initialize a new class object in Typescript, which is why people naturally gravitate towards just using interfaces.

With an interface you can do:

```ts
interface Address {
	streetAddress: string;
	streetNumber: string;
	postalCode: string;
	city: string;
}

const address: Address = {
	streetName: "Dakota Street",
	streetNumber: "3600",
	postalCode: "213",
	city: "Sunzhuang"
}
```

and you're done.

Using an actual class you end up needing to do something like:

```ts
class Address {
	public streetAddress: string
	constructor(streetAddress) {
		this.streetAddress = streetAddress;
	}
}

// or

class Address {
	constructor(
		public streetAddress: string
	)
}

const address = new Address(
	"Dakota Street"
)
```

which can cause confusion when having a bunch of attribute in a class.

An alternative is to make the argument of the constructor an object itself.

```ts
class Address {
	public streetAddress: string
	constructor(address: Address) {
		this.streetAddress = address.streetAddress;
	}
}

const address = new Address({
	streetAddress: "Dakota Street"
})
```

but this causes problems if `Address` was to have methods.

Ok, I guess you can use [Partial](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype) on the argument of the constructor... but then you have to handle all of the possible undefined's manually, possibly adding default values for everything.

Much work.

<br>
<br>

## Solution

```ts
@Model
class Address extends Entity<Address> {
	@AutoString() street: string | null = null;
	@AutoNumber() streetNumber: number | null = null;
}

const address = new Address({
	streetName: "Dakota Street",
	streetNumber: 3600
});

http.get('users/1/addresses').pipe(EntityConverter.object(Address))
```

The objective here was to create a solution that works great with `parsing and validating object literals` (like what we get from requests), and makes it `easy and readable to create objects in code`, including having `error checking leveraging Typescript`.

An important aspect was to also make it easy enough to override default behavior to allow for custom field initialization by the developer.

All that needs to be done is to:
- add `@Model` to class
- have it extend `Entity` (the generic type in the entity is the same as the class we're decorating)
- decorate the fields that should be initialized and validated automatically. There are decoration for the major types of Javascript:

	`@AutoObject` - requires type argument. `@AutoObject(Address) address: Address | null`

	`@AutoBoolean`

	`@AutoString`

	`@AutoNumber`

	`@AutoDate`

	`@AutoEnum` - requires options argument (the values the enum allows)

	`@AutoObjectArray` - requires type argument

	`@AutoBooleanArray`

	`@AutoStringArray`

	`@AutoNumberArray`

	`@AutoDateArray`

	`@AutoEnumArray` - requires options argument (the values the enum allows)




**All decorators allow for an optional argument to be passed, an alias (check next section).**

<br>
<br>

## How it works

<br>

### Flow

The [parameter decorators](https://www.typescriptlang.org/docs/handbook/decorators.html#parameter-decorators) (like `@AutoString`) run first, during the class prototype definition stage.
These output what properties from the class are decorated, their type, and the class they are associated with.

This data is stored in the `MetadataStorage` singleton, which records the information about every decorated property.

When an object is created: the `Entity` constructor runs, then the class constructor runs (where you can initialize your non-Auto fields), then the class decorator `@Model` runs.

By using the class decorator `@Model`, since it runs after the class constructor, all of the `Object.keys` are initialized. All of the keys of the object are then iterated over, checked against what's in the `MetadataStorage` and those fields are initialized from the object passed as an argument to the constructor.

<br>

### Parsing and validation

Every `Entity` receives one argument - the data that will initialize the object.

This `data` has the same format as the class it initializes, except that all fields can also be `undefined` or `null`. For arrays, their members are also allowed to be `undefined` or `null`.

When a field of the data is being validated the following happens:

- For `boolean`, `number` and `string` fields: either its value matches the respective type, or it becomes `null`
- For `Date` fields: either the value can be parsed into a date (through `new Date(value)`), or it becomes `null`
- For `enum` fields: either the value matches one of the options, or it becomes `null`
- For `object` fields: nesting works recursively infinitely, as long as they're different types (check `Limitations`). By using the `isValid` method attached to the `Entity`, you can specify is a nested object should be thrown away if some of its fields aren't valid, thus making that field in the parent object `null`
- For `array` fields: all members of the array are validated individually. If any end up not being valid (having a `null` value), they are removed from the final array.

<br>

### Alias

All decorators allow for an optional argument to be passed, an `alias` (string).

This is useful when mapping JSON fields into the object. If the `alias` field isn't found in the object literal, it'll then try the name of the field itself (so creating objects from JSON and object literals in Typescript will work at the same time).**

If both the `alias` and the `field name` exist in the passed `data`, the `alias` is always prioritized.

<br>

### Debugging

Besides the `data` used to initialize an `Entity`, optional arguments are available for debugging purposes - `_debugFunction` and `_debugSkipUndef`.

If the `_debugFunction` is provided, it will be called every time an error in the typings is detected during the validation phase (either the field doesn't exist in the data or it has the wrong type ex: `true` to a `number` field). The function is called with information about the `class` and `field` where it happened, as well as the `value` and what `type of error`.

If the `_debugSkipUndef` argument is true, errors regarding missing fields in the data will be skipped (because it might be ignorable sometimes).

This feature can be useful to collect all of the mistypings that happen at runtime, and feed them to, for example, an API endpoint that stores all of these for later analysis.


<br>
<br>

## Use cases

<br>

### Basic types

```ts
@Model
class Address extends Entity<Address> {
	@AutoString() street: string | null = null;
	@AutoNumber() streetNumber: number | null = null;
	@AutoBoolean() isPrimaryAddress: boolean | null = true;
}

// address1 and address2 are instantiated with the default values
const address1 = new Address();
const address2 = new Address({});

// address3 is instantiated with the passed values
const address3 = new Address({
	street: 'Streety St.',
	streetNumber: 42,
	isPrimaryAddress: false
});

// this will show as a ts error
// Type 'string' is not assignable to type 'number'.ts(2322)
const address3 = new Address({
	street: 'Streety St.',
	streetNumber: '42',
	isPrimaryAddress: false
});

// if using JSON data or coercing the argument type somehow
// the object is still created, but streetNumber will be null
// (since '42' isn't compatible with number | null)
const addressBuilder = (data: any) => new Address(data)
const address4 = addressBuilder({streetNumber: '42'})
```

<br>

### Enums

```ts
const countries = ['Norway', 'Sweden', 'Denmark'] as const;
type Country = typeof countries[number];

@Model
class Address extends Entity<Address> {
	@AutoEnum(countries) country: Country | null = null;
}

// address1 is instantiated with the passed values
const address1 = new Address({country: 'Norway'});

// this will show as a ts error
// Type '"Portugal"' is not assignable to type 'PlainData<"Norway" | "Sweden" | "Denmark" | null> | undefined'.ts(2322)
const address2 = new Address({country: 'Denmark'});
```

<br>

### Dates

```ts
@Model
class Address extends Entity<Address> {
	@AutoDate() lastModified: Date | null = null;
}

// these is instantiated with the passed values
// using the new Date(value) constructor
const address1 = new Address({lastModified: new Date()});
const address2 = new Address({lastModified: 1664309665});
const address3 = new Address({lastModified: '2022-09-27T20:14:25+00:00'});

// if a new Date() can't be created from the value, it becomes null
const address4 = new Address({lastModified: false});
```

<br>

### Objects

```ts
@Model
class Address extends Entity<Address> {
	@AutoString() street: string | null = null;
	@AutoNumber() streetNumber: number | null = null;

	public isValid(): boolean {
		return this.street !== null;
	}
}

@Model
class Customer extends Entity<Customer> {
	@AutoObject(Address) address: Address | null = null;
}

// the nested address field becomes an Address object
// streetNumber becomes null (the default value)
const customer1 = new Customer({
	address: {
		street: 'Streety St.'
	}
})

// the nested address field becomes null because the result of isValid is false
// isValid always returns true by default
const customer2 = new Customer({
	address: {
		streetNumber: 4
	}
})

// this will show as a ts error
// Type 'number' is not assignable to type 'string'.ts(2322)
// if creating from untyped data, street would become null,
// making the address object not valid and the address field becomes null
const customer3 = new Customer({
	address: {
		street: 1,
		streetNumber: 4
	}
})
```

<br>

### Arrays

```ts
@Model
class Address extends Entity<Address> {
	@AutoString() street: string | null = null;
	@AutoNumberArray() streetNumbers[]: number[] = [];

	public isValid(): boolean {
		return this.street !== null;
	}
}

@Model
class Customer extends Entity<Customer> {
	@AutoObjectArray(Address) addresses: Address[] = [];
}

// addresses will have only the first item
// the second one is not valid, becoming null, and nulls are removed from arrays
const customer1 = new Customer({
	addresses: [{
		street: 'Street 1',
		streetNumbers: [1, 2]
	}, {
		streetNumbers: [1, 2, 3]
	}]
})

// this will output type errors in Typescript
// if parsing untyped data, Street 1 will have [1, 2] for streetNumbers,
// and Street2 will have null
const customer2 = new Customer({
	addresses: [{
		street: 'Street 1',
		streetNumbers: [1, 2, '3', null]
	}, {
		street: 'Street 2',
		streetNumbers: '[1, 2, 3]'
	}]
})
```

<br>

### Debug info

```ts
@Model
class Address extends Entity<Address> {
	@AutoString() street: string | null = null;
	@AutoNumberArray() streetNumbers[]: number[] = [];
}

// Should output:
// {class: 'Address', field: 'street', value: '1', info: 'value is not a string'}
// {class: 'Address', field: 'streetNumbers', value: undefined, info: 'value is undefined'}
new Address({street: 1}, (output) => {
	console.log(output);
}, false);

// Should output:
// {class: 'Address', field: 'street', value: '1', info: 'value is not a string'}
new Address({street: 1}, (output) => {
	console.log(output);
}, false);
```


<br>

### Manually initialized fields

```ts
@Model
class Address extends Entity<Address> {
	street: string | null = null;
	@AutoNumber() streetNumber: number | null = null;
	fullAddress: string = '';

	constructor(data?: PlainData<Address>) {
		super(data);
		this.street = data?.street.toString();
		// this won't work,
		// data gets initialized in the @Model constructor, which executes after this
		this.fullAddress = this.data + this.street;

		// you need to call the necessary EntityValidation method yourself
		// EntityValidation.(array | boolean | date | enum | number | object | string)
		this.fullAddress = (data.street ?? '') + EntityValidation.number(data.streetNumber).validatedValue;
	}
}
```


<br>

### Default values

```ts
@Model
class Address extends Entity<Address> {
	@AutoString() street: string | null = 'Street 1';
}

// if an @Auto field doesn't exist in the passed data, the default value is used
const address1 = new Address({});

// if it exists, the validated value replaces the default value
const address2 = new Address({street: 'Street 2'});

// if the value is invalid, it becomes null, NOT the default value
const address3 = new Address({street: 1});
```


<br>
<br>

## Limitations

Circular dependencies aren't handled automatically.

These fields need to be taken care of in the constructor of your class. Here's an example:

```ts
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
```
