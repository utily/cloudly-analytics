import { TableField } from "@google-cloud/bigquery"
import { isly } from "isly"

// cspell:ignore BIGNUMERIC DATETIME
export namespace BigQueryApi {
	export type BaseField<T extends string = string> = {
		name: T
		type: BaseField.Type
		mode?: BaseField.Mode
		fields?: BaseField[]
	}
	export namespace BaseField {
		export type Type = typeof Type.values[number]
		export namespace Type {
			export const values = [
				"STRING",
				"BYTES",
				"INTEGER",
				// (same as INTEGER)
				"INT64",
				"FLOAT",
				// (same as FLOAT)
				"FLOAT64",
				"NUMERIC",
				"BIGNUMERIC",
				"BOOLEAN",
				// (same as BOOLEAN)
				"BOOL",
				"TIMESTAMP",
				"DATE",
				"TIME",
				"DATETIME",
				"INTERVAL",
				// (where RECORD indicates that the field contains a nested schema)
				"RECORD",
				// (same as RECORD)
				"STRUCT",
				"GEOGRAPHY",
			] as const
			export const type = isly.string<Type>(values)
		}
		export type Mode = typeof Mode.values[number]
		export namespace Mode {
			export const values = ["NULLABLE", "REQUIRED", "REPEATED"] as const
			export const type = isly.string<Mode>(values)
		}
		export const type = isly.object<BaseField>({
			name: isly.string(/^[a-zA-Z_][a-zA-Z0-9_]{0,299}$/),
			type: Type.type,
			mode: Mode.type.optional(),
			fields: isly.lazy((): isly.Type<BaseField[] | undefined> => type.array().optional(), "fields"),
		})
	}
	export type TableSchemaField = TableField & BaseField

	export namespace TableSchemaField {
		export const typeValues = BaseField.Type.values
		export const modeValues = BaseField.Mode.values
		export const type: isly.Type<TableSchemaField> = BaseField.type.extend<TableSchemaField>({
			categories: isly
				.object({
					names: isly.array(isly.string(), { criteria: "maxLength", value: 5 }).optional(),
				})
				.optional(),
			collation: isly.string().optional(),
			description: isly.string(/* TODO: MaxLength 1024 */).optional(),
			fields: isly.array(isly.lazy(() => type, "FieldDefinition")).optional(),
			maxLength: isly.string().optional(),
			policyTags: isly
				.object({
					names: isly.array(isly.string(), { criteria: "maxLength", value: 1 }).optional(),
				})
				.optional(),
			dataPolicies: isly.object<{ name?: string }>({ name: isly.string().optional() }).array().optional(),
			precision: isly.string().optional(),
			scale: isly.string().optional(),
			defaultValueExpression: isly.string().optional(),
			foreignTypeDefinition: isly.string().optional(),
			rangeElementType: isly.object<{ type?: string }>({ type: isly.string().optional() }).optional(),
			roundingMode: isly
				.string<"ROUNDING_MODE_UNSPECIFIED" | "ROUND_HALF_AWAY_FROM_ZERO" | "ROUND_HALF_EVEN">([
					"ROUNDING_MODE_UNSPECIFIED",
					"ROUND_HALF_AWAY_FROM_ZERO",
					"ROUND_HALF_EVEN",
				])
				.optional(),
		})
	}
}
