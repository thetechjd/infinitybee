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
import BackOffice from '../components/BackOffice'
import Input from '../components/Input';
import LoginModal from '../components/LoginModal';
import CircularProgress from '@material-ui/core/CircularProgress'
import Cancel from '@material-ui/icons/Cancel';
import { useStatus } from "../context/statusContext";
import { connectWallet, getCurrentWalletConnected, getNFTPrice, getTotalMinted } from "../utils/interact.js";
//const CountUp = require('react-countup')

import { Chart } from "react-google-charts";

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


const data1 = [
  ["Task", "Hours per Day"],
  ["ICO SEED", 2*42/100],
  ["ICO Presale 1", 3*42/100],
  ["ICO Presale 2", 7*42/100],
  ["ICO Public Sale", 10*42/100],  
  ["Reserve ", 9*42/100],
  ["Liquidity  ", 11*42/100],
]
const data2 = [
  ["Task", "Hours per Day"],
  ["Ecosystem ", 23],
  ["Treasury ", 25],
  ["ICO Sale", 22],
  ["Team & Advisers", 14],  
  ["Marketing", 5],
  ["Liquidity  ", 11],
]
;
const options1 = {
  // title: "My Daily Activities",
  legend: 'none',
  // legend : { position : 'bottom' },
  backgroundColor: 'transparent',
};
const options2 = {
  // title: "My Daily Activities",
  legend: 'none',
  // legend : { position : 'bottom' },
  backgroundColor: 'transparent',
  is3D: true
};

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
  const [referrals, setReferrals] = useState([])
  const [totalRefRevenue, setTotalRefRevenue] = useState(0);
  const [activeRefCode, setActiveRefCode] = useState();
  const [copyMessage, setCopyMessage] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [showBackOffice, setShowBackOffice] = useState(false)
  const [tokenPrice, setTokenPrice] = useState(0)
  const [loginFailed, setLoginFailed] = useState("");



  //Pagination
  const [orders, setOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [currentOrders, setCurrentOrders] = useState();
  const [totalPages, setTotalPages] = useState(0)


  //faq
  const [faqLeft = "1", setFaqLeft] = useState();
  const [faqRight = "1", setFaqRight] = useState();

  // Calculate total number of pages
  //const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Get current orders for the displayed page
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  //const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);


  const router = useRouter();
  const ref = router.query.ref || "";


  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const setFaqRightGeneral = (val) => {
    if (val){
      if (faqRight != val)
        setFaqRight(val);
      else
        setFaqRight(0);
    }
    else{
      setFaqRight(1);
    }
  };

  useEffect(() => {
    const logStatus = localStorage.getItem("loggedIn")
    const userAddress = localStorage.getItem("address")
    if (logStatus && userAddress)
      setLoggedIn(logStatus)


    console.log(localStorage.getItem("loggedIn"))
    setAddress(userAddress)


  }, [])

  useEffect(async () => {
    await fetchOrders(localStorage.getItem("address"))


  }, [walletAddress])

  useEffect(async () => {
    await fetchReferrals(localStorage.getItem("address"))
  }, [walletAddress])

  useEffect(async () => {
    await fetchReferralCode(localStorage.getItem("address"))
  }, [walletAddress])



  //Retrieve Orders

  const fetchOrders = async (address) => {

    let list = [];
    try {
      const q = query(collection(db, "users"))

      const querySnapshot = await getDocs(q);
      console.log(querySnapshot)
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        if ((doc.data().user.address).toLowerCase() == (address).toLowerCase()) {
          doc.data().user.orders.forEach((x) => {
            list.push(x);
          })
        }
      })
      console.log(list)
      setOrders(list);
    } catch (err) {
      console.log(err)
    }
  }

  //Retrieve Referrals

  const fetchReferrals = async (address) => {
    let list = [];

    try {
      const q = query(collection(db, "users"))

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {

        if ((doc.data().user.address).toLowerCase() === address.toLowerCase()) {
          doc.data().user.referrals.forEach((x) => {
            list.push(x)
          })
        }
      })


      console.log(list)
      setReferrals(list)
    } catch (err) {
      console.log(err)
    }
  }





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
        if ((doc.data().user.address).toLowerCase() == address.toLowerCase()) {
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
    if (errorModal) setErrorModal(false)
    else setErrorModal(true)

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
        setLoginFailed("")
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

          //Get ref Code
          let refValue;

          if (refCode.length > 0) {
            refValue = refCode;
          } else {
            refValue = 0;
          }
          console.log("This is the refValue: " + refValue)


          try {
            const referrer = await getReferrer(refCode)

            let current = referrer.data().user.signUps ? Number(referrer.data().user.signUps) : 0;

            let updated = current + 1;

            let refData = {
              signUps: updated
            }

            await updateUser(referrer.id, refData)

          } catch (err) {
            console.log(err)
          }






          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      })


      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          setLoginFailed('User already exists. Did you forget your password?')
        // ..
      };
    })
 

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
      localStorage.setItem("address", "")
      console.log("You are logged out");
      if (showBackOffice) {
        toggleBackOffice();
      }



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

        let chainIdNum = getNetwork();
          if(chainIdNum !== '0xaa36a7'){
            switchNetwork(web3ModalInstance);
          }
        fetchReferralCode(address.toLowerCase());
        getTotalRefRevenue(address)

        showLoginModal(true)


      }
    } catch (error) {
      console.error(error)
    }
  }

  const getNetwork = async () => {
    
    const id = await window.ethereum.request({ method: 'eth_chainId' });
     console.log(`The selected network is ${id}`)
     return id
   
  
 }

 const switchNetwork = async (web3modal) => {
  var chainId = 11155111
 
  const provider = new Web3(web3modal)
  await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: provider.utils.toHex(chainId) }], // chainId must be in hexadecimal numbers
  });

 
}


  const disconnect = () => {
    setAddress('')
  }


  const getSold = async () => {
    const amountSold = await baseContract.methods.sold().call();
    const price = await baseContract.methods.tokenPrice().call();
    console.log(amountSold)
    //const amountRemaining = await beeContract.methods.balanceOf(contractAddress).call();
    setSold(amountSold);
    setRemaining(100_000_000 * 10 ** 18 - (amountSold * 10 ** 18));
    setTokenPrice(price)
  }

  useEffect(async () => {
    await getSold()
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
            })
          } catch (err) {
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
        if ((doc.data().user.address).toLowerCase() === address.toLowerCase()) {

          userId = doc

          console.log(userId)
        }
      })

      return userId;
    } catch (err) {
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
    //let storedAddress = localStorage.getItem("address")
    //if (walletAddress.toLowerCase() === storedAddress.toLowerCase()) {

    //  setErrorMessage("Alert! You are attempting to use an address that we do not recognize! Please only connect the wallet address that you registered with and try again.")

    // } else {



    if (!provider) {

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
          setWarningMessage("Almost done! Please wait for confirmation...");
          await icoContract.methods.buyTokens(pack, refValue).send({ from: walletAddress, gas: 500000 })
        }).then(async () => {
          setWarningMessage("Success!");
          await getSold();
          setWarningMessage("");

        }).then((async () => {

          let round = await icoContract.methods.current_round().call();

          let amount;

          switch (pack) {
            case 1:
              amount = usdt + (usdt * .02);
            case 2:
              amount = usdt + (usdt * .01);
            case 3:
              amount = usdt + (usdt * .03);
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





                //let term = referrer.data().user.termStart;

                //let lastMonth = referrer.data().user.lastMonth ? Number(referrer.data().user.lastMonth) : 0;

                //let thisMonth = referrer.data().user.thisMonth ? Number(referrer.data().user.thisMonth) : 0;

                let timesBought = referrer.data().user.timesBought ? Number(referrer.data().user.timesBought) : 0;


                timesBought += 1;


                let updatedUserData = {
                  timesBought: timesBought
                }

                let newReferralData = {
                  referral: {
                    date: Date.now(),
                    bonus: usdt * .05
                  }
                }




                /* if (timeNow > (term + (2592000 * 1000))) {
 
                   let nextTerm = timeHelper.getLastMonth();
 
                   lastMonth += thisMonth
 
                   thisMonth += usdt * .05
 
                   timesBought += 1;
 
 
                   updatedUserData = {
                     termStart: nextTerm,
                     lastMonth: lastMonth,
                     thisMonth: thisMonth,
                     timesBought: timesBought
                   }*/

                await updateUser(referrer.id, updatedUserData)

                await newReferral(referrer.id, newReferralData)



                /* } else {
 
                   thisMonth += usdt * .05
                   timesBought += 1
 
 
 
                   updatedUserData = {
                     thisMonth: thisMonth,
                     timesBought: timesBought
                   }
 
                   await updateUser(referrer.id, updatedUserData)
 
 
                 }*/


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
          setWarningMessage("Almost done! Please wait for confirmation...");
          await icoContract.methods.buyTokens(pack, refValue).send({ from: walletAddress, gas: 500000 })
        }).then(async () => {
          setWarningMessage("Success!");
          await getSold();
          setWarningMessage("");

        }).then(async () => {

          let round = await icoContract.methods.current_round().call();

          let amount;

          switch (pack) {
            case 1:
              amount = usdt + (usdt * .02);
            case 2:
              amount = usdt + (usdt * .01);
            case 3:
              amount = usdt + (usdt * .03);
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

                let timesBought = referrer.data().user.timesBought ? Number(referrer.data().user.timesBought) : 0;


                timesBought += 1;


                let updatedUserData = {
                  timesBought: timesBought
                }

                let newReferralData = {
                  referral: {
                    date: Date.now(),
                    bonus: usdt * .05
                  }
                }


                await updateUser(referrer.id, updatedUserData)

                await newReferral(referrer.id, newReferralData)






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
    //}
  }

  const newReferral = async (id, referral) => {


    console.log('Generating new referral item with ' + id)

    const documentRef = doc(db, "users", id);
    const documentSnapshot = await getDoc(documentRef)

    if (documentSnapshot.exists()) {
      const existingUserData = documentSnapshot.data().user;

      if (!existingUserData.referrals) {
        existingUserData.referrals = [];
      }

      const updatedUser = { ...existingUserData }

      try {
        updatedUser.referrals.push(referral)

        await updateDoc(documentRef, { user: updatedUser })
      } catch (err) {
        console.log(err)
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

      if (!existingUserData.orders) {

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

  const toggleBackOffice = async () => {
    if (showBackOffice) {
      setShowBackOffice(false)
    } else {
      setShowBackOffice(true)
      await fetchOrders(walletAddress)

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
            <button className='flex mt-8 bg-red-500 text-center justify-center rounded-md w-1/2 md:w-1/4 px-4' onClick={() => { showVerificationWall(false); showLoginModal(true); toggleVariant(); }}>Sign In</button>
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
        toggleBackOffice={toggleBackOffice}


      />

      {!showBackOffice ? (

        <>
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
              loginFailed={loginFailed}



            />

          )}




          <section style={{ zIndex: loginModal ? "-10" : "0", opacity: verificationWall ? "0%" : "100%" }} className="relative flex flex-wrap w-full justify-center md:items-start md:justify-start bg-royalblue mx-auto py-12 mt-10 overflow-x-hidden"
            id="">


            <div style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} className='w-full h-full'>

              <div className='flex w-full grid grid-cols-2  gap-y-1 gap-x-96 isnotmobile isnotmobile-grid'>
                <h1 className="mx-4 uppercase tracking-tighter text-5xl md:text-8xl"><span className="text-6xl md:text-9xl tracking-tightest">InfinityBee</span><br></br><span className="text-8xl tracking-wide whitespace-nowrap">Token {translate("presale")}</span></h1>

                <img src='/images/beelogo.png' className='w-[300px] m-auto ' />
                <h3 className="my-auto whitespace-nowrap mx-4 text-bluee text-2xl">{translate("currency")}</h3>
                <p className='m-auto text-3xl'>{translate("sold")}</p>
                <h3 className='my-auto  whitespace-nowrap mx-4 text-2xl'>{translate("used")}</h3>
                <h3 className='m-auto text-3xl'>{sold ? formatter.format(sold ) : 0}</h3>
                <h3 className='my-auto mx-4 whitespace-nowrap text-pinkk text-2xl'>{translate("decentralized")}</h3>
                <div></div>
                <h3 className='my-auto uppercase whitespace-nowrap mx-4 text-2xl'>{translate("world")}</h3>
                <p className='m-auto text-3xl'>{translate("remaining")}</p>
                <h3 className='my-auto whitespace-nowrap mx-4 text-purplee text-2xl'>{translate("matrix")}</h3>
                <h3 className='m-auto text-3xl'>{remaining ? formatter.format(remaining / 10 ** 18) : 0}</h3>

              </div>

              <div className='flex w-full grid grid-cols-2  gap-y-1 gap-x-96 ismobile'>
                <h1 className="mx-4 uppercase tracking-tighter text-5xl md:text-8xl titlemobile"><span className="text-6xl md:text-9xl tracking-tightest titlemobile1">InfinityBee</span><span className="text-8xl tracking-wide whitespace-nowrap titlemobile2">Token {translate("presale")}</span></h1>

              <div className="subtitlemobile">
                <h3 className="my-auto whitespace-nowrap mx-4 text-bluee">{translate("currency")}</h3>
                <h3 className='my-auto  whitespace-nowrap mx-4'>{translate("used")}</h3>
                <h3 className='my-auto mx-4 whitespace-nowrap text-pinkk'>{translate("decentralized")}</h3>
                <h3 className='my-auto uppercase whitespace-nowrap mx-4'>{translate("world")}</h3>
                <h3 className='my-auto whitespace-nowrap mx-4 text-purplee'>{translate("matrix")}</h3>                
              </div>

              <br /><br />
                <div className="flex flex-row w-full mx-auto md:flex-row subtitlemobile2">
                  <div className="flex flex-col text-center w-full md:w-1/2">
                    <p className='m-auto text-3xl'>{translate("sold")} <br /> {sold ? formatter.format(sold ) : 0}</p>
                    <p className='m-auto text-3xl'>{translate("remaining")} <br /> {remaining ? formatter.format(remaining / 10 ** 18) : 0}</p>
                  </div>
                  <div className="flex flex-col w-full md:w-1/2">
                    <img src='/images/beelogo.png' className='w-[300px] m-auto ' />
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
              <div className='fixed flex w-full h-full m-auto items-center z-40'>


                <div className='fixed flex flex-row bg-red-100 p-4 rounded border-4 justify-center mx-auto z-40 w-full'>
                  <button onClick={() => { setErrorMessage(""); }} className='absolute right-0 h-8 w-8 text-center justify-center p-1 mx-2 text-red-300 bg-red-500'>X</button>
                  <div onClick={() => { setErrorMessage(""); }} className='flex justify-center m-auto p-4 my-2 bg-red-100 text-center items-center tracking-wider'>
                    <p className='text-red-800'>{errorMessage}</p>
                  </div>
                </div>


              </div>
            )}

            {warningMessage && (
              <div className='fixed flex w-full h-full m-auto justify-center items-center z-40'>


                <div className='relative flex flex-col bg-slate950 p-4 rounded border border-gray-500 text-center items-center justify-between mx-auto z-40 w-1/2'>
                  <button onClick={() => { setWarningMessage(""); }} className='absolute right-0 h-8 w-8 text-center justify-center p-1 mx-2 text-red-500'><Cancel /></button>
                  <div onClick={() => { setWarningMessage(""); }} className='flex flex-col justify-center m-auto p-8 my-4 bg-slate950 text-center items-center tracking-wider'>
                    <p className='text-white'>{warningMessage}</p>
                    <div className='mt-5'><CircularProgress /></div>
                  </div>
                </div>


              </div>
            )}

            <div style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} id='adventurer' className='w-full my-10'>
              <h2 className='text-center uppercase text-6xl my-5 h2mobile'>Adventurer {translate("levels")}</h2>
              <div className="w-full flex flex-col">
                <div className='flex flex-col w-full mx-auto md:flex-row justify-around'>
                <div className='flex flex-col justify-center flip-card-parent w-full md:w-1/3 z-3'>
                  <div className="cecardfilp flip-card">
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                      <img src='/images/mercury.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                      </div>
                      <div className="flip-card-back">
                      <div className='ceInfo flex flex-col min-h-[200px] font-extrabold my-3 justify-center text-center items-center'>
                      <p className='my-1'>25,000 IFB Tokens</p>
                      <p className='my-1'>TGE 10% <br /> Vesting 18 Months</p>
                      <p className='my-1'>InfinityBee price 0.008 USD</p>
                      </div>
                      </div>
                    </div>
                  </div> 
                  <button onClick={() => { buyTokens(0, 200) }} className='ceBtnPrice flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>200 USDT</button> 
                </div>
                <div className='flex flex-col justify-center flip-card-parent w-full md:w-1/3'>
                  <div className="cecardfilp flip-card">
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                      <img src='/images/mars.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                      </div>
                      <div className="flip-card-back">
                      <div className='ceInfo flex flex-col min-h-[200px] font-extrabold my-3 justify-center text-center items-center'>
                      <p className='my-1'>62,500 IFB Tokens</p>
                      <p className='my-1'>TGE 10% <br /> Vesting 18 Months</p>
                      <p className='my-1'>InfinityBee price 0.008 USD</p>
                      </div>
                      </div>
                    </div>
                  </div>  
                  <button onClick={() => { buyTokens(2, 500) }} className='ceBtnPrice flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>500 USDT</button>
                </div>
                
                <div className='flex flex-col justify-center flip-card-parent w-full md:w-1/3'>
                  <div className="cecardfilp flip-card">
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                      <img src='/images/venus.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                      </div>
                      <div className="flip-card-back">
                      <div className='ceInfo flex flex-col min-h-[200px] font-extrabold my-3 justify-center text-center items-center'>
                      <p className='my-1'>137,500 IFB Tokens</p>
                      <p className='my-1'>TGE 10% <br /> Vesting 18 Months</p>
                      <p className='my-1'>InfinityBee price 0.008 USD</p>
                      </div>
                      </div>
                    </div>
                  </div> 
                  <button onClick={() => { buyTokens(1, 1100) }} className='ceBtnPrice flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>1.100 USDT</button> 
                </div>
{/*}
                   <div className={`flex flex-col mx-auto w-full card ${isFlipped ? 'flipped' : ''}`} onMouseEnter={handleCardFlip} onMouseLeave={handleCardFlip}>
                    <div className='card-front'>
                      <img src='/images/mercury.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                      <button onClick={() => { buyTokens(0, 200) }} className='ceBtnPrice flex w-full mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>200 USDT</button>
                    </div>
                    <div className='card-back items-center m-auto'>
                      <div className='ceInfo flex flex-col min-h-[200px] font-extrabold my-3 justify-center text-center items-center'>
                      <p className='my-1'>62,500 IFB Tokens</p>
                      <p className='my-1'>{tokenPrice / 10 ** 18} USD</p>
                      <p className='my-1'>Vesting 12 Months</p>
                      <p className='my-1'>No Bonus</p>
                      <p className='my-1'>TGE 10%</p>
                      </div>
                      <button onClick={() => { buyTokens(0, 200) }} className='ceBtnPrice flex w-full mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full mt-1 px-8 py-1'>200 USDT</button>
                    </div>
                  </div>
                  <div style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} className='flex flex-col w-full md:w-1/3'>
                    <img src='/images/mars.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                    <button onClick={() => { buyTokens(3, 500) }} className='ceBtnPrice flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>500 USDT</button>
                  </div>
                  <div className='flex flex-col w-full md:w-1/3'>
                    <img src='/images/venus.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                    <button onClick={() => { buyTokens(1, 1100) }} className='ceBtnPrice flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>1.100 USDT</button>
                  </div>
            </div>*/}

                </div>

              </div>
            </div>
            <div style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} id='master' className='w-full my-10'>
              <h2 className='text-center uppercase text-6xl my-5'>Master {translate("levels")}</h2>
              <div className="w-full flex flex-col">
            <div className='flex flex-col w-full mx-auto md:flex-row justify-around'>

                  {/* <div className='flex flex-col w-full md:w-1/3'>
                    <img src='/images/earth.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                    <button onClick={() => { buyTokens(3, 2300) }} className='ceBtnPrice flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>2.300 USDT</button>
                  </div>
                  <div className='flex flex-col w-full md:w-1/3'>
                    <img src='/images/neptune.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                    <button onClick={() => { buyTokens(7, 5000) }} className='ceBtnPrice flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>5.000 USDT</button>
                  </div>
                  <div className='flex flex-col w-full md:w-1/3'>
                    <img src='/images/uranus.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                    <button onClick={() => { buyTokens(6, 11000) }} className='ceBtnPrice flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>11.000 USDT</button>
                  </div> */}

                <div className='flex flex-col justify-center flip-card-parent w-full md:w-1/3'>
                  <div className="cecardfilp flip-card">
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                      <img src='/images/earth.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                      </div>
                      <div className="flip-card-back">
                      <div className='ceInfo flex flex-col min-h-[200px] font-extrabold my-3 justify-center text-center items-center'>
                      <p className='my-1'>287,500 IFB Tokens</p>
                      <p className='my-1'>TGE 10% <br /> Vesting 18 Months</p>
                      <p className='my-1'>InfinityBee price 0.008 USD</p>
                      </div>
                      </div>
                    </div>
                  </div>  
                  <button onClick={() => { buyTokens(3, 2300) }} className='ceBtnPrice flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>2.300 USDT</button>
                </div>
                <div className='flex flex-col justify-center flip-card-parent w-full md:w-1/3'>
                  <div className="cecardfilp flip-card">
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                      <img src='/images/neptune.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                      </div>
                      <div className="flip-card-back">
                      <div className='ceInfo flex flex-col min-h-[200px] font-extrabold my-3 justify-center text-center items-center'>
                      <p className='my-1'>625,000 IFB Tokens</p>
                      <p className='my-1'>TGE 10% <br /> Vesting 18 Months</p>
                      <p className='my-1'>InfinityBee price 0.008 USD</p>
                      </div>
                      </div>
                    </div>
                  </div>  
                  <button onClick={() => { buyTokens(7, 5000) }} className='ceBtnPrice flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>5.000 USDT</button>
                </div>
                <div className='flex flex-col justify-center flip-card-parent w-full md:w-1/3'>
                  <div className="cecardfilp flip-card">
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                      <img src='/images/uranus.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                      </div>
                      <div className="flip-card-back">
                      <div className='ceInfo flex flex-col min-h-[200px] font-extrabold my-3 justify-center text-center items-center'>
                      <p className='my-1'>1,375,000 IFB Tokens</p>
                      <p className='my-1'>TGE 10% <br /> Vesting 18 Months</p>
                      <p className='my-1'>InfinityBee price 0.008 USD</p>
                      </div>
                      </div>
                    </div>
                  </div>  
                  <button onClick={() => { buyTokens(6, 11000) }} className='ceBtnPrice flex w-1/2 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>11.000 USDT</button>
                </div>                

              </div>
            </div>
            </div>
            <div style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} id='legend' className='w-full my-10'>
              <h2 className='text-center uppercase text-6xl my-5'>Legend {translate("levels")}</h2>
              <div className="w-full flex flex-col">
                <div className='flex flex-col w-full mx-auto md:flex-row justify-around'>

                  {/* <div className='flex flex-col w-full md:w-1/2'>
                    <img src='/images/saturn.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                    <button onClick={() => { buyTokens(5, 23000) }} className='ceBtnPrice flex w-1/2 md:w-1/3 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>23.000 USDT</button>
                  </div>
                  <div className='flex flex-col w-full md:w-1/2'>
                    <img src='/images/jupiter.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                    <button onClick={() => { buyTokens(4, 48000) }} className='ceBtnPrice flex w-1/2 md:w-1/3 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>48.000 USDT</button>
                  </div> */}

                  <div className='flex flex-col justify-center flip-card-parent w-full md:w-1/3'>
                  <div className="cecardfilp flip-card">
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                      <img src='/images/saturn.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                      </div>
                      <div className="flip-card-back">
                      <div className='ceInfo flex flex-col min-h-[200px] font-extrabold my-3 justify-center text-center items-center'>
                      <p className='my-1'>2,875,000 IFB Tokens</p>
                      <p className='my-1'>TGE 10% <br /> Vesting 18 Months</p>
                      <p className='my-1'>InfinityBee price 0.008 USD</p>
                      </div>
                      </div>
                    </div>
                  </div> 
                  <button onClick={() => { buyTokens(5, 23000) }} className='ceBtnPrice flex w-1/2 md:w-1/3 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>23.000 USDT</button> 
                </div>
                <div className='flex flex-col justify-center flip-card-parent w-full md:w-1/3'>
                  <div className="cecardfilp flip-card">
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                      <img src='/images/jupiter.png' className='flex h-[200px] my-3 mx-auto justify-center' />
                      </div>
                      <div className="flip-card-back">
                      <div className='ceInfo flex flex-col min-h-[200px] font-extrabold my-3 justify-center text-center items-center'>
                      <p className='my-1'>6,000,000 IFB Tokens</p>
                      <p className='my-1'>TGE 10% <br /> Vesting 18 Months</p>
                      <p className='my-1'>InfinityBee price 0.008 USD</p>
                      </div>
                      </div>
                    </div>
                  </div>  
                  <button onClick={() => { buyTokens(4, 48000) }} className='ceBtnPrice flex w-1/2 md:w-1/3 mx-auto button-gradient text-center hover:bg-blue-300 duration-200 justify-center rounded-full px-8 py-1'>48.000 USDT</button>
                </div>


                </div>

              </div>




            </div>
            <div id='about' style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} className='w-full my-10 justify-center sectionabout'>
              <h2 className='ceHeader text-center uppercase text-6xl my-5'>About IFB token</h2>
              <div>
                <p className="ceTitle ceCenter ceq">Cum se numește tokenul, pe ce Blockchain este creat și câte unități are ?</p>
                <p className="ceDescription ceCenter">Tokenul Ecosistemului nostru se numește InfinityBee (IFB). Este creat pe BNB Smart Chain (BSC), cu un număr total de 1.800.000.000 unități.</p>

                <div className="flex flex-col w-full mx-auto md:flex-row ">
                  <div className="ceFaqLeft flex flex-col w-full md:w-1/2">
                    <p className="ceTitle2 ceLeft ceq">La ce se poate folosi Tokenul InfinityBee ( IFB) ?</p>
                    <p className="ceDescription2 ceLeft ">
                      Tokenul InfinityBee (IFB) are multiple utilități : <br />
                      – este un activ financiar (IFB) care se va tranzacționa pe diferite platforme de exchange (DEX / CEX) <br />
                      – este un instrument deflaționar datorită strategiilor Be&Bee : Buyback și Burn <br />
                      – constituie o valoare materială care poate fi utilizată pentru acțiuni umanitare (donații și finanțări pentru diverse proiecte caritabile), pe platforma BeeNICE și în platforma de crowdfunding BeeGENEROUS <sup>369</sup> <br />
                      – este necesar pentru activarea nivelurilor 3 , 6 , 9 în BeeGENEROUS <sup>369</sup> <br />
                      – utilizat în BeeSAFE (planul economy), investiții periodice în IFB <br />
                      – este unitate de schimb folosită în BeeSHOP pentru cumpărarea / vânzarea de produse / servicii <br />
                      – cu ajutorul token-ului IFB se vor cumpăra NFT-uri din colecțiile ByBee <br />
                      – este un instrument financiar care se folosește în interiorul NFT Lab, <br /> pentru vânzarea / cumpărarea de bunuri<br />
                      – se folosește pentru anumite și acțiuni din BeeLand (Metaverse) și BeeGame (platformă de jocuri)<br />
                    </p>
                  </div>

                  <div className="ceFaqLeft flex flex-col w-full md:w-1/2">
                    <p className="ceTitle2 ceLeft ceq">Cum și de unde se poate obține Tokenul InfinityBee ( IFB) ?</p>
                    <p className="ceDescription2 ceLeft">
                      Tokenul InfinityBee (IFB) înainte de Listare, se poate obține prin : <br />
                      – participarea la una sau la toate cele 3 etape de PreSale pe această platformă :  <br />
                        Private Sale 1, Private Sale 2, Public Sale <br />
                      – sistemul de crowdfunding BeeGENEROUS <sup>369</sup>,  în programele :  Matrix Bee3 & Matrix Bee4 și <br />
                      – campanii de bounty și airdrop <br />
                      După listare se va tranzacționa pe diferite platforme de exchange (DEX / CEX) 
                    </p>

                    <p className="ceTitle2 ceLeft ceq">La ce valoare și când se poate cumpăra tokenul?</p>
                    <p className="ceDescription2 ceLeft ceDescriptionLast">
                      Valoarea Tokenului InfinityBee va crește de la o rundă la alta după cum urmează : <br />
                      Private Sale 1 (Q4 2023) :   valoarea IFB = 0.01 USDT <br />
                      Private Sale 2 (Q1 2024) :  valoarea IFB = 0.015 USDT <br />
                      Public Sale (Q3 2024) :  valoarea IFB = 0.02 USDT <br />
                    </p>
                  </div>
                </div>


              </div>

            </div>

            <div id='presale' style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} className='w-full my-10 justify-center sectionpresale'>
              <h2 className='ceHeader text-center uppercase text-6xl my-5'>PreSale Rounds</h2>
              <div>
                <p className="ceDescription ceCenter">Această platformă de ICO este un instrument important din cadrul Ecosistemului Be&Bee și se numește <b>BeeCHANGE</b>.</p>

                <p className="ceDescription ceCenter">
                  Pe această platformă se pot cumpăra tokeni IFB sub formă de pachete. <br />
                  Membrii comunității au nevoie de tokeni InfinityBee pentru activarea nivelurilor 3, 6, 9 din BeeGENEROUS <sup>369</sup> <br /> și pentru programul BeeSAFE (planul Economy), iar ulterior vor fi folosiți și pentru viitoarele instrumente, <br /> din interiorul ecosistemului Be&Bee, pe care le vom dezvolta.
                </p>

                <div className="flex flex-col w-full mx-auto md:flex-row ">
                  <div className="ceFaqLeft flex flex-col w-full md:w-1/2">
                    <p className="ceDescription2 ceLeft">
                      Toate cele 3 runde de Pre Sale din perioada ICO-ului se vor desfășura doar pe această platformă (www.infinitybee.io). <br /><br />

                      În RUNDA 1 tokenul are valoarea de 0,01 $. <br />
                      Pentru această rundă sunt alocați tokeni în cuantum de 3% din numărul total de tokeni. <br /><br />

                      În RUNDA 2 tokenul are valoarea de 0,015 $.<br />
                      Pentru această rundă sunt alocați tokeni în cuantum de 7% din numărul total de tokeni.<br /><br />

                      În RUNDA 3 tokenul are valoarea de 0,02 $.<br />
                      Pentru această rundă sunt alocați tokeni în cuantum de 10% din numărul total de tokeni.<br />
                    </p>
                  </div>

                  <div className="ceFaqLeft flex flex-col w-full md:w-1/2">
                    <p className="ceTitle2 ceLeft ceq">Ce oferte de pachete sunt disponibile ?</p>
                    <p className="ceDescription2 ceLeft ceDescriptionLast">
                      În fiecare rundă de Pre Sale a ICO-ului se vor putea cumpăra pachete cu tokeni de 8 valori diferite : <br />
                      200 USDT (Mercury) – no Bonus, no Vesting, Releasing 100% <br />
                      500 USDT (Mars) – no Bonus, no Vesting, Releasing 100% <br />
                      1.100 USDT (Venus) – no Bonus, no Vesting, Releasing 100% <br />
                      2.300 USDT (Earth) – 3% Bonus, Vesting 18 months, Releasing 10% <br />
                      5.000 USDT (Neptune) – 5% Bonus, Vesting 18 months, Releasing 10% <br />
                      11.000 USDT (Uranus) – 7% Bonus, Vesting 18 months, Releasing 10% <br />
                      23.000 USDT (Saturn) – 9% Bonus, Vesting 18 months, Releasing 10% <br />
                      48.000 USDT (Jupiter) – 12% Bonus, Vesting 18 months, Releasing 10% <br />
                    </p>
                  </div>
                </div>


              </div>

            </div>

            <div id='tokenomics' style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} className='w-full my-10 justify-center'>
              <h2 className='ceHeader text-center uppercase text-6xl my-5' style={{fontSize:'55px'}}>Tokenomics</h2>

              <div className="flex flex-col w-full mx-auto md:flex-row ">
              <div className="flex flex-col w-full md:w-1/2">
                  <div className="title_default_light title_border text-center">
                    <h4 className="animation animated fadeInUp" data-animation="fadeInUp" data-animation-delay="0.2s">Token Distribution</h4>
                  </div>
                  <div className="flex justify-center lg_pt_20 res_sm_pt_0 text-center animation animated fadeInLeft" data-animation="fadeInLeft" data-animation-delay="0.2s">
                    {/* <img src="/images/distribution3.png" alt="distribution3" /> */}
                    {    <Chart
      chartType="PieChart"
      data={data2}
      options={options2}
      width={"100%"}
      height={"500px"}
    />}
                  </div>
                  <div className="divider small_divider"></div>
                  <ul className="list_none list_chart text-center">
                    <li>
                      <span className="chart_bx color1"></span>
                      <span>ICO Sale</span>
                    </li>
                    <li>
                      <span className="chart_bx color4"></span>
                      <span>Build Out</span>
                    </li>
                    <li>
                      <span className="chart_bx color2"></span>
                      <span>Team &amp; Advisers</span>
                    </li>
                    <li>
                      <span className="chart_bx color5"></span>
                      <span>Private Investors</span>
                    </li>
                    <li>
                      <span className="chart_bx color3"></span>
                      <span>Bounty</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col w-full md:w-1/2">
                  <div className="title_default_light title_border text-center">
                    <h4 className="animation animated fadeInUp" data-animation="fadeInUp" data-animation-delay="0.2s">Token Sale Proceeds</h4>
                  </div>
                  <div className="flex justify-center lg_pt_20 res_sm_pt_0 text-center animation animated fadeInRight" data-animation="fadeInRight" data-animation-delay="0.2s">
                    {/* <img src="/images/sale-proceeds3.png" alt="sale-proceeds3" /> */}
                    {    <Chart
      chartType="PieChart"
      data={data1}
      options={options1}
      width={"100%"}
      height={"300px"}
    />}
                  </div>
                  <div className="divider small_divider"></div>
                  <ul className="list_none list_chart text-center">
                    <li>
                      <span className="chart_bx color1"></span>
                      <span>Addvisers</span>
                    </li>
                    <li>
                      <span className="chart_bx color2"></span>
                      <span>Marketing</span>
                    </li>
                    <li>
                      <span className="chart_bx color3"></span>
                      <span>Public Sale</span>
                    </li>
                    <li>
                      <span className="chart_bx color4"></span>
                      <span>Pre Sale</span>
                    </li>
                    <li>
                      <span className="chart_bx color5"></span>
                      <span>Projects</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div id='roadmap' style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} className='w-full my-10 justify-center'>
              <h2 className='ceHeader text-center uppercase text-6xl my-5'>Roadmap</h2>
              <div className="align-items-center" style={{position: 'relative'}}>
              <img src="/images/beeactive.png" className="obj" />
              <img src='/images/roadmap.jpg' className='flex m-auto w-4/5 rounded roadmap' />
              </div>
            </div>

            <div id='faq' style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} className='w-full my-10 justify-center isnotmobile'>
              <h2 className='ceHeader text-center uppercase text-6xl my-5'>FAQ</h2>

              <div className="flex flex-col w-full mx-auto md:flex-row small_space">
                <div className="ceFaqLeft ceFaqLeft2 flex flex-col w-full md:w-1/3">
                  <ul className="nav nav-pills d-block tab_s2" id="pills-tab" role="tablist">
                    <li onClick={() => { setFaqLeft("1"); setFaqRightGeneral(""); }} className="nav-item animation" data-animation="fadeInUp" data-animation-delay="0.5s">
                      <a className={`tab-link ${faqLeft == "1" ? "active" : ""} `} data-toggle="tab" href="#tab1x">General</a>
                    </li>
                    {/* <li className="nav-item animation" data-animation="fadeInUp" data-animation-delay="0.6s">
              <a className="tab-link" data-toggle="tab" href="#tab2">Termeni & Definitii </a>
            </li> */}
                    <li onClick={() => { setFaqLeft("2"); setFaqRightGeneral(""); }} className="nav-item animation" data-animation="fadeInUp" data-animation-delay="0.7s">
                      <a className={`tab-link ${faqLeft == "2" ? "active" : ""} `} data-toggle="tab" href="#tab3x">Ecosystem</a>
                    </li>
                    <li onClick={() => { setFaqLeft("3"); setFaqRightGeneral(""); }} className="nav-item animation" data-animation="fadeInUp" data-animation-delay="0.7s">
                      <a className={`tab-link ${faqLeft == "3" ? "active" : ""} `} data-toggle="tab" href="#tab4x">BeeGENEROUS <sup>369</sup></a>
                    </li>
                    <li onClick={() => { setFaqLeft("4"); setFaqRightGeneral(""); }} className="nav-item animation" data-animation="fadeInUp" data-animation-delay="0.8s">
                      <a className={`tab-link ${faqLeft == "4" ? "active" : ""} `} data-toggle="tab" href="#tab5x">Bonuses & Revenues</a>
                    </li>
                    <li onClick={() => { setFaqLeft("5"); setFaqRightGeneral(""); }} className="nav-item animation" data-animation="fadeInUp" data-animation-delay="0.8s">
                      <a className={`tab-link ${faqLeft == "5" ? "active" : ""} `} data-toggle="tab" href="#tab6x">Legalitate & Securitate</a>
                    </li>
                  </ul>
                </div>
                <div className="ceFaqRight ceFaqRight2 flex flex-col w-full md:w-2/3">
                  <div className="tab-content res_md_mt_30 res_sm_mt_20">

                    <div className={`tab-pane fade  ${faqLeft == "1" ? "show active" : ""} `} id="tab1" role="tabpanel">
                      <div id="accordion1" className="faq_content5">
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.8s">
                          <div className="card-header" id="headingThree">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("1") }} className="collapsed" data-toggle="collapse" href="#collapseThreex"
                              aria-expanded="false" aria-controls="collapseThree"><span>Cui i se adresează proiectul nostru
                                ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapseThree" className={`collapse ${faqRight == "1" ? "show" : ""} `} aria-labelledby="headingThree" data-parent="#accordion1">
                            <div className="card-body"> Acest proiect a luat naștere din nevoia de a ajuta persoanele care simt dorința de apartenență la un grup (o comunitate), care doresc să învețe lucruri noi și să evolueze frumos, ca într-un final să fie pregătite să se integreze în Noua Paradigmă. (Paradigmele sunt o multitudine de obiceiuri. În cele mai multe cazuri, aceste obiceiuri nici măcar nu sunt create de tine și totuși, îți ghidează fiecare mișcare pe care o faci.  O schimbare de paradigmă, este o trecere la un joc nou sau un nou set de reguli. Și când regulile se schimbă, întreaga ta lume se poate schimba.). </div>
                          </div>
                        </div>
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.4s">
                          <div className="card-header">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("2") }} data-toggle="collapse" href="#collapseOnex" aria-expanded="true"
                              aria-controls="collapseOne"><span>Ce este Be&Bee ?</span><ins></ins></a></h6>
                          </div>
                          <div id="collapseOne" className={`collapse ${faqRight == "2" ? "show" : ""} `} aria-labelledby="headingOne" data-parent="#accordion1">
                            <div className="card-body"> Be&Bee este un ecosistem prietenos în care noi idei și proiecte prind viață, astfel crescând valoarea comunității, ceea ce va duce la revolutionarea sistemelor de Crowdfunding, a Rețelelor de socializare și e-Commerce. <br />
                              Acest ecosistem este format din mai multe instrumente și este construit pe 3 piloni principali :  Material, Spiritual și Educațional (informațional).</div>
                          </div>
                        </div>
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.6s">
                          <div className="card-header" id="headingTwo">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("3") }} className="collapsed" data-toggle="collapse" href="#collapseTwox"
                              aria-expanded="false" aria-controls="collapseTwo"><span>Care sunt principalele obiective ale
                                proiectului “Be&Bee Community” ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapseTwo" className={`collapse ${faqRight == "3" ? "show" : ""} `} aria-labelledby="headingTwo" data-parent="#accordion1">
                            <div className="card-body"> Această Comunitate este un mediu unde oamenii folosesc tehnologia pentru: <br />
                              – a-și îndeplini visele și pentru a-și atinge obiectivele propuse, <br />
                              – a-și diversifica sursele de venit, <br />
                              – a-și promova afacerile, serviciile/bunurile, aducând un plus de valoare în comunitate, <br />
                              – a socializa, a colabora și pentru a forma legături între ei, <br />
                              – a-și îmbogăți cunoștințele în diferite domenii precum: Tehnologie, Crypto, NLP, LeaderShip, e-Commerce, Astrologie, Numerologie, Spiritualitate, Parenting, LifeStyle … etc

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`tab-pane fade  ${faqLeft == "2" ? "show active" : ""} `} id="tab3" role="tabpanel">
                      <div id="accordion3" className="faq_content5">
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.4s">
                          <div className="card-header" id="headingNine">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("1") }} data-toggle="collapse" href="#collapseNinex" aria-expanded="true"
                              aria-controls="collapseNine"><span>Din ce este format Ecosistemul Be&Bee ?</span><ins></ins></a>
                            </h6>
                          </div>
                          <div id="collapseNine" className={`collapse ${faqRight == "1" ? "show" : ""} `} aria-labelledby="headingNine" data-parent="#accordion3">
                            <div className="card-body">
                              <div className="listtxt">
                                <div>
                                  <span>1 &nbsp; BeeGENEROUS <sup>369</sup></span>
                                  <span>5 &nbsp; BeeNiCE</span>
                                  <span>9 &nbsp; MyGift</span>
                                  <span>13 &nbsp; BeeEDU</span>
                                </div>
                                <div>
                                  <span>2 &nbsp; InfinityBee (IFB)</span>
                                  <span>6 &nbsp; NFT Lab </span>
                                  <span>10 &nbsp; BeeSHOP</span>
                                  <span>14 &nbsp; BeeLiFE</span>
                                </div>
                                <div>
                                  <span>3 &nbsp; BeeSAFE</span>
                                  <span>7 &nbsp; ByBee</span>
                                  <span>11 &nbsp; BeeZumZOOM</span>
                                  <span>15 &nbsp; BeeGAME</span>
                                </div>
                                <div>
                                  <span>4 &nbsp; BeeCHANGE</span>
                                  <span>8 &nbsp; BeeCREATIVE</span>
                                  <span>12 &nbsp; NFTCom</span>
                                  <span>16 &nbsp; BeeLAND</span>
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.6s">
                          <div className="card-header" id="headingTen">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("2") }} className="collapsed" data-toggle="collapse" href="#collapseTenx"
                              aria-expanded="true" aria-controls="collapseTen"><span>Când se lansează instrumentele ecosistemului Be&Bee ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapseTen" className={`collapse ${faqRight == "2" ? "show" : ""} `} aria-labelledby="headingTen" data-parent="#accordion4">
                            <div className="card-body">Instrumentele ecosistemului Be&Bee vor fi lansate treptat, în mai multe etape, din preajma rundelor de PreSale (ICO). <br /><br />
