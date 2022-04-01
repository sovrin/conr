<h1 align="left">conr</h1>

[![npm version][npm-src]][npm-href]
[![types][types-src]][types-href]
[![size][size-src]][size-href]
[![coverage][coverage-src]][coverage-href]
[![vulnerabilities][vulnerabilities-src]][vulnerabilities-href]
[![dependencies][dep-src]][dep-href]
[![License][license-src]][license-href]

> small and loose dependency injection library

## Installation
```bash
$ npm i conr
```

## Usage
```js
import conr from 'conr';

const instance = conr();
instance.set('foo', 'Hello');
instance.set('bar', 'World');
instance.set('name', (name) => `My name is ${name}.`);

instance.resolve((foo, bar) => {
    console.log(foo, bar); // Hello, World
});

instance.resolve(async ({foo, name}) => {
    console.log(foo, name('John Doe')); // Hello, My name is John Doe.
})
```

## Licence
MIT License, see [LICENSE](./LICENSE)

[npm-src]: https://badgen.net/npm/v/conr
[npm-href]: https://www.npmjs.com/package/conr
[size-src]: https://badgen.net/packagephobia/install/conr
[size-href]: https://packagephobia.com/result?p=conr
[types-src]: https://badgen.net/npm/types/conr
[types-href]: https://www.npmjs.com/package/conr
[coverage-src]: https://coveralls.io/repos/github/sovrin/conr/badge.svg?branch=master
[coverage-href]: https://coveralls.io/github/sovrin/conr?branch=master
[vulnerabilities-src]: https://snyk.io/test/github/sovrin/conr/badge.svg
[vulnerabilities-href]: https://snyk.io/test/github/sovrin/conr
[dep-src]: https://img.shields.io/librariesio/release/npm/conr
[dep-href]: https://img.shields.io/librariesio/release/npm/conr
[license-src]: https://badgen.net/github/license/sovrin/conr
[license-href]: LICENSE
