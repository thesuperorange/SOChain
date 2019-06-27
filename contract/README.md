## How to test

install truffle

```
$ npm i -g truffle

// check truffle's version

$ truffle version
Truffle v4.1.7 (core: 4.1.7)
Solidity v0.4.23 (solc-js)

$ cd cert-contract
$ npm i
$ link ../common
$ npm run test:all
```

build artifact json for export in index.js

```
$ truffle compile
```


## Initial setup

http://truffleframework.com/tutorials/robust-smart-contracts-with-openzeppelin

```
mkdir cert-contract && cd cert-contract
truffle ubox tutorialtoken
truffle compile
```