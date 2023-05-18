import assert from 'assert';
import container from '../src';

describe('conr', () => {
    describe('example', () => {
        const instance = container();
        instance.set('foo', 'Hello');
        instance.set('bar', 'World');
        instance.set('name', (name) => `My name is ${name}.`);

        it('should return values', () => {
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

                const [arg] = this;
                assert.equal(arg, args);
            }, args);
        })
    })

    describe('get/set', () => {
        const instance = container();
        const foo = () => {};

        it('should return null', () => {
            assert(instance.get('foobar') == null);
        });

        it('should return ressource for key', () => {
            instance.set('foo', foo);

            assert(instance.get('foo') == foo);
        });

        it('should return context for function chaining', () => {
            instance.set('first', 'foo')
                .set('second', 'bar')
                .set('name', 'John Doe')
            ;

            assert(instance.get('first') == 'foo');
            assert(instance.get('second') == 'bar');
            assert(instance.get('name') == 'John Doe');
        });
    });

    describe('reset', () => {
        it('should remove foo fn', () => {
            const instance = container();
            const foo = () => {};

            instance.set('foo', foo);
            assert.equal(instance.get('foo'), foo);

            instance.reset();
            assert(instance.get('foo') == null);
        });
    });

    describe('resolve', () => {
        const instance = container();
        const fooFn = () => {};
        const barFn = () => {};
        const bizFn = () => {};
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
            it('should provide args from this', () => {
                const args = {test: 'foo'};

                instance.resolve(function bar(foo, bar) {
                    const [first] = this;
                    assert.equal(first, args);

                    assert.equal(foo, fooFn);
                    assert.equal(bar, barFn);
                }, args);
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
                        assert(none == null);
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
                        assert(none == null);
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
                        assert(none == null);
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
                        assert(none == null);
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
                        assert(none == null);
                        assert.equal(bar, barFn);
                        assert.equal(biz, bizFn);
                    });
                });

                it('should return foo, undefined, bar fn', () => {
                    instance.resolve(({foo}, none, bar) => {
                        assert.equal(foo, fooFn);
                        assert(none == null);
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
                assert(bar == undefined);
                assert(none == undefined);
            });

            it('should ignore weird indentation and parenthesis', () => {
                const {foo, bar, none} = instance.resolve((({
                                                                foo,
                                                                none
                                                            },
                                                            bar
                ) => (((
                    ((
                        ({
                            foo,
                                bar,
                            })
                        ))
                    ))
                ))) as any;

                assert.equal(foo, fooFn);
                assert(bar == barFn);
                assert(none == undefined);
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
    });
});
