import assert from 'assert';
import container from '../src';

describe('conr', () => {

    const assertType = <T>(expression: T) => {
        // Do nothing, the TypeScript compiler handles this for us
    };

    describe('example', () => {
        type Container = {
            foo: string;
            bar: string;
            name: (name: string) => string;
        }

        const instance = container<Container>();
        instance.init({
            foo: 'Hello',
            bar: 'World',
            name: () => ``
        });

        instance.set('name', (name) => `My name is ${name}.`);

        it('should return values', (done) => {
            const args = {
                "fizz": "buzz"
            }

            instance.resolve((foo, bar) => {
                assert.equal(foo, 'Hello');
                assert.equal(bar, 'World');
            });

            instance.resolve(async function ({foo, name}) {
                assert.equal(foo, 'Hello');
                assert.equal(name('John Doe'), 'My name is John Doe.');
                assert.equal(this, args);

                done();
            }, args);
        })
    })

    describe('types', () => {
        const foo = () => {};
        const bar = () => [];

        type FancyType = {
            foo: typeof foo,
            bar: typeof bar,
            someString: string,
            someNumber: number,
        }

        const instance = container<FancyType>();
        instance.set('bar', bar);
        instance.init({
            foo,
            someString: 'Hello',
            someNumber: 42,
        });

        it('types should match', () => {
            const tuple = instance.resolve(({foo}) => {
                return [
                    foo,
                    2
                ] as const;
            });

            assertType<readonly [typeof foo, number]>(tuple);

            const number = instance.get('someNumber');
            assertType<number>(number);

            instance.set('anotherNumber', 42);
            instance.set('anotherNumber', 42);
        });
    });

    describe('init', () => {
        it('should properly initialise container', () => {
            const foo = () => {};
            const bar = () => {};


            const instance = container().init({
                'foo': foo,
                'bar': bar,
            });

            assert.equal(instance.get('foo'), foo);
            assert.equal(instance.get('bar'), bar);
        });
    })

    describe('get/set', () => {
        const instance = container();
        const foo = () => {
        };

        it('should return null', () => {
            assert.equal(instance.get('foobar'), null);
        });

        it('should return ressource for key', () => {
            instance.set('foo', foo);

            assert.equal(instance.get('foo'), foo);
        });

        it('should return nested ressource for key', () => {
            instance.set('nested', {
                'foo': 'bar',
                'bar': 'baz',
            })

            assert.equal(instance.get('nested').foo, 'bar');
        });

        it('should return context for function chaining', () => {
            instance.set('first', 'foo')
                .set('second', 'bar')
                .set('name', 'John Doe')
            ;

            assert.equal(instance.get('first'), 'foo');
            assert.equal(instance.get('second'), 'bar');
            assert.equal(instance.get('name'), 'John Doe');
        });
    });

    describe('reset', () => {
        it('should remove foo fn', () => {
            const instance = container();
            const foo = () => {};

            instance.set('foo', foo);
            assert.equal(instance.get('foo'), foo);

            instance.reset();
            assert.equal(instance.get('foo'), null);
        });
    });

    describe('resolve', () => {
        const instance = container();
        const fooFn = () => {
        };
        const barFn = () => {
        };
        const bizFn = () => {
        };
        instance.set('foo', fooFn);
        instance.set('f00', fooFn);
        instance.set('bar', barFn);
        instance.set('biz', bizFn);

        describe('with empty arrow function', () => {
            it('should return nothing', () => {
                const emptyFn = () => {
                    // meh
                    assert.equal(Object.keys(this).length, 0);
                };

                instance.resolve(emptyFn);
                assert.equal(emptyFn.length, 0);
            });
        });

        describe('with async empty arrow function', () => {
            it('should return nothing', () => {
                const emptyFn = async () => {
                    // meh
                    assert.equal(Object.keys(this).length, 0);
                };

                instance.resolve(emptyFn);
                assert.equal(emptyFn.length, 0);
            });
        });

        describe('with empty named function', () => {
            it('should return nothing', () => {
                function emptyFn() {
                    // meh
                    assert.equal(arguments.length, 0);
                }

                instance.resolve(emptyFn);
                assert.equal(emptyFn.length, 0);
            });
        });

        describe('with additional parameters', () => {
            describe('with resolvable functions', () => {
                it('should provide args from this', () => {
                    const args = {test: 'foo'};

                    instance.resolve(function bar(foo, bar) {
                        assert.equal(this, args);

                        assert.equal(foo, fooFn);
                        assert.equal(bar, barFn);
                    }, args);
                });
            });

            // describe('with nested resources functions', () => {
            //     it('should provide args from this', () => {
            //         instance.set('nested', {
            //             'foo': 'bar',
            //             'bar': 'baz',
            //         })
            //
            //         instance.resolve(({foo: {bar}}) => {
            //             console.info(bar);
            //         });
            //     });
            // });
            //
            // describe('with resolvable async functions', () => {
            //     it('should provide args from this', () => {
            //         const args = {test: 'foo'};
            //
            //         instance.resolve(async function bar(foo, bar) {
            //             assert.equal(this, args);
            //
            //             assert.equal(foo, fooFn);
            //             assert.equal(bar, barFn);
            //         }, args);
            //     });
            // });

            describe('with unresolvable functions', () => {
                it('should provide args from this', () => {
                    const args = {test: 'foo'};

                    instance.resolve(function bar() {
                        assert.equal(this, args);
                    }, args);
                });
            });
        });

        describe('with empty named inline function', () => {
            it('should return nothing', () => {
                instance.resolve(function bar() {
                    assert.equal(arguments.length, 0);
                });
            });
        });

        describe('with named inline function', () => {
            it('should return foo fn', () => {
                instance.resolve(function bar(foo) {
                    assert.equal(foo, fooFn);
                });
            });
        });

        describe('with empty unnamed inline function', () => {
            it('should return nothing', () => {
                instance.resolve(function () {
                    assert.equal(arguments.length, 0);
                });
            });
        });

        describe('with empty named inline function', () => {
            it('should return foo fn', () => {
                instance.resolve(function bar(foo) {
                    assert.equal(foo, fooFn);
                });
            });
        });

        describe('with async named inline function and one argument', () => {
            it('should return foo fn', () => {
                instance.resolve(async function bar(foo) {
                    assert.equal(foo, fooFn);
                });
            });
        });

        describe('with async unnamed inline function and one argument', () => {
            it('should return foo fn', () => {
                instance.resolve(async function (foo) {
                    assert.equal(foo, fooFn);
                });
            });
        });

        describe('with async arrow function and one argument', () => {
            it('should return foo fn', () => {
                instance.resolve(async (foo) => {
                    assert.equal(foo, fooFn);
                });
            });
        });

        describe('with arrow function and one argument', () => {
            describe('with unknown resource', () => {
                it('should return nothing', () => {
                    instance.resolve(none => {
                        assert.equal(none, null);
                    });
                });
            });

            describe('with numbers in argument', () => {
                it('should return foo fn', () => {
                    instance.resolve((f00) => {
                        assert.equal(f00, fooFn);
                    });
                });
            });

            describe('without parenthesis', () => {
                it('should return foo fn', () => {
                    instance.resolve(foo => {
                        assert.equal(foo, fooFn);
                    });
                });
            });

            describe('with parenthesis', () => {
                it('should return foo fn', () => {
                    instance.resolve((foo) => {
                        assert.equal(foo, fooFn);
                    });
                });

                it('should return nothing', () => {
                    instance.resolve((none) => {
                        assert.equal(none, null);
                    });
                });
            });

            describe('with object deconstruction and one property', () => {
                it('should return foo fn', () => {
                    instance.resolve(({foo}) => {
                        assert.equal(foo, fooFn);
                    });
                });

                it('should return nothing', () => {
                    instance.resolve(({none}) => {
                        assert.equal(none, null);
                    });
                });
            });

            describe('with object deconstruction and multiple properties', () => {
                it('should return foo, bar, biz fn', () => {
                    instance.resolve(({foo, bar, biz}) => {
                        assert.equal(foo, fooFn);
                        assert.equal(bar, barFn);
                        assert.equal(biz, bizFn);
                    });
                });

                it('should return nothing', () => {
                    instance.resolve(({foo, bar, biz}, none) => {
                        assert.equal(none, null);
                    });
                });
            });
        });

        describe('with arrow function and several arguments', () => {
            describe('with object deconstruction and multiple properties', () => {
                it('should return foo, bar, biz fn', () => {
                    instance.resolve((foo, {bar, biz}) => {
                        assert.equal(foo, fooFn);
                        assert.equal(bar, barFn);
                        assert.equal(biz, bizFn);
                    });
                });

                it('should return foo, undefined, bar, biz fn', () => {
                    instance.resolve((foo, none, {bar, biz}) => {
                        assert.equal(foo, fooFn);
                        assert.equal(none, null);
                        assert.equal(bar, barFn);
                        assert.equal(biz, bizFn);
                    });
                });

                it('should return foo, undefined, bar fn', () => {
                    instance.resolve(({foo}, none, bar) => {
                        assert.equal(foo, fooFn);
                        assert.equal(none, null);
                        assert.equal(bar, barFn);
                    });
                });
            });
        });

        describe('with complex signature', () => {
            it('should return foo, bar fn', () => {
                const tester = (fn) => fn();

                instance.resolve((foo, bar) => tester(function () {
                    assert.equal(foo, fooFn);
                    assert.equal(bar, barFn);
                }));

                instance.resolve(async (foo, bar) => tester(function () {
                    assert.equal(foo, fooFn);
                    assert.equal(bar, barFn);
                }));
            });

            it('should return foo via proxy fn', () => {
                const proxy = ({foo}) => foo;

                const foo = instance.resolve(proxy);
                assert.equal(foo, fooFn);
            });

            it('should return foo via async proxy fn', () => {
                const proxy = async ({foo}) => foo;

                instance.resolve<Promise<any>>(proxy).then((foo) => {
                    assert.equal(foo, fooFn);
                });
            });

            it('should return foo via nested async proxy fn', () => {
                const resolve = (fn) => {
                    instance.resolve<any>(fn).then(({foo}) => {
                        assert.equal(foo, fooFn);
                    });
                }

                resolve(async ({foo}) => foo);
            });
        });

        describe('with weird new lines', () => {
            it('should return foo, bar fn', () => {

                instance.resolve((
                    foo
                        ,
                            bar
                ) => function () {
                    assert.equal(foo, fooFn);
                    assert.equal(bar, barFn);
                });

                const tester = (fn) => fn();

                instance.resolve((
                    foo     ,
                        bar     ,
                ) => tester(function () {
                    assert.equal(foo, fooFn);
                    assert.equal(bar, barFn);
                }));
            });
        });

        describe('with implicit return', () => {
            it('should return foo, bar fn', () => {
                const {foo, bar, none} = instance.resolve((({foo, bar, none}) => ({
                    foo,
                }))) as any;

                assert.equal(foo, fooFn);
                assert.equal(bar, undefined);
                assert.equal(none, undefined);
            });

            it('should ignore weird indentation and parenthesis', () => {
                instance.resolve(({
                                      foo,
                                      none
                                  },
                                  bar
                ) => {
                    assert.equal(foo, fooFn);
                    assert.equal(bar, barFn);
                    assert.equal(none, undefined);
                });
            });

            it('should not be influenced by return value', () => {
                const string = instance.resolve((({foo, none}, bar,) => 'foo'));
                const fn = instance.resolve((({foo, none}, bar,) => foo));
                const array = instance.resolve<any[]>((({foo, none}, bar,) => [foo, bar]));

                assert.equal(string, 'foo');
                assert.equal(fn, fooFn);
                assert.equal(array.length, 2);
                assert.equal(array[0], fooFn);
                assert.equal(array[1], barFn);
            });

            it('should not be influenced by dangling comas', () => {
                const string = instance.resolve((({foo,}, bar,) => 'foo'));

                assert.equal(string, 'foo');
            });
        });

        describe('with aliased parameters', () => {
            it('should return foo fn', () => {
                instance.resolve(({foo: anotherFoo, bar: anotherBar}) => {
                    assert.equal(anotherFoo, fooFn);
                    assert.equal(anotherBar, barFn);
                });
            });
        });

        describe('unsupported syntaxes', () => {
            describe('TSX specific, returning same', () => {

            });

            it('should fail recognizing pattern', () => {
                instance.resolve(({foo: anotherFoo, bar: anotherBar}) => {
                    assert.equal(anotherFoo, fooFn);
                    assert.equal(anotherBar, barFn);
                });
            });
        });
    });
});
