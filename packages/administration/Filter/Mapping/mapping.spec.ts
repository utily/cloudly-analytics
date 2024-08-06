import { Mapping } from "./index"

describe("Mapping and filtering", () => {
	const event = {
		stringVal: "test",
		numVal: 2,
		tuple: ["key", { inner: "value" }],
		array: [{ inner: "value0" }, { inner: "value1" }, { inner: "value2" }, { inner: "value3" }],
		nested: {
			property: "value",
			array: [{ nested: { property: "value" } }],
			doubleArray: [
				[{ inner: 1 }, { inner: 2 }],
				[{ inner: 3 }, { inner: 4 }],
			],
		},
		map: { prop1: "hej", prop2: "haj" },
	}
	const mapping: Mapping = {
		type: "mapping",
		mapping: {
			stringVal: "stringVal",
			numVal: { selector: "numVal", transform: "integer" },
			tupleKey: "tuple[0]",
			tupleInner: "tuple[1].inner",
			arrayInner: "array[*].inner",
			arrayFlatten: { selector: "array", transform: "stringify" },
			arrayFlattenItems: { selector: "array[*]", transform: "stringify" },
			nestedProp: "nested.property",
			nestedArray: {
				selector: "nested.array",
				transform: {
					arrayNestedProp: "nested.property",
					arrayNestedFlatten: { selector: "nested", transform: "stringify" },
				},
			},
			nestedDoubleArray: "nested.doubleArray[*][*].inner",
			map: { selector: "map", transform: "array" },
		},
	}
	const result = {
		stringVal: "test",
		numVal: 2,
		tupleKey: "key",
		tupleInner: "value",
		arrayInner: ["value0", "value1", "value2", "value3"],
		arrayFlatten: '[{"inner":"value0"},{"inner":"value1"},{"inner":"value2"},{"inner":"value3"}]',
		arrayFlattenItems: ['{"inner":"value0"}', '{"inner":"value1"}', '{"inner":"value2"}', '{"inner":"value3"}'],
		nestedProp: "value",
		nestedArray: [{ arrayNestedProp: "value", arrayNestedFlatten: '{"property":"value"}' }],
		nestedDoubleArray: [
			[1, 2],
			[3, 4],
		],
		map: [
			{ key: "prop1", value: "hej" },
			{ key: "prop2", value: "haj" },
		],
	}
	it("Type checks", () => {
		expect(Mapping.is(mapping)).toBe(true)
	})
	it("Maps event", () => {
		expect(new Mapping.Implementation(mapping).filter(event)).toEqual(result)
	})
})
