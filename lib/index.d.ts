export declare namespace Base32 {
    type Variant = 'RFC3548' | 'RFC4648' | 'RFC4648-HEX' | 'Crockford';
    /**
     * Encodes an ArrayBuffer in base32
     *
     * @param buffer Buffer to encode
     * @param variant Base32 encoding format
     * @returns The base32 encoded ArrayBuffer
     */
    function encode(buffer: ArrayBuffer, variant?: Variant): string;
    /**
     * Decodes a base32 encoded string
     *
     * @param input The base32 encoded string to decode
     * @param variant Base32 encoding format
     * @returns The decoded string as an ArrayBuffer
     */
    function decode(input: string, variant?: Variant): ArrayBuffer;
}
