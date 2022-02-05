import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";

import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-contract-sizer";
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
        version: "0.8.4",
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        enabled: process.env.FORK === 'true',
          url: `https://mainnet.infura.io/v3/c946d344b8664843b919e16db8aa9baa`,
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
  contractSizer: {
    alphaSort: true,
    runOnCompile: process.env.COVERAGE ? false: true,
    disambiguatePaths: false,
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 43,
    enabled: true,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
