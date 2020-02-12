import 'mocha';
import { expect } from 'chai';
import { Base32 } from '../src';
import { TEST_CASES, CROCKFORD_EXTRAS } from './data.test';


describe('base32', () => {
    describe('encode', () => {
        TEST_CASES.forEach(([variant, input, expected]) => {
            it(`should encode ${input} for ${variant} variant`, () => {
                expect(Base32.encode(hexToArrayBuffer(input), variant as Base32.Variant)).to.equal(expected);
            });
        });

        it('should throw an error for an invalid variant', () => {
            expect(() => Base32.encode(Buffer.from('a'), 'wrong' as Base32.Variant)).to.throw(Error, /Unknown base32 variant/);
        });
    });

    describe('decode', () => {
        TEST_CASES.forEach(([variant, input, expected]) => {
            it(`should decode ${expected} for ${variant} variant`, () => {
                expect(Base32.decode(expected, variant as Base32.Variant)).to.be.deep.equal(hexToArrayBuffer(input));
            });
        });

        CROCKFORD_EXTRAS.forEach(([variant, input, expected]) => {
            it(`should decode ${expected} for ${variant} variant`, () => {
                expect(Base32.decode(expected, variant as Base32.Variant)).to.be.deep.equal(hexToArrayBuffer(input));
            });
        });

        it('should be binary safe', () => {
            const code = 'f61e1f998d69151de8334dbe753ab17ae831c13849a6aecd95d0a4e5dc25';
            const encoded = '6YPB7GMNNEKR32BTJW7HKOVRPLUDDQJYJGTK5TMV2CSOLXBF';
            expect(Base32.encode(Buffer.from(code, 'hex')).toString()).to.equal(encoded);
            expect(Buffer.from(Base32.decode(encoded)).toString('hex')).to.equal(code);
        });

        it('should throw an error for invalid variant', () => {
            expect(() => Base32.decode('ME======', 'wrong' as Base32.Variant)).to.throw(Error, /Unknown base32 variant/);
        });

        it('should throw an error for invalid encoding chars', () => {
            expect(() => Base32.decode('M😴')).to.throw(Error, /Invalid character found/);
        });
    });
});

/**
 * Turn a string of hexadecimal characters into an ArrayBuffer
 */
function hexToArrayBuffer(hex: string): ArrayBuffer {
    if (hex.length % 2 !== 0) {
        throw new RangeError('Expected string to be an even number of characters');
    }

    const view = new Uint8Array(hex.length / 2);

    for (let i = 0; i < hex.length; i += 2) {
        view[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }

    return view.buffer;
}
