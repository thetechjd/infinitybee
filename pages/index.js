import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { useRef, useCallback, useEffect, useState } from "react";
import {useRouter} from 'next/router';
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Link from 'next/link';
import Head from 'next/head';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Input from '../components/Input';
import LoginModal from '../components/LoginModal'
import { useStatus } from "../context/statusContext";
import { connectWallet, getCurrentWalletConnected, getNFTPrice, getTotalMinted } from "../utils/interact.js";






import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';

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


const formatter = new Intl.NumberFormat('es-ES');


const app = initializeApp(firebaseConfig);
const auth = getAuth();

//ABIs
const contractABI = require("../pages/contract-abi.json");
const fiatABI = require("../pages/fiat-abi.json");
const beeABI = require("../pages/bee-abi.json");

//smart contracts
const contractAddress = require("../config/icoconfig.json").icoAddress;
const fiatAddress = require("../config/icoconfig.json").fiatAddress;
const beeAddress = require("../config/icoconfig.json").beeAddress;



const web3 = createAlchemyWeb3('https://eth-sepolia.g.alchemy.com/v2/tZgBg81RgxE0pkpnQ6pjNpddJBd6nR_b');


const baseContract = new web3.eth.Contract(
  contractABI,
  contractAddress
);

const beeContract = new web3.eth.Contract(
  beeABI,
  beeAddress
);



