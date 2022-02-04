import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import fs from "fs";
dotenv.config();


const mnemonic = fs.existsSync('.secret')
  ? fs
      .readFileSync('.secret')
      .toString()
      .trim()
  : 'test test test test test test test test test test test junk';

const infuraKey = process.env.INFURA_KEY;
const etherscanKey = process.env.ETHERSCAN_KEY;


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.7.0",
      },
      {
        version: "^0.5.0",
      },
      {
        version: "0.8.4",
      },
      {
        version: "^0.6.6",
       // settings: {},
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        enabled: process.env.FORK === 'true',
          url: `https://mainnet.infura.io/v3/c946d344b8664843b919e16db8aa9baa`,
        //url: `https://eth-mainnet.alchemyapi.io/v2/SR-wBhpxMirgFtp4OGeJoWKO1ObmVeFg`,
         //url: "https://eth-mainnet.alchemyapi.io/v2/aZE8GWssF3gJnNBD7-8I33RKlru_Zx0L",
        //url: 'https://mainnet.infura.io/v3/9a1eacc6b18f436dab839c1713616fd1'
        //blockNumber: 11380080, 
      },
      initialBaseFeePerGas: 0, // workaround for eip-1559 (solidity-coverage)
      gas: 2100000,
      gasPrice: 8000000000
    },
     localhost: {
      url: `http://127.0.0.1:8545`,
      accounts: {
       mnemonic
     }
   },
    rinkeby: {
       url: `https://rinkeby.infura.io/v3/${infuraKey}`,
       accounts: {
        mnemonic
      }
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${infuraKey}`,
      accounts: {
        mnemonic
      }
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${infuraKey}`,
      accounts: {
        mnemonic
      }
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
