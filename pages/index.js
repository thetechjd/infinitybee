import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { useRef, useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Link from 'next/link';
import Head from 'next/head';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Input from '../components/Input'
import { useStatus } from "../context/statusContext";
import { connectWallet, getCurrentWalletConnected, getNFTPrice, getTotalMinted } from "../utils/interact.js";


import {initializeApp} from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendSignInLinkToEmail, signOut, sendEmailVerification} from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyACfUR1tmMLp0YRkVDBiRmMGJ5rdMuK_VY",
  authDomain: "beandbee-38cba.firebaseapp.com",
  projectId: "beandbee-38cba",
  storageBucket: "beandbee-38cba.appspot.com",
  messagingSenderId: "296445192075",
  appId: "1:296445192075:web:4da5127fe15743c82ab18e"
};

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: 'https://localhost:3000',
  // This must be true.
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.localhost.ios'
  },
  android: {
    packageName: 'com.localhost.android',
    installApp: true,
    minimumVersion: '12'
  },
  dynamicLinkDomain: 'localhost.page.link'
};


const app = initializeApp(firebaseConfig);
const auth = getAuth();


const contractABI = require("../pages/contract-abi.json");
const contractAddress = "0xC33a621432EAC8f537850b657CcDE0a4E250c984";





const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: "https://eth-mainnet.g.alchemy.com/v2/trNMW5_zO5iGvlX4OZ3SjVF-5hLNVsN5" // required
    }
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "Highlight Card", // Required
      rpc: "https://eth-mainnet.g.alchemy.com/v2/trNMW5_zO5iGvlX4OZ3SjVF-5hLNVsN5", // Optional if `infuraId` is provided; otherwise it's required
      chainId: 1, // Optional. It defaults to 1 if not provided
      darkMode: true // Optional. Use dark theme, defaults to false
    }
  }

};

//add provider






export default function Home() {

  //State variables
  const [provider, setProvider] = useState();
  const [walletAddress, setAddress] = useState();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState();


 


  const signUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log(user);
    sendEmailVerification(user);
    setUser(user);
    setUser({emailVerified: false})
    })
    
  
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
  }

  


  const signIn = () => {
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    setUser(user);
     console.log(user);
    setSuccess(true);
    
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
}