Runda 1: BeeGENEROUS<sup>369</sup>, InfinityBee, BeeSAFE, BeeCHANGE <br />
Runda 2 : BeeNiCE, NFT Lab, BeeCREATiVE, ByBee <br />
Runda 3 : BeeSHOP, NFT Com, MyGiFT, BeeZumZOOM <br />
Următoarele runde : BeeEDU, BeeLiFE, BeeLAND, BeeGAME <br /><br />

Pentru mai multe informații puteți consulta secțiunea ROAD MAP (link---).
</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`tab-pane fade  ${faqLeft == "3" ? "show active" : ""} `} id="tab4" role="tabpanel">
                      <div id="accordion4" className="faq_content5">
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.6s">
                          <div className="card-header" id="headingTen">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("1") }} className="collapsed" data-toggle="collapse" href="#collapseTenx"
                              aria-expanded="true" aria-controls="collapseTen"><span>Ce este BeeGENEROUS <sup>369</sup> ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapseTen" className={`collapse ${faqRight == "1" ? "show" : ""} `} aria-labelledby="headingTen" data-parent="#accordion4">
                            <div className="card-body">Este prima platformă de crowdfunding din lume care îmbină tehnologiile blockchain și smartcontract cu network marketing-ul pe model matricial.  Acest instrument este format din 2 sisteme, de tip matrice :  Matrix Bee3 & Matrix Bee4. </div>
                          </div>
                        </div>
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.8s">
                          <div className="card-header" id="headingEleven">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("2") }} className="collapsed" data-toggle="collapse" href="#collapseElevenx"
                              aria-expanded="false" aria-controls="collapseEleven"><span>Ce monede se folosesc în această
                                platformă ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapseEleven" className={`collapse ${faqRight == "2" ? "show" : ""} `} aria-labelledby="headingEleven" data-parent="#accordion4">
                            <div className="card-body"> Taxa de înscriere se poate plăti cu una din cele 5 cripto-monede : USDT, USDC, BUSD, BNB și EGLD <br />
                              Activarea nivelurilor de multifinanțare se poate face cu aceleași 5 crypto monede (de mai sus), excepție făcând nivelurile 3, 6 și 9 care se activează doar cu tokenul comunității noastre InfinityBee (IFB).

                            </div>
                          </div>
                        </div>
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="1s">
                          <div className="card-header" id="heading48">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("3") }} className="collapsed" data-toggle="collapse" href="#collapse48x"
                              aria-expanded="false" aria-controls="collapse48"><span> Ce categorii de proiecte sunt acceptate
                                ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapse48" className={`collapse ${faqRight == "3" ? "show" : ""} `} aria-labelledby="heading48" data-parent="#accordion4">
                            <div className="card-body"> a. nevoi personale <br />
                              b. probleme de sănătate <br />
                              c. proiecte de tip business <br />
                              d. proiecte umanitare / caritabile
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`tab-pane fade  ${faqLeft == "4" ? "show active" : ""} `} id="tab5" role="tabpanel">
                      <div id="accordion5" className="faq_content5">
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.4s">
                          <div className="card-header" id="headingSeventeen">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("1") }} data-toggle="collapse" href="#collapseSeventeenx" aria-expanded="true"
                              aria-controls="collapseSeventeen"><span>Cum îmi pot diversifica sursele de venit cu ajutorul acestei platforme ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapseSeventeen" className={`collapse ${faqRight == "1" ? "show" : ""} `} aria-labelledby="headingSeventeen"
                            data-parent="#accordion5">
                            <div className="card-body"> Prin distribuirea link-ului tău de invitație vei atrage mai mulți investitori (participanți la ICO). <br />
                              Dacă o persoană folosește link-ul tău și cumpără unul sau mai multe pachete cu tokeni InfinityBee, tu vei fi recompensat cu 5% din totalul sumei investite de acea persoană. Acești bani vor intra direct (instant) în portofelul tău cripto. <br />
                              Deasemenea, prin folosirea link-ului tău, acea persoană va beneficia și ea de un discount de 5%. <br />
                              Prin cumpărarea și deținerea de tokeni InfinityBee poți avea un real profit în timp.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`tab-pane fade  ${faqLeft == "5" ? "show active" : ""} `} id="tab6" role="tabpanel">
                      <div id="accordion6" className="faq_content5">
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.4s">
                          <div className="card-header" id="heading61">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("1") }} data-toggle="collapse" href="#collapse61x" aria-expanded="true"
                              aria-controls="collapse61"><span>Unde pot citi mai multe detalii referitoare la aspectul legal al platformei ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapse61" className={`collapse ${faqRight == "1" ? "show" : ""} `} aria-labelledby="heading61" data-parent="#accordion6">
                            <div className="card-body"> Pentru mai multe detalii referitoare la aspectul legal și pentru a vedea lista țărilor acceptate vă rugăm să consultați pagina de Termeni și condiții.</div>
                          </div>
                        </div>
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.4s">
                          <div className="card-header" id="heading62">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("2") }} data-toggle="collapse" href="#collapse62x" aria-expanded="true"
                              aria-controls="collapse62"><span>Cine are acces la tokenii mei ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapse62" className={`collapse ${faqRight == "2" ? "show" : ""} `} aria-labelledby="heading62" data-parent="#accordion6">
                            <div className="card-body"> Înainte de a cumpăra un pachet cu tokeni InfinityBee, este necesar să îți creezi un cont pe această platformă de ICO. <br />
                              Contul tău personal va fi asociat tot timpul cu portofelul de cripto-monede cu care te-ai autentificat în momentul creării acestuia. Prin urmare, toți tokenii alocați pachetului achiziționat, sunt trimiși numai în acest portofel. <br />
                              Fiecare pachet de tokeni are caracteristici proprii și specifice. <br />
                              Așadar, în funcție de pachetul achiziționat, fiecare dintre noi va primi cuantumul specificat în componența pachetului în una sau mai multe tranșe. Acest mecanism se execută în mod automat de către smart contractul ICO-ului. <br />
                            </div>
                          </div>
                        </div>
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.4s">
                          <div className="card-header" id="heading63">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("3") }} data-toggle="collapse" href="#collapse63x" aria-expanded="true"
                              aria-controls="collapse63"><span> Ce metode de verificare folosește platforma de crowdfunding BeeGENEROUS <sup>369</sup> ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapse63" className={`collapse ${faqRight == "3" ? "show" : ""} `} aria-labelledby="heading63" data-parent="#accordion6">
                            <div className="card-body"> Platforma folosește KYC (Know Your Customer) & AML (Anti Money Laundering)  – 2 elemente de identificare și verificare a membrilor, necesare unui proiect crypto să fie legal și credibil.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>




            </div>

            <div id='faqmobile' style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} className='w-full my-10 justify-center faqmobile ismobile'>
              <h2 className='ceHeader text-center uppercase text-6xl my-5'>FAQ</h2>

              <div className="flex flex-col w-full mx-auto md:flex-row small_space">
                  <div className="tab-content res_md_mt_30 res_sm_mt_20">
                  <ul className="nav nav-pills d-block tab_s2" id="pills-tab" role="tablist">
                    <li className="nav-item animation" data-animation="fadeInUp" data-animation-delay="0.5s">
                      <a className={`tab-link active`} data-toggle="tab" href="#tab1x">General</a>
                    </li>
                  </ul>
                    <div className={`tab-pane fade show active`} id="tab1" role="tabpanel">
                      <div id="accordion1" className="faq_content5">
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.8s">
                          <div className="card-header" id="headingThree">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("1") }} className="collapsed" data-toggle="collapse" href="#collapseThreex"
                              aria-expanded="false" aria-controls="collapseThree"><span>Cui i se adresează proiectul nostru
                                ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapseThree" className={`collapse ${faqRight == "1" ? "show" : ""} `} aria-labelledby="headingThree" data-parent="#accordion1">
                            <div className="card-body"> Acest proiect a luat naștere din nevoia de a ajuta persoanele care simt dorința de apartenență la un grup (o comunitate), care doresc să învețe lucruri noi și să evolueze frumos, ca într-un final să fie pregătite să se integreze în Noua Paradigmă. (Paradigmele sunt o multitudine de obiceiuri. În cele mai multe cazuri, aceste obiceiuri nici măcar nu sunt create de tine și totuși, îți ghidează fiecare mișcare pe care o faci.  O schimbare de paradigmă, este o trecere la un joc nou sau un nou set de reguli. Și când regulile se schimbă, întreaga ta lume se poate schimba.). </div>
                          </div>
                        </div>
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.4s">
                          <div className="card-header">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("2") }} data-toggle="collapse" href="#collapseOnex" aria-expanded="true"
                              aria-controls="collapseOne"><span>Ce este Be&Bee ?</span><ins></ins></a></h6>
                          </div>
                          <div id="collapseOne" className={`collapse ${faqRight == "2" ? "show" : ""} `} aria-labelledby="headingOne" data-parent="#accordion1">
                            <div className="card-body"> Be&Bee este un ecosistem prietenos în care noi idei și proiecte prind viață, astfel crescând valoarea comunității, ceea ce va duce la revolutionarea sistemelor de Crowdfunding, a Rețelelor de socializare și e-Commerce. <br />
                              Acest ecosistem este format din mai multe instrumente și este construit pe 3 piloni principali :  Material, Spiritual și Educațional (informațional).</div>
                          </div>
                        </div>
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.6s">
                          <div className="card-header" id="headingTwo">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("3") }} className="collapsed" data-toggle="collapse" href="#collapseTwox"
                              aria-expanded="false" aria-controls="collapseTwo"><span>Care sunt principalele obiective ale
                                proiectului “Be&Bee Community” ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapseTwo" className={`collapse ${faqRight == "3" ? "show" : ""} `} aria-labelledby="headingTwo" data-parent="#accordion1">
                            <div className="card-body"> Această Comunitate este un mediu unde oamenii folosesc tehnologia pentru: <br />
                              – a-și îndeplini visele și pentru a-și atinge obiectivele propuse, <br />
                              – a-și diversifica sursele de venit, <br />
                              – a-și promova afacerile, serviciile/bunurile, aducând un plus de valoare în comunitate, <br />
                              – a socializa, a colabora și pentru a forma legături între ei, <br />
                              – a-și îmbogăți cunoștințele în diferite domenii precum: Tehnologie, Crypto, NLP, LeaderShip, e-Commerce, Astrologie, Numerologie, Spiritualitate, Parenting, LifeStyle … etc

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <ul className="nav nav-pills d-block tab_s2" id="pills-tab" role="tablist">
                    <li className="nav-item animation" data-animation="fadeInUp" data-animation-delay="0.7s">
                      <a className={`tab-link active`} data-toggle="tab" href="#tab3x">Ecosystem</a>
                    </li>
                  </ul>
                    <div className={`tab-pane fade  show active`} id="tab3" role="tabpanel">
                      <div id="accordion3" className="faq_content5">
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.4s">
                          <div className="card-header" id="headingNine">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("4") }} data-toggle="collapse" href="#collapseNinex" aria-expanded="true"
                              aria-controls="collapseNine"><span>Din ce este format Ecosistemul Be&Bee ?</span><ins></ins></a>
                            </h6>
                          </div>
                          <div id="collapseNine" className={`collapse ${faqRight == "4" ? "show" : ""} `} aria-labelledby="headingNine" data-parent="#accordion3">
                            <div className="card-body">
                              <div className="listtxt">
                                <div>
                                  <span>1 &nbsp; BeeGENEROUS <sup>369</sup></span>
                                  <span>5 &nbsp; BeeNiCE</span>
                                  <span>9 &nbsp; MyGift</span>
                                  <span>13 &nbsp; BeeEDU</span>
                                </div>
                                <div>
                                  <span>2 &nbsp; InfinityBee (IFB)</span>
                                  <span>6 &nbsp; NFT Lab </span>
                                  <span>10 &nbsp; BeeSHOP</span>
                                  <span>14 &nbsp; BeeLiFE</span>
                                </div>
                                <div>
                                  <span>3 &nbsp; BeeSAFE</span>
                                  <span>7 &nbsp; ByBee</span>
                                  <span>11 &nbsp; BeeZumZOOM</span>
                                  <span>15 &nbsp; BeeGAME</span>
                                </div>
                                <div>
                                  <span>4 &nbsp; BeeCHANGE</span>
                                  <span>8 &nbsp; BeeCREATIVE</span>
                                  <span>12 &nbsp; NFTCom</span>
                                  <span>16 &nbsp; BeeLAND</span>
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.6s">
                          <div className="card-header" id="headingTen">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("5") }} className="collapsed" data-toggle="collapse" href="#collapseTenx"
                              aria-expanded="true" aria-controls="collapseTen"><span>Când se lansează instrumentele ecosistemului Be&Bee ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapseTen" className={`collapse ${faqRight == "5" ? "show" : ""} `} aria-labelledby="headingTen" data-parent="#accordion4">
                            <div className="card-body">Instrumentele ecosistemului Be&Bee vor fi lansate treptat, în mai multe etape, din preajma rundelor de PreSale (ICO). <br /><br />
