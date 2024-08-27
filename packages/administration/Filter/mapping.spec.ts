import { Filter, Listener } from "../index"

describe("Mapping and filtering", () => {
	it("Type checks", () => {
		expect(Filter.Mapping.is(mappingConfig)).toBe(true)
		expect(Listener.Configuration.BigQuery.type.omit<"privateKey" | "logger">(["privateKey", "logger"]).is(configuration)).toBe(true)
	})
	it("Maps event", () => {
		expect(new Filter.Mapping.Implementation(mappingConfig).filter(event)).toEqual(result)
	})
})
const event = {
	stringVal: "test",
	numVal: 2,
	tuple: ["key", { inner: "value" }],
	array: [{ inner: "value0" }, { inner: "value1" }, { inner: "value2" }, { inner: "value3" }],
	nested: {
		property: "value",
		array: [{ nested: { property: "value" } }],
		// TODO doubleArray: [
		// 	[{ inner: 1 }, { inner: 2 }],
		// 	[{ inner: 3 }, { inner: 4 }],
		// ],
	},
	map: { prop1: "hej", prop2: "haj" },
}
const mapping = {
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
		// TODO nestedDoubleArray: "nested.doubleArray[*][*].inner",
		map: { selector: "map", transform: "array" },
		// eslint-disable-next-line
} as const satisfies Filter.Mapping.RecordWithSelector<string>;
const mappingConfig: Filter.Mapping = {
	type: "mapping",
	mapping
}
const tableSchema: Listener.Configuration.BigQuery.Api.BaseField<Extract<keyof typeof mapping, string>>[] = [
	{ name: "stringVal", type: "STRING" },
	{ name: "numVal", type: "INTEGER" },
	{ name: "tupleKey", type: "STRING" },
	{ name: "tupleInner", type: "STRING" },
	{ name: "arrayInner", type: "STRING", mode: "REPEATED" },
	{ name: "arrayFlatten", type: "STRING" },
	{ name: "arrayFlattenItems", type: "STRING", mode: "REPEATED" },
	{ name: "nestedProp", type: "STRING" },
	{ name: "nestedArray", type: "RECORD", mode: "REPEATED", fields: [
			{ name: "arrayNestedProp", type: "STRING" },
			{ name: "arrayNestedFlatten", type: "STRING" },
		] 
	},
	{ name: "map", type: "RECORD", mode: "REPEATED", fields: [
			{ name: "key", type: "STRING" },
			{ name: "value", type: "STRING" },
		]
	},
]
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
	map: [
		{ key: "prop1", value: "hej" },
		{ key: "prop2", value: "haj" },
	],
}
const configuration: Listener.Configuration.BigQuery.BaseConfiguration = {
	name: "test-events",
	type: "bigquery",
	filter: [
		{
			type: "selectively",
			expression: "filter",
		},
		{ type: "useragent" },
		{
			type: "mapping",
			mapping,
		},
	],
	batchSize: 10,
	batchInterval: 3,
	projectName: "test_project",
	datasetName: "test_data",
	tableName: "test_table",
	tableSchema
}
