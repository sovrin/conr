import parser, {Type} from '../src/parser';
import {test} from './utils';

describe('conr', () => {
    describe('parser', () => {
        describe('different combinations', () => {
            it('should parse string correctly', () => {
                const {parse} = parser();

                test(parse('foo'), [Type.VARIABLE], [['foo']]);
                test(parse('{foo}'), [Type.OBJECT], [['foo']]);
                test(parse('{foo,bar}'), [Type.OBJECT], [['foo', 'bar']]);
                test(parse('{foo,bar,biz}'), [Type.OBJECT], [['foo', 'bar', 'biz']]);
                test(parse('foo,{bar,biz}'), [Type.VARIABLE, Type.OBJECT], [['foo'], ['bar', 'biz']]);
                test(parse('foo , { bar , biz }'), [Type.VARIABLE, Type.OBJECT], [['foo'], ['bar', 'biz']]);
                test(parse('foo , {bar ,biz}'), [Type.VARIABLE, Type.OBJECT], [['foo'], ['bar', 'biz']]);
                test(parse('{foo,bar},biz'), [Type.OBJECT, Type.VARIABLE], [['foo', 'bar'], ['biz']]);
                test(parse('{foo},bar,{biz}'), [Type.OBJECT, Type.VARIABLE, Type.OBJECT], [['foo'], ['bar'], ['biz']]);
            });
        });
    });
});