const logOut = () => {
  signOut(auth).then(() => {
    // Sign-out successful.
    setSuccess(false)
    setEmail("")
    setPassword("")
    
  }).catch((error) => {
    // An error happened.
  });
}
  



  /*
    function addWalletListener() {
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            setWallet(accounts[0]);
            setStatus("👆🏽 Write a message in the text-field above.");
          } else {
            setWallet("");
            setStatus("🦊 Connect to Metamask using the top right button.");
          }
        });
      } else {
        setStatus(
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        );
      }
    }*/

  async function connectWallet() {

    try {

      let web3Modal = new Web3Modal({
        theme: 'dark',
        cacheProvider: false,

        providerOptions,

      });
      const web3ModalInstance = await web3Modal.connect();
      const provider = new Web3(web3ModalInstance);
      if (web3ModalInstance) {
        setProvider(provider);
        const accounts = await provider.eth.getAccounts();
        const address = accounts[0];
        setAddress(address);


      }
    } catch (error) {
      console.error(error)
    }
  }

  const disconnect = () => {
    setAddress('')
  }


  const claimTicket = async (e) => {
    e.preventDefault();
    const nftContract = new provider.eth.Contract(
      contractABI,
      contractAddress
    )

    try {
      let tickets = await nftContract.methods.balanceOf(walletAddress, 1).call();
      if(tickets > 0){
        if(email.includes('@')){
          setErrorMessage('');
          await nftContract.methods.setApprovalForAll(contractAddress, true).send({from:walletAddress})
          .then(()=> {
            nftContract.methods.claimTicket(email).send({from: walletAddress})})
        } else {
          setErrorMessage('Please input a valid email address.')
        }
       
      } else {
        setErrorMessage('You have no tickets to redeem!')
      }
    } catch (error) {
      setErrorMessage('You have no tickets to redeem!');
    }

  }

  const buyTokens = async (usdt) => {
    setErrorMessage("");

    const total = usdt * 10**6;

    if(user){
      //Buy token logic

      console.log("You bought tokens!")
    } else {
     setErrorMessage('You must login first to redeem tokens');
     

     
    }
  } 




  




  





  return (
    <>
      <Head>
        <title>InfinityBee</title>
        <meta name="description" content="Infinity Bee Presale Dapp" />
        <link rel="icon" href="/" />
      </Head>

      <Header 
      setIsNavOpen={setIsNavOpen}
      isNavOpen={isNavOpen}
      />


      <section className="relative flex flex-wrap w-full justify-center md:items-start md:justify-start bg-royalblue mx-auto py-12 mt-10 relative z-10" id="">


        <div className='w-full h-full'>
          <div className='flex flex-col md:flex-row w-3/4 md:w-full m-auto mx-4 justify-between'>
          <div className='flex flex-col uppercase mx-4 m-auto w-full md:w-2/3 '>
          <h1 className="uppercase tracking-tighter text-5xl md:text-8xl justify-start text-start"><span className="text-6xl md:text-8xl">InfinityBee</span><br></br><span className="whitespace-nowrap">Token Presale</span></h1>
          <div className='md:flex flex-col mt-12 w-full hidden'>
            <h3 className="text-bluee text-2xl">The Currency of Be&Bee Ecosystem</h3>
              <h3 className='text-2xl'>Used Mainly On the First</h3>
              <h3 className='text-pinkk text-2xl'>Decentralized Crowdfunding Platform</h3>
              <h3 className='text-2xl'>In The World</h3>
              <h3 className='text-purplee text-2xl'>Based on a matrix system with referrals</h3>
          </div>
          
              </div>
              <div className='flex flex-row md:flex-col uppercase w-3/4 md:w-1/3 m-auto mx-8 max-h-[500px] items-start justify-center'>
              <img src='/images/beelogo.png' className='p-4 w-3/4 md:w-2/3 mx-auto justify-center'/>
              <div className='flex flex-col my-auto mx-4 md:mx-0 w-full text-center'>
              <p>Sold</p>
              <h3 className='text-2xl'>23.000.000</h3>
              <p>Remaining</p>
              <h3 className='text-2xl'>67.000.000</h3>
              </div>
              </div>
         
          </div>
          
          <div className='flex flex-row justify-between m-auto mx-4 px-8'>
            <div className='flex flex-col uppercase'>
              
            </div>
            <div className='flex flex-col px-8 mx-8 text-2xl text-center'>
              
            </div>
          </div>
        </div>
        <div id='adventurer' className='w-full my-10'>
          <h2 className='text-center uppercase text-6xl my-5'>Adventurer Levels</h2>
          <div className="w-full flex flex-col">
          <div className='flex flex-col w-full mx-auto md:flex-row justify-around'>
            <div className='flex flex-col w-full md:w-1/3'>
              <img src='/images/mercury.png' className='flex h-[200px] my-3 mx-auto justify-center'/>
              <button onClick={() => {buyTokens(200)}}className='flex w-1/2 mx-auto bg-peach text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>200 USDT</button>
              {errorMessage &&(
              <div onClick={()=>{setErrorMessage("")}} className='flex justify-center m-auto p-4 my-2 bg-red-600 border-4 rounded-md border-white text-center items-center tracking-wider'>
              <p className='text-white'>{errorMessage}</p>
            </div>
            )}
            </div>
            <div className='flex flex-col w-full md:w-1/3'>
              <img src='/images/mars.png' className='flex h-[200px] my-3 mx-auto justify-center'/>
              <button onClick={() => {buyTokens(500)}} className='flex w-1/2 mx-auto bg-peach text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>500 USDT</button>
            </div>
            <div className='flex flex-col w-full md:w-1/3'>
              <img src='/images/venus.png' className='flex h-[200px] my-3 mx-auto justify-center'/>
              <button onClick={() => {buyTokens(1100)}} className='flex w-1/2 mx-auto bg-peach text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>1.100 USDT</button>
            </div>
          </div>
          
          </div>
        </div>
        <div id='master' className='w-full my-10'>
          <h2 className='text-center uppercase text-6xl my-5'>Master Levels</h2>
          <div className="w-full flex flex-col">
          <div className='flex flex-col w-full mx-auto md:flex-row justify-around'>
          <div className='flex flex-col w-full md:w-1/3'>
              <img src='/images/earth.png' className='flex h-[200px] my-3 mx-auto justify-center'/>
              <button onClick={() => {buyTokens(2300)}} className='flex w-1/2 mx-auto bg-peach text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>2.300 USDT</button>
            </div>
            <div className='flex flex-col w-full md:w-1/3'>
              <img src='/images/neptune.png' className='flex h-[200px] my-3 mx-auto justify-center'/>
              <button onClick={() => {buyTokens(5000)}} className='flex w-1/2 mx-auto bg-peach text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>5.000 USDT</button>
            </div>
            <div className='flex flex-col w-full md:w-1/3'>
              <img src='/images/uranus.png' className='flex h-[200px] my-3 mx-auto justify-center'/>
              <button onClick={() => {buyTokens(11000)}} className='flex w-1/2 mx-auto bg-peach text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>11.000 USDT</button>
            </div>
           
          </div>

          </div>
         
        </div>
        <div id='legend' className='w-full my-10'>
          <h2 className='text-center uppercase text-6xl my-5'>Legend Levels</h2>
          <div className="w-full flex flex-col">
          <div className='flex flex-col w-full mx-auto md:flex-row justify-around'>
          <div className='flex flex-col w-full md:w-1/2'>
              <img src='/images/saturn.png' className='flex h-[200px] my-3 mx-auto justify-center'/>
              <button onClick={() => {buyTokens(23000)}} className='flex w-1/2 md:w-1/3 mx-auto bg-peach text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>23.000 USDT</button>
            </div>
            <div className='flex flex-col w-full md:w-1/2'>
              <img src='/images/jupiter.png' className='flex h-[200px] my-3 mx-auto justify-center'/>
              <button onClick={() => {buyTokens(48000)}} className='flex w-1/2 md:w-1/3 mx-auto bg-peach text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>48.000 USDT</button>
            </div>
            
           
          </div>

          </div>

          
        </div>
        
      </section>
            








            {/* Total:  {nftPrice} + Gas */}
            {/* Mint Status */}
            {/* {status && (
      <div className="flex items-center justify-center">
        {status}
      </div>
    )} */}



            {/* Right Hero Section - Video/Image Bird PASS */}

        

      {/* Content + footer Section */}

    </>
  )
}

