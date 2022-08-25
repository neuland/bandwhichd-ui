import { Map } from "immutable";
import * as Decoder from "io-ts/lib/Decoder"

export const mapDecoder: <K, V>(keyDecoder: Decoder.Decoder<unknown, K>, valueDecoder: Decoder.Decoder<unknown, V>) => Decoder.Decoder<unknown, Map<K, V>> =
    <K, V>(keyDecoder: Decoder.Decoder<unknown, K>, valueDecoder: Decoder.Decoder<unknown, V>) => ({
        decode: (i: unknown) => {

            if (i === null) {
                return Decoder.failure(i, "must not be null");
            }

            if (typeof i !== "object") {
                return Decoder.failure(i, "must be an object");
            }

            const mutableMap = Map<K, V>().asMutable();
            for (const [keyOfUnknownType, valueOfUnknownType] of Object.entries(i)) {
                const keyDecodingResult = keyDecoder.decode(keyOfUnknownType);
                if (keyDecodingResult._tag === "Left") {
                    return keyDecodingResult;
                } else {
                    const valueDecodingResult = valueDecoder.decode(valueOfUnknownType);
                    if (valueDecodingResult._tag === "Left") {
                        return valueDecodingResult;
                    } else {
                        mutableMap.set(keyDecodingResult.right, valueDecodingResult.right);
                    }
                }
            }

            return Decoder.success(mutableMap.asImmutable());
        }
    });