const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: "https://eth-mainnet.g.alchemy.com/v2/trNMW5_zO5iGvlX4OZ3SjVF-5hLNVsN5" // required
    }
  }
  /* coinbasewallet: {
     package: CoinbaseWalletSDK, // Required
     options: {
       appName: "Highlight Card", // Required
       rpc: "https://eth-mainnet.g.alchemy.com/v2/trNMW5_zO5iGvlX4OZ3SjVF-5hLNVsN5", // Optional if `infuraId` is provided; otherwise it's required
       chainId: 1, // Optional. It defaults to 1 if not provided
       darkMode: true // Optional. Use dark theme, defaults to false
     }
   }*/

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
  const [verificationWall, setVerificationWall] = useState(false)
  const [pwCheck, setPwCheck] = useState('');
  const [show, setShow] = useState(false);
  const [reset, setReset] = useState(false);
  const [sold, setSold] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [refCode, setRefCode] = useState(0);

  const router = useRouter();
  const ref = router.query.ref || null;




  







  const togglePw = () => {
    setShow(!show)
  }



  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login')
  }, [])



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
    if (lang === 'ES') {
      return es[text]
    } else if (lang === 'RO') {
      return ro[text]
    } else if (lang === 'CN') {
      return cn[text]
    } else if (lang === 'IT') {
      return it[text]
    } else if (lang === 'DE') {
      return de[text]
    } else if (lang === 'FR') {
      return fr[text]
    }
    else {
      return en[text]
    }
  }



  const showModal = () => {
    setErrorModal(!errorModal)
  }

  const showLoginModal = (bool) => {
    setLoginModal(bool);
  }






  const signUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
        sendEmailVerification(user);
        setUser(user);
        setUser({ emailVerified: false })
        showLoginModal(false)
        showVerificationWall(true)
      })


      .catch((error) => {
        console.log(error)
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

        if(walletAddress){
        showLoginModal(false)
        }

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

  const resetPassword = () => {
    setTimeout(() => {
      setErrorMessage('')
    }, 5000
    )

    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent
        setErrorMessage('A reset email has been sent to your email address!')
      })
      .catch((error) => {
        // An error occurred while sending the password reset email
        console.log(error)
      });
  }

  const handlePassword = (value) => {
    setErrorMessage('')
    if (value.length < 8) {
      setErrorMessage('Password must be at least 8 characters.')
    }
    setPassword(value);



  }

  const handlePwCheck = (check) => {
    setErrorMessage('')
    if (password !== check) {
      setErrorMessage('Passwords don\'t match!')
    }
    setPwCheck(check)

  }

  const showVerificationWall = (bool) => {
    setVerificationWall(bool)
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

  async function connectWallet(e) {
    e.preventDefault();

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

        showLoginModal(true)


      }
    } catch (error) {
      console.error(error)
    }
  }

  const disconnect = () => {
    setAddress('')
  }


  const getSold = async() => {
    const amountSold = await baseContract.methods.sold().call();
    const amountRemaining = await beeContract.methods.balanceOf(contractAddress).call();
    setSold(amountSold);
    setRemaining(amountRemaining);
  }

  useEffect( async () => {
    getSold()
  }, [])

  const buyTokens = async (pack, usdt) => {

    const icoContract = new provider.eth.Contract(
      contractABI,
      contractAddress
    )
    
    const fiatContract = new provider.eth.Contract(
      fiatABI,
      fiatAddress
    );

    let refValue;

   

    if (ref > 0){
      refValue = ref;
    } else {
      refValue = 0;
    }
    console.log("This is the refValue: "+ refValue)




    const total = usdt * 10 ** 6;

    if (user && walletAddress) {
      //Buy token logic

      await fiatContract.methods.approve(contractAddress, total).send({ from: walletAddress }).then(() => {
        icoContract.methods.buyTokens(pack, refValue).send({ from: walletAddress, gas: 500000 })
      })
  
  
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

      {verificationWall && (
        <div className='flex flex-col absolute -my-10 items-center justify-center bg-transparent w-full h-full z-50'>
          <div className='flex flex-col border-2 rounded-sm items-center justify-center border-black p-5'>
            <h3 className="text-center text-black">Please check your email. A verification email has been sent to the address provided.</h3>
            <button className='flex mt-8 bg-red-500 text-center justify-center rounded-md w-1/2 md:w-1/4 px-4' onClick={() => { showVerificationWall(false); showLoginModal(true) }}>Sign In</button>
          </div>
        </div>
      )}

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

      {loginModal && (
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
          loginModal={loginModal}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          pwCheck={pwCheck}
          togglePw={togglePw}
          show={show}
          resetPassword={resetPassword}
          reset={reset}
          setReset={setReset}



        />

      )}




      <section style={{ zIndex: loginModal ? "-10" : "0", opacity: verificationWall ? "0%" : "100%" }} className="relative flex flex-wrap w-full justify-center md:items-start md:justify-start bg-royalblue mx-auto py-12 mt-10 overflow-x-hidden"
        id="">


        <div style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} className='w-full h-full'
        >
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
            <div style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} className='flex flex-row md:flex-col uppercase w-3/4 md:w-1/3 m-auto mx-8 max-h-[500px] items-start justify-center'>
              <img src='/images/beelogo.png' className='p-4 w-3/4 md:w-2/3 mx-auto justify-center' />
              <div className='flex flex-col my-auto mx-4 md:mx-0 w-full text-center'>
                <p>{translate("sold")}</p>
                <h3 className='text-2xl'>{sold ? formatter.format(sold/10**18): 0}</h3>
                <p>{translate("remaining")}</p>
                <h3 className='text-2xl'>{remaining ? formatter.format(remaining/10**18): 0}</h3>
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
        {errorMessage && (
          <div className='absolute flex w-full h-full m-auto items-center'>


            <div className='relative flex flex-row bg-white p-4 rounded border-4 justify-center mx-auto z-40 w-3/4'>
              <button onClick={() => { setErrorMessage(""); showModal() }} className='absolute right-0 h-8 w-8 text-center justify-center p-1 mx-2 text-white bg-red-500'>X</button>
              <div onClick={() => { setErrorMessage(""); showModal() }} className='flex justify-center m-auto p-4 my-2 bg-white border-4 rounded-md border-white text-center items-center tracking-wider'>
                <p className='text-black'>{errorMessage}</p>
              </div>
            </div>


          </div>
        )}

        <div style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} id='adventurer' className='w-full my-10'>
          <h2 className='text-center uppercase text-6xl my-5'>Adventurer {translate("levels")}</h2>
          <div className="w-full flex flex-col">
            <div className='flex flex-col w-full mx-auto md:flex-row justify-around'>
              <div className='flex flex-col w-full md:w-1/3'>
                <img src='/images/mercury.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                <button onClick={() => { buyTokens(0, 200) }} className='flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>200 USDT</button>



              </div>
              <div style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} className='flex flex-col w-full md:w-1/3'>
                <img src='/images/mars.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                <button onClick={() => { buyTokens(3, 500) }} className='flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>500 USDT</button>
              </div>
              <div className='flex flex-col w-full md:w-1/3'>
                <img src='/images/venus.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                <button onClick={() => { buyTokens(1, 1100) }} className='flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>1.100 USDT</button>
              </div>
            </div>

          </div>
        </div>
        <div style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} id='master' className='w-full my-10'>
          <h2 className='text-center uppercase text-6xl my-5'>Master {translate("levels")}</h2>
          <div className="w-full flex flex-col">
            <div className='flex flex-col w-full mx-auto md:flex-row justify-around'>
              <div className='flex flex-col w-full md:w-1/3'>
                <img src='/images/earth.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                <button onClick={() => { buyTokens(2, 2300) }} className='flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>2.300 USDT</button>
              </div>
              <div className='flex flex-col w-full md:w-1/3'>
                <img src='/images/neptune.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                <button onClick={() => { buyTokens(7, 5000) }} className='flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>5.000 USDT</button>
              </div>
              <div className='flex flex-col w-full md:w-1/3'>
                <img src='/images/uranus.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                <button onClick={() => { buyTokens(6, 11000) }} className='flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>11.000 USDT</button>
              </div>

            </div>

          </div>

        </div>
        <div style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} id='legend' className='w-full my-10'>
          <h2 className='text-center uppercase text-6xl my-5'>Legend {translate("levels")}</h2>
          <div className="w-full flex flex-col">
            <div className='flex flex-col w-full mx-auto md:flex-row justify-around'>
              <div className='flex flex-col w-full md:w-1/2'>
                <img src='/images/saturn.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                <button onClick={() => { buyTokens(5, 23000) }} className='flex w-1/2 md:w-1/3 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>23.000 USDT</button>
              </div>
              <div className='flex flex-col w-full md:w-1/2'>
                <img src='/images/jupiter.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                <button onClick={() => { buyTokens(4, 48000) }} className='flex w-1/2 md:w-1/3 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>48.000 USDT</button>
              </div>


            </div>

          </div>


        </div>
        <div id='faq' className='pb-3 pt-12 px-4 flex flex-col w-full'>
          <h2 className='text-center uppercase text-6xl my-5'>{translate("howitworks")}</h2>
          <div className='px-4 py-8 text-white text-sm bg-gray-900 rounded-md border-4 my-2'>
            <details className="accordion">
              <summary className="">{translate("what")}</summary>
              <div className="">
                <p>{translate("beegenerous")}</p>
                <p>{translate("following4")}</p>
                <ul className="flex flex-col mx-5">
                  <li>{translate("personalneeds")}</li>
                  <li>{translate("goalsdreams")}</li>
                  <li>{translate("housecar")}</li>
                  <li>b. For medical problems (Individuals)</li>
                  <li>E.g.: medical treatment, surgery, medical assistance, etc.</li>
                  <li>c. For Business type projects (company)</li>
                  <li>E.g.: ecological greenhouse, beekeeper who wants to increase the number of his bee families, dental office, opening a restaurant and/or cafe, Android & iOS application development, etc.</li>
                  <li>d. For humanitarian / charitable projects (NGO, Foundation)</li>
                  <li>E.g.: old foster care, children's home, volunteer actions, etc.</li>
                </ul>
                <p>BeeGENEROUS is a unique decentralized Crowdfunding tool that consists of two matrix systems: Matrix Bee3 and Matrix Bee4, each of them has 9 levels (boxes) of multi-funding, with values between 30 BUSD and 12,000 BUSD.</p>
                <p>Matrix Bee3 – at each level (box) from 1 to 9, there are 3 positions placed horizontally which together form a CYCLE.</p>
                <p>Matrix Bee4 – at each level (box) from 1 to 9, there are 2 Lines: LINE 1 which has 2 positions and LINE 2 which has 4 positions; all 6 positions together form a CYCLE. The last occupied position in the cycle (6th) Closes and at the same time Re-opens a new Cycle.</p>
                <p>All levels are activated by 5 cryptocurrencies integrated in the Be&Bee platform: BUSD, BNB, USDT, USDC or EGLD.</p>
                <p>Levels 3, 6 and 9 can be activated only with InfinityBee (IFB) token.</p>
              </div>
            </details>
          </div>
          <div className='px-4 py-8 text-white text-sm bg-gray-900 rounded-md border-4 my-2'>
            <details className="accordion">
              <summary>{translate("levelfrozen")}</summary>
              <div>
                <p>Each Level (box) is activated only once and works without a deadline (expiration date).
                  The last position occupied in the cycle Closes it and, at the same time, Reopens a new Cycle. This is done automatically by the system, thanks to the SmartContract.
                  The number of Cycles for each level is unlimited.</p>
                <p>The levels (boxes) can have 3 colors, depending on the situation:</p>
                <ol className="flex flex-col mx-5">
                  <li>1. BLUE = when that level is not activated</li>
                  <li>2. PURPLE = when that level is activated (active)</li>
                  <li>3. GREY = when that level is enabled but frozen (inactive)</li>
                </ol>
              </div>
            </details>
          </div>
          <div className='px-4 py-8 text-white text-sm bg-gray-900 rounded-md border-4 my-2'>
            <details className="accordion">
              <summary>{translate("upgradestrategy")}</summary>
              <div>
                <p>Both systems Matrix Bee3 and Matrix Bee4 are working in parallel ‒ simultaneously; this means that, the number of activated levels in one system will be equal to the number of activated levels in the other system.</p>
                <p>This means that every time we want to move to the next level (to Upgrade), we will activate both Levels (boxes) (with the same number and same values) from both Matrix Bee3 and Matrix Bee4 systems.</p>
                <p>C = comb (level / box)</p>
                <p>E.g.:</p>
                <p>Level 1 = C1 from Matrix Bee3 + C1 from Matrix Bee4</p>
                <p>Level 2 = C2 from Matrix Bee3 + C2 from Matrix Bee4</p>
                <p>…………………………..........…….…</p>
                <p>Level 9 = C9 from Matrix Bee3 + C9 from Matrix Bee4</p>

              </div>
            </details>
          </div>
          <div className='px-4 py-8 text-white text-sm bg-gray-900 rounded-md border-4 my-2'>
            <details className="accordion">
              <summary>{translate("activate")}</summary>
              <div>
                <p>All levels from 1 to 9 can be activated at any time, as many you choose, in ascending order, without skipping one or more levels (boxes).
                  Each level (box) once activated remains so forever and for an infinite number of Cycles.
                  But there is an exception, namely: the one in which the LAST level you activated (1...8) allows you to receive funds for a maximum of three complete Cycles.
                  From the moment Cycle 4 opens you are invited to step forward and activate the next Level, precisely to benefit from an unlimited number of Cycles for this Level as well (which now becomes the penultimate level activated).
                  In other words: The LAST Level you activated has three full operating cycles, during which it helps you get funds for your project, and then it goes inactive (freezes) and stops receiving funds for you until you Activate the next level.
                  This "rule" applies only to the last level activated by you; i.e. that level with the highest value (1...8) until this moment.
                  The other previously activated levels continue to function as before, for an infinite number of Cycles.
                </p>
              </div>
            </details>
          </div>
          <div className='px-4 py-8 text-white text-sm bg-gray-900 rounded-md border-4 my-2'>
            <details className="accordion">
            <summary>{translate("notificationbell")}</summary>
            <p>Every time there is an important event, the system will notify you by displaying a bell.</p>
            <p>1. When you are exceeded by a direct (on an unactivated level) and you need to Upgrade.</p>
            <p className='text-pinkk'>MESSAGE</p>
            <p>Please don’t forget</p>
            <p>You missed some funds because your friend(s) exceeded You</p>
            <p>2. When Cycle 3 opens, you are notified that it is the last cycle that can receive funds (if this level is the last in value, activated). This notification only appears on levels 1...8, and does not appear on level 9 because it is the last level in the system.</p>
            <p className='text-pinkk'>MESSAGE</p>
            <p>A friendly reminder</p>
            <p>The 3rd cycle is the last round which helps you to receive funds</p>
            <p>3. When Cycle 4 opens, the box/honeycomb freezes because at this last activated level you've already closed three full cycles and haven't upgraded yet.</p>
            <p className='text-pinkk'>MESSAGE</p>
            <p>It’s Time to Upgrade</p>
            <p>This frozen comb can’t receive funds; three cycles have been closed</p>
            </details>
          </div>

          <div className='px-4 py-8 text-white text-sm bg-gray-900 rounded-md border-4 my-2'>
            <details className="accordion">
            <summary>{translate("symbolsandcolors")}</summary>
            <p>All the people who will occupy positions in the two systems: Matrix Bee3 & Matrix Bee4, are represented with the help of Sacred Geometry through the symbol FLOWER OF LIFE.</p>
            <ul className='flex flex-col mx-5'>
              <li>
                <p className='font-bold'>Friend invited by you</p>
                <p>In both matrix systems (Matrix Bee3 & Matrix Bee4), our friends that we have enrolled in the Be&Bee Community as a token of appreciation are highlighted in purple.</p>
              </li>
              <li>
                <p className='font-bold'>Fallen from the sky</p>
                <p>Only in Matrix Bee4 and only on LINE 1, are those who come from above, which is why they are represented by the blue color of the clear sky.</p>
              </li>
              <li>
                <p className='font-bold'>1st Line's Child</p>
                <p>Only in Matrix Bee4 and only on LINE 2, members who are enrolled by those from the LINE 1 are yellow in color, like the fine sand heated by the Sun.</p>
              </li>
              <li>
                <p className='font-bold'>1st Line's Descendant</p>
                <p>Only in Matrix Bee4 and only on LINE 2, members who are the descendants of those in LINE 1 are orange in color, like a serene sunset.</p>
              </li>
              <li>
                <p className='font-bold'>Member who has exceeded his Host</p>
                <p>In both matrix systems (Matrix Bee3 & Matrix Bee4), there are determined individuals who activate their higher levels by which they surpass their host and will look for activated boxes to sit in. The green color suits them best as it resembles the fresh blade of grass boldly sprouting from the ground.</p>
              </li>
              <li>
                <p className='font-bold'>Number of cycles</p>
                <p>This symbol consisting of 2 arrows positioned clockwise shows us how many cycles have been opened at that level (box).</p>
              </li>
              <li>
                <p className='font-bold'>Members in this comb</p>
                <p>At each individual level (box) there will be a certain number of people who will help to close the cycles. Only the people registered directly by you (those in purple) are counted. A person can appear multiple times on a level, but it is counted only once. In other words, <span className='uppercase'>Friend invited by you</span> are counted one time only.</p>
              </li>
              <li>
                <p className='font-bold'>Gift (from a descendant with a frozen level)</p>
                <p>The gift box signals the funds received from a descendant who, due to having a frozen level (inactive box) and can no longer receive these funds, loses them in your favour.</p>
              </li>
              <li>
                <p className='font-bold'>Goes to upper member in this cycle</p>
                <p>Funds from those who sit on LINE 1 in Matrix Bee4 always go to whoever is positioned above in that Cycle.</p>
              </li>
              <li>
                <p className='font-bold'>Missed funds (for exceeding the host)</p>
                <p>There are some cases where someone is outclassed at a certain level by a direct, at which point they look for the first activated level (box), up in the hierarchy line, to sit in, and therefore the host loses the funds they would have been entitled to if they had that level activated.</p>
              </li>
              <li>
                <p className='font-bold'>Missed funds (for delayed upgrade)</p>
                <p>Another situation where some due funds can be lost is when someone is on a frozen (inactive) level and delays in upgrading it. This member is represented by the two-colored Flower of Life symbol (the lower half is specific to his role, and the upper half is Grey).
                </p>
              </li>
              <li>
                <p className='font-bold'>Your upgrade</p>
                <p>This symbol called "Seed of Life" will appear when you activate a level and gives you the opportunity to receive funds.
                </p>
              </li>
              <li>
                <p className='font-bold'>Members who closed the cycle</p>
                <p>Always the person who sits in the last position (6th) in a cycle helps to Close and, at the same time, to Re-Open a new Cycle. This member is represented by the two-colored Flower of Life symbol (the left half is specific to his role, and the right half is Pink).</p>
              </li>
            </ul>
            </details>
          </div>
          <div className='px-4 py-8 text-white text-sm bg-gray-900 rounded-md border-4 my-2'>
            <details className="accordion">
            <summary>{translate("moneydist")}</summary>
            <p>The distribution of funds in Matrix Bee3 is done as follows:</p>
            <p>All the money from the first two positions (1, 2) goes directly to your wallet, and those from the 3rd position goes to the person who gave you the chance to enter into this Community.
              With the three occupied positions, this Cycle closes - reopening the next Cycle with another three free positions; in this order you can receive the next funds for your project.
              This process can be repeated endlessly for an unlimited period of time.
            </p>
            <p>The distribution of funds in Matrix Bee4 is done as follows:</p>
            <p>The money for the two positions in LINE 1 goes to the projects of other members (these can be members who joined the Community before you or long after the moment you joined the Be&Bee Community). This is the advantage of the matrix system thought and designed by us.
              All funds for the next three positions (3, 4, 5) in LINE 2 goes directly to your wallet, and the money from the last position (6th) goes to someone else's project. With all six positions occupied, this Cycle closes - opening the next Cycle with another six free positions; so you can receive the next funds for your project.
              This process can be repeated endlessly for an unlimited period of time.
            </p>
            <p>Everything is done automatically thanks to the SmartContract: no errors, no intermediaries and no commissions!!!
              The money get distributed into your wallet in seconds !!!
            </p>
            <p>All the funds received from the BeeGENEROUS crowdfunding platform, in the Matrix Bee3 & Matrix Bee4 systems, get distributed between the members’ wallets of the Bee&Bee Community automatically thanks to the SmartContract (an application-like program that executes certain functions/algorithms and does not require human intervention).
            </p>
            <p>Our platform does not commission or retain funds, it is ONLY a virtual Back-Office, like an accounting program, for each of us, with the aim of facilitating the management of funds obtained with its help.</p>
            <p>Therefore, the money is in your own wallet, to which only you have access at any time, because the password of the wallet is known only by you!
            </p>
            <p>All the friends that you invite and join the Be&Bee Community have the right to promote a Project through their Personal Back-Office to get funds / donations.
              If you have a business project, a medical project or a humanitarian (charitable) project and you want it to be promoted in front of the entire Community on the <span className='uppercase'>BeeNice</span> platform, then it is necessary to complete the KYC (Know Your Customer) procedure from your profile, at <span className='uppercase'>All about me</span> section.
              The BeeNice platform can be accessed by anyone.
              On this platform, promoted projects can receive funds from all over the world.
            </p>
            </details>
          </div>

        </div>
        <div style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} id='roadmap' className='w-full my-10 justify-center'>
          <h2 className='text-center uppercase text-6xl my-5'>Roadmap</h2>
          <img src='/images/roadmap.jpg' className='flex m-auto w-4/5 rounded' />
        </div>


      </section>

      <Footer />








    </>
  )
}

