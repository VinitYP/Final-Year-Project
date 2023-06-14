//https://eth-goerli.g.alchemy.com/v2/LjQH9QJr0LEsqMPecz9ze85mp-c5E-IS

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/LjQH9QJr0LEsqMPecz9ze85mp-c5E-IS',
      accounts: ['401dfcb153d7f0e0b1b6d59206f4568b4fb20ec7e1b4df32259442372591cfde']  // eslint-disable-line disable or delete before share
    }
  }
}

