//https://eth-goerli.g.alchemy.com/v2/LjQH9QJr0LEsqMPecz9ze85mp-c5E-IS

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/LjQH9QJr0LEsqMPecz9ze85mp-c5E-IS',
      accounts: ['']  // eslint-disable-line disable or delete before share
    }
  }
}

