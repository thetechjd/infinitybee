import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { useRef, useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Link from 'next/link';
import Head from 'next/head';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Input from '../components/Input'
import LoginModal from '../components/LoginModal'
import { useStatus } from "../context/statusContext";
import { connectWallet, getCurrentWalletConnected, getNFTPrice, getTotalMinted } from "../utils/interact.js";






import {initializeApp} from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendSignInLinkToEmail, signOut, sendEmailVerification} from 'firebase/auth';

import es from '../utils/es.json';
import fr from '../utils/fr.json';
import de from '../utils/de.json';
import cn from '../utils/cn.json';
import it from '../utils/it.json';
import ro from '../utils/ro.json';
import en from '../utils/en.json';



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
  const [variant, setVariant] = useState('login');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState();
  const [lang, setLang] = useState("EN");
  const [errorModal, setErrorModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [pwCheck, setPwCheck] = useState('');
  const [showPw, setShowPw] = useState(false)

  const [show, setShow] = useState(false);

  const togglePw = () => {
        setShow(!show)
    }



  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => currentVariant === 'login' ? 'register': 'login')
},[])
  


  useEffect(() => {
    const lngPref = localStorage.getItem("lang-pref")
    setLang(lngPref || 'EN')
  }, [])

  

  

  

  const setPreference = () => {
    localStorage.setItem("lang-pref", lang)
  }

  useEffect(() => {
    setPreference()
    console.log(`Preference changed to ${lang}!`)
  }, [lang])

  




    const translate = (text) => {
      if(lang === 'ES'){
        return es[text]
      } else if (lang === 'RO'){
        return ro[text]
      } else if (lang === 'CN'){
        return cn[text]
      } else if (lang === 'IT'){
        return it[text]
      } else if (lang === 'DE'){
        return de[text]
      }else if (lang === 'FR'){
        return fr[text]
      }
      else {
        return en[text]
      }
    }



    const showModal = () => {
      setErrorModal(!errorModal)
    }

    const showLoginModal = () => {
      setLoginModal(!loginModal);
    }


   

 

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
    showLoginModal(false)
  
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
    showLoginModal(false)
    
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
    disconnect();
    
  }).catch((error) => {
    // An error happened.
  });
}

const handlePassword = (value) => {
  setErrorMessage('')
  if(value.length < 8){
    setErrorMessage('Password must be at least 8 characters.')
  }  
    setPassword(value);
    
  

}

