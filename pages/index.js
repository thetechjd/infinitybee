import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { useRef, useCallback, useEffect, useState } from "react";
import { useRouter } from 'next/router';
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
//const CountUp = require('react-countup')

const timeHelper = require('../utils/time');



import { getFirestore } from "firebase/firestore";
import { ref, getStorage, uploadBytes } from "firebase/storage";
import { doc, updateDoc, addDoc, deleteDoc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
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
import { NetworkLockedRounded } from "@material-ui/icons";



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





// Create a reference to the Firebase Storage
const db = getFirestore(app);

const storage = getStorage();

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
  const [loginMessage, setLoginMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
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
  const [refCode, setRefCode] = useState("");
  const [totalRefRevenue, setTotalRefRevenue] = useState(0);
  const [activeRefCode, setActiveRefCode] = useState();
  const [copyMessage, setCopyMessage] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  const router = useRouter();
  const ref = router.query.ref || "";


useEffect(() => {
    const logStatus = localStorage.getItem("loggedIn")
    setLoggedIn(logStatus)
    console.log(localStorage.getItem("loggedIn"))
    setAddress(localStorage.getItem("address"))


  }, [])
/*
  useEffect(() => {
    console.log(localStorage.setItem("address", ""))
    console.log(localStorage.setItem("loggedIn", false))
  }, [])*/


  useEffect(() => {
    setRefCode(String(ref))
    console.log('Ref value set!')
  }, [ref])




  //RetrieveReceipts
  const fetchReferralCode = async (address) => {

    try {

      const q = query(collection(db, "users"))

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if ((doc.data().user.address).toLowerCase() == address) {
          setActiveRefCode(doc)
        }


      })
    } catch (err) {
      console.log(err)
    }


  };

  const getTotalRefRevenue = async (address) => {
    const totalRev = await baseContract.methods.getTotalRefRevenue(address).call();

    setTotalRefRevenue(totalRev);
  }










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
      .then(async (userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
        sendEmailVerification(user);
        setUser(user);
        setUser({ emailVerified: false })
        showLoginModal(false)
        showVerificationWall(true)

        try {
          const docRef = await addDoc(collection(db, "users"), {
            user: {
              address: walletAddress,
              createdAt: Date.now(),
              termStart: timeHelper.getLastMonth()
            }
          });

          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
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

        setLoggedIn(true)

        localStorage.setItem("loggedIn", true)
        console.log("You are logged in.");

        if (walletAddress) {
          localStorage.setItem("address", walletAddress);
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
      setLoggedIn(false)
      localStorage.setItem("loggedIn", false)
      console.log("You are logged out");

    }).catch((error) => {
      // An error happened.
    });
  }

  const resetPassword = () => {
    setTimeout(() => {
      setLoginMessage('')
    }, 5000
    )

    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent
        setLoginMessage('A reset email has been sent to your email address!')
      })
      .catch((error) => {
        // An error occurred while sending the password reset email
        console.log(error)
      });
  }

  const handlePassword = (value) => {
    setLoginMessage('')
    if (value.length < 8) {
      setLoginMessage('Password must be at least 8 characters.')
    }
    setPassword(value);



  }

  const handlePwCheck = (check) => {
    setLoginMessage('')
    if (password !== check) {
      setLoginMessage('Passwords don\'t match!')
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
        fetchReferralCode(address.toLowerCase());
        getTotalRefRevenue(address)

        showLoginModal(true)


      }
    } catch (error) {
      console.error(error)
    }
  }

  const disconnect = () => {
    setAddress('')
  }


  const getSold = async () => {
    const amountSold = await baseContract.methods.sold().call();
    const amountRemaining = await beeContract.methods.balanceOf(contractAddress).call();
    setSold(amountSold);
    setRemaining(amountRemaining);
  }

  useEffect(async () => {
    getSold()
  }, [])


  const generateReferralCode = async () => {
    if (!walletAddress) {
      setErrorMessage('Please connect wallet before attempting to register a new referral code!')
    } else {

      let newCode;


      await baseContract.methods.addReferralAddress(walletAddress).send({ from: walletAddress }).then(async () => {

        newCode = await baseContract.methods.getRefByAddress(walletAddress).call()

        console.log(newCode)

      })

        .then(async () => {

          let userObject = {
            referralCode: newCode,
          }

          try {
            const userId = await getId(walletAddress).then(async () => {
              await updateUser(userId.id, userObject)
            } )
          } catch (err){
            console.log(err)
          }

          /*try {
            const docRef = await addDoc(collection(db, "users"), {
              user: {
                referralCode: newCode,
                address: walletAddress,
                createdAt: Date.now(),
                termStart: timeHelper.getLastMonth()
              }
            });

            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }*/


        })


    }





  }

  const getId = async (address) => {

    let userId;

    try {

      console.log('Retrieving user id...')

      const q = query(collection(db, "users"));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        if ((doc.data().user.address).toLowerCase() === address.toLowerCase()){
          
          userId = doc

          console.log(userId)
        }
      })

      return userId;
    } catch (err){
      console.log(err)
    }
  }


  const getReferrer = async (code) => {

    let reference;

    try {

      console.log('Querying...')



      const q = query(collection(db, "users"));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {

        if (doc.data().user.referralCode === code) {
          reference = doc;
        }


      })

      return reference;
    } catch (err) {
      console.log(err)
    }



  }


  const buyTokens = async (pack, usdt) => {

    if(!provider){

      const icoContract = new web3.eth.Contract(
        contractABI,
        contractAddress
      )

      const fiatContract = new web3.eth.Contract(
        fiatABI,
        fiatAddress
      );

      let refValue;



      if (refCode.length > 0) {
        refValue = refCode;
      } else {
        refValue = 0;
      }
      console.log("This is the refValue: " + refValue)




      const total = usdt * 10 ** 6;

      if ((user || loggedIn) && walletAddress) {
        //Buy token logic
        setWarningMessage("Please approve payment...");
        await fiatContract.methods.approve(contractAddress, total).send({ from: walletAddress }).then(async () => {
          setWarningMessage("Step 1 of 2 completed. Please wait for confirmation...");
          await icoContract.methods.buyTokens(pack, refValue).send({ from: walletAddress, gas: 500000 })
        }).then(async () => {
          await getSold();
          setWarningMessage("");
        }).then((async () => {

          let round = await icoContract.methods.current_round().call();

          let amount;

          switch (pack) {
            case 1:
              amount = usdt + (usdt * .02);
            case 2:
              amount = usdt + (usdt * .03);
            case 3:
              amount = usdt + (usdt * .01);
            case 4:
              amount = usdt + (usdt * .25);
            case 5:
              amount = usdt + (usdt * .15);
            case 6:
              amount = usdt + (usdt * .1)
            case 7:
              amount = usdt + (usdt * .07)
            default:
              amount = usdt;


          }

          let newOrderData = {
            order: {
              date: Date.now(),
              package: pack,
              price: usdt,
              round: round,
              amount: amount,
              value: usdt,
            }
          }

          await newOrder(newOrderData).then(async () => {

            if (refCode.length > 0) {
              console.log(refCode)
  
              try {
                const referrer = await getReferrer(refCode)
  
                console.log(referrer)
  
                let timeNow = Date.now()
  
                let term = referrer.data().user.termStart;
  
                let lastMonth = referrer.data().user.lastMonth ? Number(referrer.data().user.lastMonth) : 0;
  
                let thisMonth = referrer.data().user.thisMonth ? Number(referrer.data().user.thisMonth) : 0;
  
  
  
  
                let updatedUserData;
  
  
                if (timeNow > (term + (2592000 * 1000))) {
  
                  let nextTerm = timeHelper.getLastMonth();
  
                  lastMonth += thisMonth
  
                  thisMonth += usdt * .05
  
  
                  updatedUserData = {
                    termStart: nextTerm,
                    lastMonth: lastMonth,
                    thisMonth: thisMonth,
                  }
  
                  await updateUser(referrer.id, updatedUserData)
  
  
  
                } else {
  
                  thisMonth += usdt * .05
  
                
  
                  updatedUserData = {
                    thisMonth: thisMonth
                  }
  
                  await updateUser(referrer.id, updatedUserData)
  
                 
                }
  
  
              } catch (err) {
                console.log(err)
              }
  
  
  
            }



          })


        


        }))
      }



    } else {


      const icoContract = new provider.eth.Contract(
        contractABI,
        contractAddress
      )

      const fiatContract = new provider.eth.Contract(
        fiatABI,
        fiatAddress
      );

      let refValue;



      if (refCode.length > 0) {
        refValue = refCode;
      } else {
        refValue = 0;
      }
      console.log("This is the refValue: " + refValue)




      const total = usdt * 10 ** 6;

      if ((user || loggedIn) && walletAddress) {
        //Buy token logic
        setWarningMessage("Please approve payment...");

        await fiatContract.methods.approve(contractAddress, total).send({ from: walletAddress }).then(async () => {
          setWarningMessage("Step 1 of 2 completed. Please wait for confirmation...");
          await icoContract.methods.buyTokens(pack, refValue).send({ from: walletAddress, gas: 500000 })
        }).then(async () => {
          await getSold();
          showModal()
        }).then(async () => {

          let round = await icoContract.methods.current_round().call();

          let amount;

          switch (pack) {
            case 1:
              amount = usdt + (usdt * .02);
            case 2:
              amount = usdt + (usdt * .03);
            case 3:
              amount = usdt + (usdt * .01);
            case 4:
              amount = usdt + (usdt * .25);
            case 5:
              amount = usdt + (usdt * .15);
            case 6:
              amount = usdt + (usdt * .1)
            case 7:
              amount = usdt + (usdt * .07)
            default:
              amount = usdt;


          }

          let newOrderData = {
            order: {
              date: Date.now(),
              package: pack,
              price: usdt,
              round: round,
              amount: amount,
              value: usdt,
            }
          } 
          
          await newOrder(newOrderData).then(async () => {

          


          if (refCode.length > 0) {
            console.log(refCode)

            try {
              const referrer = await getReferrer(refCode)

              console.log(referrer)

              let timeNow = Date.now()

              let term = referrer.data().user.termStart;

              let lastMonth = referrer.data().user.lastMonth ? Number(referrer.data().user.lastMonth) : 0;

              let thisMonth = referrer.data().user.thisMonth ? Number(referrer.data().user.thisMonth) : 0;

              let updatedUserData;


              if (timeNow > (term + (2592000 * 1000))) {

                let nextTerm = timeHelper.getLastMonth();

                lastMonth += thisMonth

                thisMonth += usdt * .05


                updatedUserData = {
                  termStart: nextTerm,
                  lastMonth: lastMonth,
                  thisMonth: thisMonth,
                }

                await updateUser(referrer.id, updatedUserData)



              } else {

                thisMonth += usdt * .05

                updatedUserData = {
                  thisMonth: thisMonth
                }

                await updateUser(referrer.id, updatedUserData)
              }










            } catch (err) {
              console.log(err)
            }



          }
        })
        })



        /*
              if(ref > 0){
        
                const referrer = await getReferrer();
        
                let timeNow = Date.now()
        
                let term = referrer.data().user.termStart
        
                let lastMonth = referrer.data().user.lastMonth;
        
                let thisMonth = referrer.data().user.thisMonth;
        
                let updatedUserData;
        
                if(timeNow > (term + (2592000 * 1000))) {
        
                  let nextTerm = timeHelper.getLastMonth();
        
                  lastMonth += thisMonth
        
                  thisMonth += usdt * .05
        
        
                  updatedUserData = {
                    termStart: nextTerm,
                    lastMonth: lastMonth,
                    thisMonth: thisMonth,
                  }
        
                  await updateUser(referrer.id, updatedUserData)
        
        
        
        
                } else {
        
                  thisMonth += usdt * .05
        
                  updatedUserData = {
                    thisMonth: thisMonth
                  }
        
                  await updateUser(referrer.id, updatedUserData)
                }
              }*/




      } else {
        setErrorMessage('You must login first to redeem tokens');
        showModal();



      }
    }
  }

  const newOrder = async (order) => {

    const userId = await getId(walletAddress)

      console.log('This is the userId: ' + userId.id)

   

    const documentRef = doc(db, "users", userId.id);
    const documentSnapshot = await getDoc(documentRef);

    if (documentSnapshot.exists()) {
      const existingUserData = documentSnapshot.data().user;

      if(!existingUserData.orders) {

        existingUserData.orders = [];

      }
      const updatedUser = { ...existingUserData }

      try {

        updatedUser.orders.push(order);

        await updateDoc(documentRef, { user: updatedUser })
      } catch (err) {
        console.log(err)
      }

    }
  
  }


  const updateUser = async (id, userObject) => {




    const documentRef = doc(db, "users", id);
    const documentSnapshot = await getDoc(documentRef);

    if (documentSnapshot.exists()) {
      const existingUserData = documentSnapshot.data().user;
      const updatedUser = { ...existingUserData, ...userObject };

      try {
        await updateDoc(documentRef, { user: updatedUser })


        console.log(`User profile ${id} updated successfully!`);
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
  }



  const copyText = (item) => {

    console.log('Copied!')
    navigator.clipboard.writeText
      (`https://infinitybee.vercel.app?ref=${item.data().user.referralCode}`);

    setCopyMessage('Copied!');
    setTimeout(() => setCopyMessage(""), 1500);




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
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}


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
          loginMessage={loginMessage}
          setLoginMessage={setLoginMessage}
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

          <div className='flex w-full grid grid-cols-2  gap-y-1 gap-x-96'>
            <h1 className="mx-4 uppercase tracking-tighter text-5xl md:text-8xl"><span className="text-6xl md:text-9xl tracking-tightest">InfinityBee</span><br></br><span className="text-8xl tracking-wide whitespace-nowrap">Token {translate("presale")}</span></h1>

            <img src='/images/beelogo.png' className='w-[300px] m-auto ' />
            <h3 className="my-auto whitespace-nowrap mx-4 text-bluee text-2xl">{translate("currency")}</h3>
            <p className='m-auto text-3xl'>{translate("sold")}</p>
            <h3 className='my-auto  whitespace-nowrap mx-4 text-2xl'>{translate("used")}</h3>
            <h3 className='m-auto text-3xl'>{sold ? formatter.format(sold / 10 ** 18) : 0}</h3>
            <h3 className='my-auto mx-4 whitespace-nowrap text-pinkk text-2xl'>{translate("decentralized")}</h3>
            <div></div>
            <h3 className='my-auto uppercase whitespace-nowrap mx-4 text-2xl'>{translate("world")}</h3>
            <p className='m-auto text-3xl'>{translate("remaining")}</p>
            <h3 className='my-auto whitespace-nowrap mx-4 text-purplee text-2xl'>{translate("matrix")}</h3>
            <h3 className='m-auto text-3xl'>{remaining ? formatter.format(remaining / 10 ** 18) : 0}</h3>

          </div>

          {/*}
          <div className='flex flex-row w-full px-3 py-4 mx-4 justify-between'>
          <h1 className="uppercase tracking-tighter text-5xl md:text-8xl justify-start text-start"><span className="text-6xl md:text-9xl tracking-tightest">InfinityBee</span><br></br><span className="text-8xl tracking-wide whitespace-nowrap">Token {translate("presale")}</span></h1>
          <img src='/images/beelogo.png' className='w-[300px] mr-8 my-auto items-center justify-center' />
          </div>
          
          <div className='flex flex-row w-full m-auto justify-between mt-4 mx-4 px-4'>
            <h3 className="text-bluee text-2xl">{translate("currency")}</h3>
                
            
            <p className='flex mr-24 px-6 text-3xl'>{translate("sold")}</p>

          </div>
          <div className='flex flex-row w-full m-auto justify-between  mx-4 px-4'>
          <h3 className='text-2xl'>{translate("used")}</h3>
          <h3 className='flex mr-20 px-6 text-3xl'>{sold ? formatter.format(sold / 10 ** 18) : 0}</h3>
          
          </div>
          <div className='flex flex-row w-full m-auto justify-between mx-4 px-4'>
          <h3 className='text-pinkk text-2xl'>{translate("decentralized")}</h3>
          
          </div>

          <div className='flex flex-row w-full m-auto justify-between mx-4 px-4'>
            
          <h3 className='text-2xl'>{translate("world")}</h3>
          <p className='flex mx-16 px-8 text-2xl'>{translate("remaining")}</p>
          </div>
          <div className='flex flex-row w-full m-auto justify-between mx-4 px-4'>
          <h3 className='text-purplee text-2xl'>{translate("matrix")}</h3>
          <h3 className='flex mr-12 px-6 text-3xl'>{remaining ? formatter.format(remaining / 10 ** 18) : 0}</h3>
      </div>*/}


          {/*<div className='flex flex-col md:flex-row w-3/4 md:w-full m-auto mx-4 justify-between'>
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
              <img src='/images/beelogo.png' className='p-4 w-[300px] mx-auto justify-center' />
              <div className='flex flex-col my-auto mx-4 md:mx-0 w-full text-center'>
                <p>{translate("sold")}</p>
                <h3 className='text-2xl'>{sold ? formatter.format(sold / 10 ** 18) : 0}</h3>
                <p>{translate("remaining")}</p>
                <h3 className='text-2xl'>{remaining ? formatter.format(remaining / 10 ** 18) : 0}</h3>
              </div>
            </div>

      </div>*/}

          <div className='flex flex-row justify-between m-auto mx-4 px-8'>
            <div className='flex flex-col uppercase'>

            </div>
            <div className='flex flex-col px-8 mx-8 text-2xl text-center'>

            </div>
          </div>
        </div>
        {errorMessage && (
          <div className='fixed flex w-full h-full m-auto items-center z-40'>


            <div className='fixed flex flex-row bg-red-100 p-4 rounded border-4 justify-center mx-auto z-40 w-full'>
              <button onClick={() => { setErrorMessage(""); showModal() }} className='absolute right-0 h-8 w-8 text-center justify-center p-1 mx-2 text-red-300 bg-red-500'>X</button>
              <div onClick={() => { setErrorMessage(""); showModal() }} className='flex justify-center m-auto p-4 my-2 bg-red-100 text-center items-center tracking-wider'>
                <p className='text-red-800'>{errorMessage}</p>
              </div>
            </div>


          </div>
        )}

        {warningMessage && (
          <div className='fixed flex w-full h-full m-auto justify-center items-center'>


            <div className='relative flex flex-col bg-white p-4 rounded border-4 border-gray-300 justify-between mx-auto z-40 w-1/2'>
              <button onClick={() => { setWarningMessage(""); }} className='absolute right-0 h-8 w-8 text-center justify-center p-1 mx-2 text-red-300 bg-red-500'>X</button>
              <div onClick={() => { setWarningMessage(""); }} className='flex flex-col justify-center m-auto p-8 my-4 bg-white text-center items-center tracking-wider'>
                <p className='text-black'>{warningMessage}</p>
                <img src='/images/Loading_icon.gif' className='flex flex-col mt-4 justify-center w-1/2 m-auto' />
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
        <div style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} id='referral' className='w-full mx-2 my-10 justify-center bg-beesecondary bg-opacity-40'>
          <h2 className='text-center uppercase text-6xl my-5'>Your Referral Code</h2>

          <h2 className='flex px-6 py-2'>Your Stats ($BUSD)</h2>
          <div className='flex flex-col lg:flex-row w-full px-3 my-5 mx-3 items-center justify-center lg:justify-between'>

            <span className='flex w-1/2 lg:w-full text-2xl mx-2 py-2'><p>Last Month:</p><span className='text-5xl pl-2 pr-1 text-green-400'>$</span><p className='text-green-400 text-5xl px-2'>0</p></span>

            <span className='flex w-1/2 lg:w-full text-2xl mx-2 py-2'><p>This Month:</p><span className='text-5xl pl-2 pr-1 text-green-400'>$</span><p className='text-5xl text-green-400 px-2'>0</p></span>

            <span className='flex w-1/2 lg:w-full text-2xl mx-2 py-2'><p>Total:</p><span className='text-5xl pl-2 pr-1 text-green-400'>$</span><p className='text-green-400 text-5xl px-2'>{totalRefRevenue / 10 ** 6} </p></span>
          </div>

          {activeRefCode ? (
            <>
              <button onClick={() => { copyText(activeRefCode) }} className="flex w-1/2 lg:w-1/5 rounded-md mx-auto my-3 justify-center items-center bg-blue-400 hover:bg-green-300 py-2 px-4">
                {copyMessage ? copyMessage : "Copy Your Referral Link"}
                <img src='/images/Copy.png' alt="" />
              </button>


            </>

          ) : (
            <button onClick={generateReferralCode} className="flex w-1/2 lg:w-1/5 rounded-md mx-auto my-3 justify-center items-center bg-blue-400 hover:bg-green-300 py-2 px-4">
              <img src='/images/Copy.png' alt="" />

              Generate Referral Code

            </button>

          )}



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

