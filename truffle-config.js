



const HDWalletProvider = require("@truffle/hdwallet-provider");
const keys = require("./keys.json");


// const { INFURA_API_KEY, MNEMONIC } = process.env





module.exports = {
  contracts_build_directory: "public/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: keys.MNEMONIC,
          },
          providerOrUrl: `https://sepolia.infura.io/v3/${keys.INFURA_PROJECT_ID}`,
          addressIndex: 0,
          // pollingInterval: 8000,
        }),

      network_id: 11155111,
      gas: 5500000, //Gas Limit- how much gas we are willing to spend
      // gasPrice: 50000000000, // how much we are willing to spend for a unit if gas
      // confirmations: 2, // number of blocks to wait between deployments
      // timeoutBlocks: 200, // number of blocks before deployment times out
      networkCheckTimeout: 100000,
      skipDryRun: true
    },

    // sepolia: {
    //   provider: () => new HDWalletProvider(MNEMONIC, INFURA_API_KEY),
    //   network_id: "11155111",
    //   gas: 5500000,
    // },
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.4",
    },
  },
};


//  download  HDWalletProvider dependency

// 5500000 * 20000000000 = 110000000000000000 = 0.11 ETH

// https://sepolia.infura.io/v3/14387412b6f1459084bc7f2a94a0fb38

// wss://sepolia.infura.io/ws/v3/14387412b6f1459084bc7f2a94a0fb38