Runda 1: BeeGENEROUS<sup>369</sup>, InfinityBee, BeeSAFE, BeeCHANGE <br />
Runda 2 : BeeNiCE, NFT Lab, BeeCREATiVE, ByBee <br />
Runda 3 : BeeSHOP, NFT Com, MyGiFT, BeeZumZOOM <br />
Următoarele runde : BeeEDU, BeeLiFE, BeeLAND, BeeGAME <br /><br />

Pentru mai multe informații puteți consulta secțiunea ROAD MAP (link---).
</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <ul className="nav nav-pills d-block tab_s2" id="pills-tab" role="tablist">
                    <li className="nav-item animation" data-animation="fadeInUp" data-animation-delay="0.7s">
                      <a className={`tab-link active`} data-toggle="tab" href="#tab4x">BeeGENEROUS <sup>369</sup></a>
                    </li>
                  </ul>
                    <div className={`tab-pane fade  show active`} id="tab4" role="tabpanel">
                      <div id="accordion4" className="faq_content5">
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.6s">
                          <div className="card-header" id="headingTen">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("6") }} className="collapsed" data-toggle="collapse" href="#collapseTenx"
                              aria-expanded="true" aria-controls="collapseTen"><span>Ce este BeeGENEROUS <sup>369</sup> ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapseTen" className={`collapse ${faqRight == "6" ? "show" : ""} `} aria-labelledby="headingTen" data-parent="#accordion4">
                            <div className="card-body">Este prima platformă de crowdfunding din lume care îmbină tehnologiile blockchain și smartcontract cu network marketing-ul pe model matricial.  Acest instrument este format din 2 sisteme, de tip matrice :  Matrix Bee3 & Matrix Bee4. </div>
                          </div>
                        </div>
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.8s">
                          <div className="card-header" id="headingEleven">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("7") }} className="collapsed" data-toggle="collapse" href="#collapseElevenx"
                              aria-expanded="false" aria-controls="collapseEleven"><span>Ce monede se folosesc în această
                                platformă ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapseEleven" className={`collapse ${faqRight == "7" ? "show" : ""} `} aria-labelledby="headingEleven" data-parent="#accordion4">
                            <div className="card-body"> Taxa de înscriere se poate plăti cu una din cele 5 cripto-monede : USDT, USDC, BUSD, BNB și EGLD <br />
                              Activarea nivelurilor de multifinanțare se poate face cu aceleași 5 crypto monede (de mai sus), excepție făcând nivelurile 3, 6 și 9 care se activează doar cu tokenul comunității noastre InfinityBee (IFB).

                            </div>
                          </div>
                        </div>
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="1s">
                          <div className="card-header" id="heading48">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("8") }} className="collapsed" data-toggle="collapse" href="#collapse48x"
                              aria-expanded="false" aria-controls="collapse48"><span> Ce categorii de proiecte sunt acceptate
                                ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapse48" className={`collapse ${faqRight == "8" ? "show" : ""} `} aria-labelledby="heading48" data-parent="#accordion4">
                            <div className="card-body"> a. nevoi personale <br />
                              b. probleme de sănătate <br />
                              c. proiecte de tip business <br />
                              d. proiecte umanitare / caritabile
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <ul className="nav nav-pills d-block tab_s2" id="pills-tab" role="tablist">
                    <li className="nav-item animation" data-animation="fadeInUp" data-animation-delay="0.8s">
                      <a className={`tab-link active`} data-toggle="tab" href="#tab5x">Bonuses & Revenues</a>
                    </li>
                  </ul>
                    <div className={`tab-pane fade  show active`} id="tab5" role="tabpanel">
                      <div id="accordion5" className="faq_content5">
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.4s">
                          <div className="card-header" id="headingSeventeen">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("9") }} data-toggle="collapse" href="#collapseSeventeenx" aria-expanded="true"
                              aria-controls="collapseSeventeen"><span>Cum îmi pot diversifica sursele de venit cu ajutorul acestei platforme ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapseSeventeen" className={`collapse ${faqRight == "9" ? "show" : ""} `} aria-labelledby="headingSeventeen"
                            data-parent="#accordion5">
                            <div className="card-body"> Prin distribuirea link-ului tău de invitație vei atrage mai mulți investitori (participanți la ICO). <br />
                              Dacă o persoană folosește link-ul tău și cumpără unul sau mai multe pachete cu tokeni InfinityBee, tu vei fi recompensat cu 5% din totalul sumei investite de acea persoană. Acești bani vor intra direct (instant) în portofelul tău cripto. <br />
                              Deasemenea, prin folosirea link-ului tău, acea persoană va beneficia și ea de un discount de 5%. <br />
                              Prin cumpărarea și deținerea de tokeni InfinityBee poți avea un real profit în timp.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <ul className="nav nav-pills d-block tab_s2" id="pills-tab" role="tablist">
                    <li className="nav-item animation" data-animation="fadeInUp" data-animation-delay="0.8s">
                      <a className={`tab-link active`} data-toggle="tab" href="#tab6x">Legalitate & Securitate</a>
                    </li>
                  </ul>
                    <div className={`tab-pane fade  show active`} id="tab6" role="tabpanel">
                      <div id="accordion6" className="faq_content5">
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.4s">
                          <div className="card-header" id="heading61">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("10") }} data-toggle="collapse" href="#collapse61x" aria-expanded="true"
                              aria-controls="collapse61"><span>Unde pot citi mai multe detalii referitoare la aspectul legal al platformei ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapse61" className={`collapse ${faqRight == "10" ? "show" : ""} `} aria-labelledby="heading61" data-parent="#accordion6">
                            <div className="card-body"> Pentru mai multe detalii referitoare la aspectul legal și pentru a vedea lista țărilor acceptate vă rugăm să consultați pagina de Termeni și condiții.</div>
                          </div>
                        </div>
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.4s">
                          <div className="card-header" id="heading62">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("11") }} data-toggle="collapse" href="#collapse62x" aria-expanded="true"
                              aria-controls="collapse62"><span>Cine are acces la tokenii mei ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapse62" className={`collapse ${faqRight == "11" ? "show" : ""} `} aria-labelledby="heading62" data-parent="#accordion6">
                            <div className="card-body"> Înainte de a cumpăra un pachet cu tokeni InfinityBee, este necesar să îți creezi un cont pe această platformă de ICO. <br />
                              Contul tău personal va fi asociat tot timpul cu portofelul de cripto-monede cu care te-ai autentificat în momentul creării acestuia. Prin urmare, toți tokenii alocați pachetului achiziționat, sunt trimiși numai în acest portofel. <br />
                              Fiecare pachet de tokeni are caracteristici proprii și specifice. <br />
                              Așadar, în funcție de pachetul achiziționat, fiecare dintre noi va primi cuantumul specificat în componența pachetului în una sau mai multe tranșe. Acest mecanism se execută în mod automat de către smart contractul ICO-ului. <br />
                            </div>
                          </div>
                        </div>
                        <div className="cecard animation" data-animation="fadeInUp" data-animation-delay="0.4s">
                          <div className="card-header" id="heading63">
                            <h6 className="mb-0"> <a onClick={() => { setFaqRightGeneral("12") }} data-toggle="collapse" href="#collapse63x" aria-expanded="true"
                              aria-controls="collapse63"><span> Ce metode de verificare folosește platforma de crowdfunding BeeGENEROUS <sup>369</sup> ?</span><ins></ins></a> </h6>
                          </div>
                          <div id="collapse63" className={`collapse ${faqRight == "12" ? "show" : ""} `} aria-labelledby="heading63" data-parent="#accordion6">
                            <div className="card-body"> Platforma folosește KYC (Know Your Customer) & AML (Anti Money Laundering)  – 2 elemente de identificare și verificare a membrilor, necesare unui proiect crypto să fie legal și credibil.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>


          </section>

        </>

      ) : (


        <BackOffice
          walletAddress={walletAddress}
          orders={orders}
          referrals={referrals}
          activeRefCode={activeRefCode}
          db={db}

        />



      )}




      <Footer />








    </>
  )
}

