import assert from 'assert';
import container from '../src';

describe('conr', () => {

    describe('example', () => {
        const instance = container();
        instance.set('foo', 'Hello');
        instance.set('bar', 'World');
        instance.set('name', (name) => `My name is ${name}.`);

        it('should return values', () => {
            instance.resolve((foo, bar) => {
                assert(foo === 'Hello');
                assert(bar === 'World');
            });

            instance.resolve(async ({foo, name}) => {
                assert(foo === 'Hello');
                assert(name('John Doe') === 'My name is John Doe.');
            });
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
    });

    describe('reset', () => {
        it('should remove foo fn', () => {
            const instance = container();
            const foo = () => {};

            instance.set('foo', foo);
            assert(instance.get('foo') === foo);

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
                    assert(Object.keys(this).length === 0);
                };

                instance.resolve(emptyFn);
                assert(emptyFn.length === 0);
            });
        });

        describe('with empty named function', () => {
            it('should return nothing', () => {
                function emptyFn() {
                    // meh
                    assert(arguments.length === 0);
                }

                instance.resolve(emptyFn);
                assert(emptyFn.length === 0);
            });
        });

        describe('with empty named inline function', () => {
            it('should return nothing', () => {
                instance.resolve(function bar() {
                    assert(arguments.length === 0);
                });
            });
        });

        describe('with named inline function', () => {
            it('should return foo fn', () => {
                instance.resolve(function bar(foo) {
                    assert(foo === fooFn);
                });
            });
        });

        describe('with empty unnamed inline function', () => {
            it('should return nothing', () => {
                instance.resolve(function () {
                    assert(arguments.length === 0);
                });
            });
        });

        describe('with empty named inline function', () => {
            it('should return foo fn', () => {
                instance.resolve(function bar(foo) {
                    assert(foo === fooFn);
                });
            });
        });

        describe('with async named inline function and one argument', () => {
            it('should return foo fn', () => {
                instance.resolve(async function bar(foo) {
                    assert(foo === fooFn);
                });
            });
        });

        describe('with async unnamed inline function and one argument', () => {
            it('should return foo fn', () => {
                instance.resolve(async function (foo) {
                    assert(foo === fooFn);
                });
            });
        });

        describe('with async arrow function and one argument', () => {
            it('should return foo fn', () => {
                instance.resolve(async (foo) => {
                    assert(foo === fooFn);
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
                        assert(f00 === fooFn);
                    });
                });
            });

            describe('without parenthesis', () => {
                it('should return foo fn', () => {
                    instance.resolve(foo => {
                        assert(foo === fooFn);
                    });
                });
            });

            describe('with parenthesis', () => {
                it('should return foo fn', () => {
                    instance.resolve((foo) => {
                        assert(foo === fooFn);
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
                        assert(foo === fooFn);
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
                        assert(foo === fooFn);
                        assert(bar === barFn);
                        assert(biz === bizFn);
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
                        assert(foo === fooFn);
                        assert(bar === barFn);
                        assert(biz === bizFn);
                    });
                });

                it('should return foo, undefined, bar, biz fn', () => {
                    instance.resolve((foo, none, {bar, biz}) => {
                        assert(foo === fooFn);
                        assert(none == null);
                        assert(bar === barFn);
                        assert(biz === bizFn);
                    });
                });

                it('should return foo, undefined, bar fn', () => {
                    instance.resolve(({foo}, none, bar) => {
                        assert(foo === fooFn);
                        assert(none == null);
                        assert(bar === barFn);
                    });
                });
            });
        });

        describe('with complex signature', () => {
            it('should return foo, bar fn', () => {
                const tester = (fn) => fn();

                instance.resolve((foo, bar) => tester(function () {
                    assert(foo === fooFn);
                    assert(bar === barFn);
                }));
            });
        });

        describe('with weird new lines', () => {
            it('should return foo, bar fn', () => {

                instance.resolve((
                    foo
                        ,
                            bar
                ) => function () {
                    assert(foo === fooFn);
                    assert(bar === barFn);
                });

                const tester = (fn) => fn();

                instance.resolve((
                    foo     ,
                        bar     ,
                ) => tester(function () {
                    assert(foo === fooFn);
                    assert(bar === barFn);
                }));
            });
        });

        describe('with implicit return', () => {
            it('should return foo, bar fn', () => {
                const {foo, bar, none} = instance.resolve((({foo, bar, none}) => ({
                    foo,
                }))) as any;

                assert(foo === fooFn);
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

                assert(foo === fooFn);
                assert(bar == barFn);
                assert(none == undefined);
            });

            it('should not be influenced by return value', () => {
                const string = instance.resolve((({foo, none}, bar,) => 'foo'));
                const fn = instance.resolve((({foo, none}, bar,) => foo));
                const array = instance.resolve<any[]>((({foo, none}, bar,) => [foo, bar]));

                assert(string === 'foo');
                assert(fn === fooFn);
                assert(array.length === 2);
                assert(array[0] === fooFn);
                assert(array[1] === barFn);
            });

            it('should not be influenced by dangling comas', () => {
                const string = instance.resolve((({foo,}, bar,) => 'foo'));

                assert(string === 'foo');
            });
        });
    });
});
