import * as Decoder from "io-ts/lib/Decoder";

export const undefinedAsNullDecoder: <A>(decoder: Decoder.Decoder<unknown, A>) => Decoder.Decoder<unknown, A | null> =
    <A>(decoder: Decoder.Decoder<unknown, A>) => ({
        decode: (i: unknown) =>
            i === undefined
                ? Decoder.success(null)
                : decoder.decode(i)
    })