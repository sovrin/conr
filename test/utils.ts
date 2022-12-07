import {Result} from '../src';
import {Type} from '../src/parser';
import assert from 'assert';

/**
 *
 * @param result
 * @param types
 * @param values
 */
export const test = (result: Result[], types: Type[], values: any[][]) => {
    result.forEach((entry, i) => {
        assert.equal(entry.type, types[i]);

        if (!values[i]) {
            return;
        }

        values[i].forEach((value, j) => {
            if (entry.type === Type.OBJECT) {
                //@ts-ignore
                assert.equal(entry.result[j].result, value);
            } else {
                assert.equal(entry.result, value);
            }
        });
    });
};
