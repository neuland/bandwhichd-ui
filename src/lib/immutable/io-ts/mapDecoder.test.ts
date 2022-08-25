import { Map } from "immutable";
import * as Decoder from "io-ts/lib/Decoder"
import * as Either from "fp-ts/Either";

import { mapDecoder } from "./mapDecoder";

describe("mapDecoder", () => {
    test("should have map for custom types as keys and values", () => {
        // given
        const idTag = Symbol("Id");
        type Id = string & { readonly _tag: typeof idTag; };
        const createId: (value: string) => Id = (value) => value as Id;
        const idDecoder = Decoder.map(createId)(Decoder.string);

        interface Value {
            name: string;
            numbers: number[];
        }
        
        const valueDecoder: Decoder.Decoder<unknown, Value> = Decoder.struct({
            name: Decoder.string,
            numbers: Decoder.array(Decoder.number),
        });

        const input = {
            "a": {
                name: "Alpha",
                numbers: [-1, 42],
            },
            "b": {
                name: "Beta",
                numbers: [101],
            },
        };

        // when
        const result = mapDecoder(idDecoder, valueDecoder).decode(input);

        // then
        expect(result).toEqual(Either.right(Map({
            [createId("a")]: {
                name: "Alpha",
                numbers: [-1, 42],
            },
            [createId("b")]: {
                name: "Beta",
                numbers: [101],
            }
        })));
    });

    test("should have decoding error if null", () => {
        // when
        const result = mapDecoder(Decoder.string, Decoder.number).decode(null);

        // then
        expect(result).toEqual(Either.left(Decoder.error(null, "must not be null")));
    });

    test("should have decoding error if not an object", () => {
        // when
        const result = mapDecoder(Decoder.string, Decoder.number).decode("");

        // then
        expect(result).toEqual(Either.left(Decoder.error("", "must be an object")));
    });
});