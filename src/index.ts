export namespace Base32 {
    const enum Alphabets {
        RFC4648 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
        RFC4648_HEX = '0123456789ABCDEFGHIJKLMNOPQRSTUV',
        CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ',
    }   

    export type Variant = 'RFC3548' | 'RFC4648' | 'RFC4648-HEX' | 'Crockford';

    /**
     * Encodes an ArrayBuffer in base32
     * 
     * @param buffer Buffer to encode
     * @param variant Base32 encoding format
     * @returns The base32 encoded ArrayBuffer
     */
    export function encode(buffer: ArrayBuffer, variant: Variant = 'RFC4648'): string {
        let alphabet: string;
        let defaultPadding: boolean;

        switch (variant) {
            case 'RFC3548':
            case 'RFC4648':
                alphabet = Alphabets.RFC4648;
                defaultPadding = true;
                break;
            case 'RFC4648-HEX':
                alphabet = Alphabets.RFC4648_HEX;
                defaultPadding = true;
                break;
            case 'Crockford':
                alphabet = Alphabets.CROCKFORD;
                defaultPadding = false;
                break;
            default:
                throw new Error(`Unknown base32 variant: ${variant}`);
        }

        const length = buffer.byteLength
        const array = new Uint8Array(buffer);

        let bits = 0;
        let value = 0;
        let output = '';

        for (let i = 0; i < length; i++) {
            value = (value << 8) | array[i];
            bits += 8;

            while (bits >= 5) {
                output += alphabet[(value >>> (bits - 5)) & 31];
                bits -= 5;
            }
        }

        if (bits > 0) {
            output += alphabet[(value << (5 - bits)) & 31]
        }

        if (defaultPadding) {
            while (output.length % 8 !== 0) {
                output += '=';
            }
        }

        return output;
    }


    /**
     * Decodes a base32 encoded string
     * 
     * @param input The base32 encoded string to decode
     * @param variant Base32 encoding format
     * @returns The decoded string as an ArrayBuffer
     */
    export function decode(input: string, variant: Variant = 'RFC4648'): ArrayBuffer {
        let alphabet: string;
        let cleanedInput: string;

        switch (variant) {
            case 'RFC3548':
            case 'RFC4648':
                alphabet = Alphabets.RFC4648;
                cleanedInput = input.toUpperCase().replace(/\=+$/, '');
                break;
            case 'RFC4648-HEX':
                alphabet = Alphabets.RFC4648_HEX;
                cleanedInput = input.toUpperCase().replace(/\=+$/, '');
                break;
            case 'Crockford':
                alphabet = Alphabets.CROCKFORD;
                cleanedInput = input
                    .toUpperCase()
                    .replace(/0/g, '')
                    .replace(/[IL]/g, '1');
                break;
            default:
                throw new Error(`Unknown base32 variant: ${variant}`);
        }

        const length = cleanedInput.length;
        const output = new Uint8Array(((length * 5) / 8) | 0);
                
        let bits = 0;
        let value = 0;
        let index = 0;

        for (let i = 0; i < length; i++) {
            value = (value << 5) | readChar(alphabet, cleanedInput[i]);
            bits += 5;

            if (bits >= 8) {
                output[index++] = (value >>> (bits - 8)) & 255;
                bits -= 8;
            }
        }

        return output.buffer;
    }


    /**
     * Finds a char index in an alphabet
     * 
     * @param alphabet The alphbet
     * @param char The char to find
     * @returns The char index in the alphabet
     */
    function readChar(alphabet: string, char: string): number {
        const idx = alphabet.indexOf(char);

        if (idx === -1) {
            throw new Error(`Invalid character found: ${char}`);
        }

        return idx;
    }
}