const handlePwCheck = (check) => {
  if (password !== check){
    setErrorMessage('Passwords don\'t match!')
  }
    setPwCheck(check)
  
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
    

    const total = usdt * 10**6;

    if(user && walletAddress){
      //Buy token logic

      console.log("You bought tokens!")
    } else {
     setErrorMessage('You must login first to redeem tokens');
     showModal();
     

     
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
      lang={lang}
      setLang={setLang}
      translate={translate}
      success={success}
      logOut={logOut}
      showLoginModal={showLoginModal}
      
  
      />

      {loginModal &&(
         <LoginModal 
         signUp={signUp}
         signIn={signIn}
         walletAddress={walletAddress}
         connectWallet={connectWallet}
         toggleVariant={toggleVariant}
         variant={variant}
         setEmail={setEmail}
         email={email}
         handlePassword={handlePassword}
         handlePwCheck={handlePwCheck}
         setPassword={setPassword}
         password={password}
         showLoginModal={showLoginModal}
         errorMessage={errorMessage}
         setErrorMessage={setErrorMessage}
         pwCheck={pwCheck}
         togglePw={togglePw}
         show={show}
        

         />
   
      )}
     

      <section style={{zIndex: loginModal  ? "-10": "0"}} className="relative flex flex-wrap w-full justify-center md:items-start md:justify-start bg-royalblue mx-auto py-12 mt-10 overflow-x-hidden" id="">


        <div style={{opacity: errorModal || loginModal  ? "10%": "100%" }} className='w-full h-full'>
          <div className='flex flex-col md:flex-row w-3/4 md:w-full m-auto mx-4 justify-between'>
          <div className='flex flex-col uppercase mx-4 m-auto w-full md:w-2/3 '>
          <h1 className="uppercase tracking-tighter text-5xl md:text-8xl justify-start text-start"><span className="text-6xl md:text-8xl">InfinityBee</span><br></br><span className="whitespace-nowrap">Token {translate("presale")}</span></h1>
          <div className='md:flex flex-col mt-12 w-full hidden'>
            <h3 className="text-bluee text-2xl">{translate("currency")}</h3>
              <h3 className='text-2xl'>{translate("used")}</h3>
              <h3 className='text-pinkk text-2xl'>{translate("decentralized")}</h3>
              <h3 className='text-2xl'>{translate("world")}</h3>
              <h3 className='text-purplee text-2xl'>{translate("matrix")}</h3>
          </div>
          
              </div>
              <div style={{opacity: errorModal || loginModal ? "10%": "100%"}} className='flex flex-row md:flex-col uppercase w-3/4 md:w-1/3 m-auto mx-8 max-h-[500px] items-start justify-center'>
              <img src='/images/beelogo.png' className='p-4 w-3/4 md:w-2/3 mx-auto justify-center'/>
              <div className='flex flex-col my-auto mx-4 md:mx-0 w-full text-center'>
              <p>{translate("sold")}</p>
              <h3 className='text-2xl'>23.000.000</h3>
              <p>{translate("remaining")}</p>
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
        {errorMessage &&(
        <div className='absolute flex w-full h-full m-auto items-center'>
       
       
          <div className='relative flex flex-row bg-white p-4 rounded border-4 justify-center mx-auto z-40 w-3/4'>
      <button onClick={()=> {setErrorMessage(""); showModal()}}className='absolute right-0 h-8 w-8 text-center justify-center p-1 mx-2 text-white bg-red-500'>X</button>
      <div onClick={()=>{setErrorMessage(""); showModal()}} className='flex justify-center m-auto p-4 my-2 bg-white border-4 rounded-md border-white text-center items-center tracking-wider'>
              <p className='text-black'>{errorMessage}</p>
            </div>
      </div>
      
        
        </div>
        )}
      
        <div style={{opacity: errorModal || loginModal ? "10%": "100%"}} id='adventurer' className='w-full my-10'>
          <h2 className='text-center uppercase text-6xl my-5'>Adventurer {translate("levels")}</h2>
          <div className="w-full flex flex-col">
          <div className='flex flex-col w-full mx-auto md:flex-row justify-around'>
            <div className='flex flex-col w-full md:w-1/3'>
              <img src='/images/mercury.png' className='flex h-[200px] my-3 mx-auto justify-center'/>
              <button onClick={() => {buyTokens(200)}}className='flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>200 USDT</button>
              
             
            
            </div>
            <div style={{opacity: errorModal || loginModal  ? "10%": "100%"}} className='flex flex-col w-full md:w-1/3'>
              <img src='/images/mars.png' className='flex h-[200px] my-3 mx-auto justify-center'/>
              <button onClick={() => {buyTokens(500)}} className='flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>500 USDT</button>
            </div>
            <div className='flex flex-col w-full md:w-1/3'>
              <img src='/images/venus.png' className='flex h-[200px] my-3 mx-auto justify-center'/>
              <button onClick={() => {buyTokens(1100)}} className='flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>1.100 USDT</button>
            </div>
          </div>
          
          </div>
        </div>
        <div style={{opacity: errorModal || loginModal  ? "10%": "100%"}} id='master' className='w-full my-10'>
          <h2 className='text-center uppercase text-6xl my-5'>Master {translate("levels")}</h2>
          <div className="w-full flex flex-col">
          <div className='flex flex-col w-full mx-auto md:flex-row justify-around'>
          <div className='flex flex-col w-full md:w-1/3'>
              <img src='/images/earth.png' className='flex h-[200px] my-3 mx-auto justify-center'/>
              <button onClick={() => {buyTokens(2300)}} className='flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>2.300 USDT</button>
            </div>
            <div className='flex flex-col w-full md:w-1/3'>
              <img src='/images/neptune.png' className='flex h-[200px] my-3 mx-auto justify-center'/>
              <button onClick={() => {buyTokens(5000)}} className='flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>5.000 USDT</button>
            </div>
            <div className='flex flex-col w-full md:w-1/3'>
              <img src='/images/uranus.png' className='flex h-[200px] my-3 mx-auto justify-center'/>
              <button onClick={() => {buyTokens(11000)}} className='flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>11.000 USDT</button>
            </div>
           
          </div>

          </div>
         
        </div>
        <div style={{opacity: errorModal || loginModal  ? "10%": "100%"}} id='legend' className='w-full my-10'>
          <h2 className='text-center uppercase text-6xl my-5'>Legend {translate("levels")}</h2>
          <div className="w-full flex flex-col">
          <div className='flex flex-col w-full mx-auto md:flex-row justify-around'>
          <div className='flex flex-col w-full md:w-1/2'>
              <img src='/images/saturn.png' className='flex h-[200px] my-3 mx-auto justify-center'/>
              <button onClick={() => {buyTokens(23000)}} className='flex w-1/2 md:w-1/3 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>23.000 USDT</button>
            </div>
            <div className='flex flex-col w-full md:w-1/2'>
              <img src='/images/jupiter.png' className='flex h-[200px] my-3 mx-auto justify-center'/>
              <button onClick={() => {buyTokens(48000)}} className='flex w-1/2 md:w-1/3 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>48.000 USDT</button>
            </div>
            
           
          </div>

          </div>

          
        </div>
        
        
      </section>

      <Footer />






          

    </>
  )
}

