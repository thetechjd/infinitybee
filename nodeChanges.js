


//In index.js AND BackOffice.js Change the node from this 

const web3 = createAlchemyWeb3('https://eth-sepolia.g.alchemy.com/v2/tZgBg81RgxE0pkpnQ6pjNpddJBd6nR_b');

//to this --->

const web3 = new Web3("https://bsc-dataseed1.binance.org");


//In index.js AND BackOffice.js Change the providerOptions from this 

const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        rpc: "https://eth-mainnet.g.alchemy.com/v2/trNMW5_zO5iGvlX4OZ3SjVF-5hLNVsN5" // required
        
      }
    }
}

//To this --->
const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        rpc: "https://bsc-dataseed1.binance.org" // required
        
      }
    }
}


//Under connectWallet function in index.js, change the network hex

let chainIdNum = getNetwork();
if (chainIdNum !== '0xaa36a7') {
  switchNetwork(web3ModalInstance);
}

//To this -->

let chainIdNum = getNetwork();
if (chainIdNum !== '0x38') {
  switchNetwork(web3ModalInstance);
}



//In switchNetwork function in index.js, change the chainId

const switchNetwork = async (web3modal) => {
    var chainId = 11155111
    //

    const provider = new Web3(web3modal)
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: provider.utils.toHex(chainId) }], // chainId must be in hexadecimal numbers
    });


  }

//To this -->

const switchNetwork = async (web3modal) => {
    var chainId = 56

    const provider = new Web3(web3modal)
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: provider.utils.toHex(chainId) }], // chainId must be in hexadecimal numbers
    });


  }






