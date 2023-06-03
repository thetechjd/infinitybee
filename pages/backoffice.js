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
import NavigateNext from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import LastPage from '@material-ui/icons/LastPage';
import FirstPage from '@material-ui/icons/FirstPage';
import FileCopyOutlined from '@material-ui/icons/FileCopyOutlined';
import ArrowDropUpOutlined from '@material-ui/icons/ArrowDropUpOutlined';
import ArrowDropDownOutlined from '@material-ui/icons/ArrowDropDownOutlined';

//const CountUp = require('react-countup')

const { dateHelper, getLastMonth, getMonth, monthHelper } = require('../utils/time');




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
    const [balance, setBalance] = useState(0)
    const [isThisMonth, setIsThisMonth] = useState(true)
    const [referrals, setReferrals] = useState();
    const [bonus, setBonus] = useState(0)
    const [lastBonus, setLastBonus] = useState(0);
    const [lastMonthDisabled, setLastMonthDisabled] = useState(false)


    const [thisMonth, setThisMonth] = useState("")
    const [lastMonth, setLastMonth] = useState("")



    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage, setOrdersPerPage] = useState(10);
    const [orders, setOrders] = useState([]);


    // Calculate total number of pages
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    // Get current orders for the displayed page
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const router = useRouter();
    const ref = router.query.ref || null;

    /*useEffect(() => {
        localStorage.setItem("address", "0xD688Ce28849A20297E3D29E69a082c3dCcdC8EE5");
        console.log('Stored address', localStorage.getItem("address"))
    }, [walletAddress])*/


    useEffect(() => {
        const logStatus = localStorage.getItem("loggedIn")
        setLoggedIn(logStatus)
        console.log(localStorage.getItem("loggedIn"))
        const storedAddress = localStorage.getItem("address")
        setAddress(storedAddress)
        console.log(storedAddress)


    }, [])

    useEffect(() => {
        setThisMonth(convertMonth(monthHelper(Date.now())))
        setLastMonth(convertMonth(monthHelper(Date.now()) - 1))
    }, [])



    useEffect(() => {
        setRefCode(String(ref))
        console.log('Ref value set!')
    }, [ref])

    useEffect(() => {
        const storedAddress = localStorage.getItem("address");
        setAddress(storedAddress)

    }, [walletAddress])


    useEffect(async () => {
        await fetchReferralCode(localStorage.getItem("address").toLowerCase())
    

    }, [walletAddress])

   


    useEffect(async () => {
        //let userAddress;
        if (walletAddress !== undefined) {
            // userAddress = localStorage.getItem("address");
            try {
                const balance = await beeContract.methods.balanceOf(walletAddress).call();
                const totalRev = await baseContract.methods.getTotalRefRevenue(walletAddress).call();
                console.log(totalRev)
                setTotalRefRevenue(totalRev);
                setBalance(balance)
            } catch (err) {
                console.log(err)
            }
        }

    }, [walletAddress])


    const fetchReferrals = async (address) => {
        let list = [];

        try {
            const q = query(collection(db, "users"))

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                
                    if (doc.data().user.address === address) {
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

    useEffect(() => {
        fetchReferrals(localStorage.getItem("address"));
    }, [walletAddress])


    const getMonthTotal = (input) => {
        console.log(input)
        let amount = 0;
        setBonus(0)
        
        let month = getMonth();
        console.log(month)

        console.log(referrals.length)

        referrals.forEach((y) => {
            if (input === "thisMonth") {
                
                if (monthHelper(y.referral.date) === month) {
                    console.log(y.referral)
                    amount += y.referral.bonus
                }
            } else if (input === "lastMonth") {
                
                if ((monthHelper(y.referral.date)) === (month - 1)) {
                    console.log(y.referral)
                    amount += y.referral.bonus
                }

            } 

        })

        //console.log('This is this month amount' + thisMonthAmount)
        //console.log('This is last month amount' + lastMonthAmount)
        
       
        setBonus(amount)
        

        
        
        toggleMonths();
    }

    const lastMonthDisable = (doc) => {
        console.log(doc)
        const firstMonth = doc.data().user.createdAt;
        if (monthHelper(firstMonth) === monthHelper(Date.now())) {
            setLastMonthDisabled(true)
        }
    }

    /*useEffect(() => {
        lastMonthDisable()
    }, [activeRefCode])*/

    const convertMonth = (month) => {
        switch (month) {
            case 1:
                return 'January'
            case 2:
                return 'February'
            case 3:
                return 'March'
            case 4:
                return 'April'
            case 5:
                return 'May'
            case 6:
                return 'June'
            case 7:
                return 'July'
            case 8:
                return 'August'
            case 9:
                return 'September'
            case 10:
                return 'October'
            case 11:
                return 'November'
            case 12:
                return 'December'
            default:
                return 'This Month'
        }
    }





    //Retrieve Orders

    const fetchOrders = async (address) => {
        let list = [];
        try {
            const q = query(collection(db, "users"))

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                if (doc.data().user.address == address) {
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

    useEffect(() => {
        fetchOrders(localStorage.getItem("address"));
    }, [walletAddress])




    //RetrieveReferralCode
    const fetchReferralCode = async (address) => {

        try {

            const q = query(collection(db, "users"))

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                if ((doc.data().user.address).toLowerCase() == address) {
                    console.log(doc)
                    lastMonthDisable(doc)
                    setActiveRefCode(doc)
                }


            })
        } catch (err) {
            console.log(err)
        }


    };

    const getTotalRefRevenue = async (address) => {
        const totalRev = await baseContract.methods.getTotalRefRevenue(address).call();
        console.log(totalRev)
        setTotalRefRevenue(totalRev);
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
            localStorage.setItem("address", "")
            console.log("You are logged out");

            router.push('/')


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

                    try {
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
                    }


                })


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

        try {

            const icoContract = new web3.eth.Contract(
                contractABI,
                contractAddress
            )

            const fiatContract = new web3.eth.Contract(
                fiatABI,
                fiatAddress
            );

            let refValue;



            if (ref > 0) {
                refValue = ref;
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



                }))
            }



        } catch (err) {


            const icoContract = new provider.eth.Contract(
                contractABI,
                contractAddress
            )

            const fiatContract = new provider.eth.Contract(
                fiatABI,
                fiatAddress
            );

            let refValue;



            if (ref > 0) {
                refValue = ref;
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



    // Handle pagination click
    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    // Handle orders per page selection
    const handleOrdersPerPageChange = (event) => {
        const selectedOrdersPerPage = parseInt(event.target.value, 10);
        setOrdersPerPage(selectedOrdersPerPage);
        setCurrentPage(1);
    };

    // Handle input change for jumping to a specific page
    const handlePageInputChange = (event) => {
        let page = parseInt(event.target.value, 10);
        if (isNaN(page)) {
            page = currentPage;
        }
        if (page < 1) {
            page = 1;
        } else if (page > totalPages) {
            page = totalPages;
        }
        setCurrentPage(page);
    };

    // Handle going to the first page
    const goToFirstPage = () => {
        setCurrentPage(1);
    };

    // Handle going to the last page
    const goToLastPage = () => {
        setCurrentPage(totalPages);
    };

    // Handle going back 1 page
    const goBack = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Handle going forward 1 page
    const goForward = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };


    const getRound = (round) => {
        switch (round) {
            case '0':
                return `Round 1 / 0.01`
            case '1':
                return `Round 2 / 0.02`
            case '2':
                return `Round 3 / 0.03`
            case '3':
                return `Round 4 / 0.04`
            default:
                return `Unknown`
        }
    }



    const getDiscount = (pack, price) => {
        switch (pack) {
            case 0:
                return price
            case 1:
                return parseInt(price + (price * .02)).toFixed(0)
            case 2:
                return parseInt(price + (price * .03)).toFixed(0)
            case 3:
                return parseInt(price + (price * .01)).toFixed(0)
            case 4:
                return parseInt(price + (price * .25)).toFixed(0)
            case 5:
                return parseInt(price + (price * .15)).toFixed(0)
            case 6:
                return parseInt(price + (price * .1)).toFixed(0)
            case 7:
                return parseInt(price + (price * .07)).toFixed(0)
            default:
                return price
        }
    }

    const getPackage = (pack) => {
        switch (pack) {
            case 0:
                return 'Mercury'
            case 1:
                return 'Venus'
            case 2:
                return 'Earth'
            case 3:
                return 'Mars'
            case 4:
                return 'Jupiter'
            case 5:
                return 'Saturn'
            case 6:
                return 'Uranus'
            case 7:
                return 'Neptune'
            default:
                return pack
        }
    }

    const toggleMonths = () => {
        setIsThisMonth(!isThisMonth)
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




            <section style={{ zIndex: loginModal ? "-10" : "0", opacity: verificationWall ? "0%" : "100%" }} className="relative flex flex-wrap w-full min-h-[800px] justify-center md:items-start md:justify-start bg-royalblue mx-auto py-12 mt-10 overflow-x-hidden"
                id="">


                <div style={{ opacity: errorModal || loginModal ? "10%" : "100%" }} className='w-full h-full'
                >

                    <div className='flex w-10/12 mx-auto  mt-10 grid grid-cols-2  gap-y-4 gap-x-28'>

                        <span className='flex flex-row w-full justify-end items-center'><p className='flex justify-start  whitespace-nowrap'>Your Personal Referral Link:</p>
                            <span>
                                {activeRefCode ? (
                                    <div className='flex flex-row items-center '>
                                        <button onClick={() => { copyText(activeRefCode) }} className="flex w-full whitespace-nowrap rounded-md ml-1 mr-1 my-3 justify-center items-center bg-blue-400 hover:bg-green-300 py-2 px-1">
                                            {copyMessage ? copyMessage : <p className='text-sm tracking-tighter'>{`https://infinitybee.vercel.app?ref=${activeRefCode.data().user.referralCode}`}</p>}

                                        </button>
                                        <div onClick={() => { copyText(activeRefCode) }}>
                                            <FileCopyOutlined />
                                        </div>


                                    </div>

                                ) : (
                                    <div className='flex flex-row'>
                                        <button onClick={generateReferralCode} className="flex w-full whitespace-nowrap rounded-md ml-5 mr-1 my-3 justify-center items-center bg-blue-400 hover:bg-green-300 py-2 px-4">


                                            Generate Referral Code

                                        </button>
                                        <div onClick={generateReferralCode}>
                                            <FileCopyOutlined />
                                        </div>
                                    </div>

                                )}

                            </span></span>
                        <span className='flex items-center'><p>Your Income</p></span>
                        <span className='flex flex-row w-full justify-end items-center'><p className='flex justify-end mr-2'>How many people signed up using your referral link: </p><p className='flex justify-end'>{activeRefCode ? (activeRefCode.data().user.signUps ? activeRefCode.data().user.signUps : 0) : 0}</p></span>
                        <span className='flex flex-row w-full items-center'><p className='mr-2'>Total:</p><p>{totalRefRevenue / 10 ** 6}</p></span>
                        <span className='flex flex-row w-full whitespace-nowrap justify-end items-center'><p className='mr-2'>How many people have bought a package using your referral link: </p><p >{activeRefCode ? (activeRefCode.data().user.timesBought ? activeRefCode.data().user.timesBought : 0) : 0}</p></span>
                        <span className='flex flex-row w-full items-center'>

                            {isThisMonth ? (
                                <>
                                    <p className='mr-2'>{thisMonth}</p>

                                    <p>{activeRefCode ? (bonus) : 0} USDT</p><div onClick={() => { lastMonthDisabled ? null : getMonthTotal("lastMonth") }}><ArrowDropUpOutlined /></div><div onClick={() => { lastMonthDisabled ? null : getMonthTotal("lastMonth") }}><ArrowDropDownOutlined /></div>
                                </>
                            ) : (
                                <>
                                {console.log('This is the last month bonus: ' + bonus)}
                                    <p className='mr-2'>{lastMonth}</p>

                                    <p>{activeRefCode ? (bonus) : 0} USDT</p><div onClick={() => { getMonthTotal("thisMonth") }}><ArrowDropUpOutlined /></div><div onClick={() => { getMonthTotal("thisMonth") }}><ArrowDropDownOutlined /></div>
                                </>

                            )}
                        </span>



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


                <div className='flex w-10/12 mx-auto  mt-10 grid grid-cols-2  gap-y-10 gap-x-48'>

                    <span className='flex flex-row w-full whitespace-nowrap justify-start items-center'><p className='mr-2'>TOTAL AMOUNT of InfinityBee TOKENS: </p><p>{balance / 10 ** 18}</p></span>
                    <span></span>
                    <span>YOUR PACKAGE(s) PURCHASED</span>
                    {/* Render pagination controls */}
                    <div className='flex w-11/12 justify-end'>
                        {/* Render 'First' button */}
                        <button className='bg-blue-400 mx-1 rounded p-1 hover:bg-green-300 cursor-pointer' onClick={goToFirstPage} disabled={currentPage === 1}>
                            <FirstPage />
                        </button>

                        {/* Render 'Back' button */}
                        <button className='bg-blue-400 mx-1 rounded p-1 hover:bg-green-300 cursor-pointer' onClick={goBack} disabled={currentPage === 1}>
                            <NavigateBefore />
                        </button>

                        {/* Render page input */}
                        <span className="flex flex-row">
                            <input
                                className='text-black text-center p-1'
                                type="number"
                                min="1"
                                max={totalPages}
                                value={currentPage}
                                onChange={handlePageInputChange}
                            />
                            <p className='p-1'>of {totalPages ? totalPages : 1}</p>
                        </span>

                        {/* Render 'Forward' button */}
                        <button className='bg-blue-400 mx-1 rounded p-1 hover:bg-green-300 cursor-pointer' onClick={goForward} disabled={currentPage === totalPages}>
                            <NavigateNext />
                        </button>

                        {/* Render 'Last' button */}
                        <button className='bg-blue-400 mx-1 rounded p-1 hover:bg-green-300 cursor-pointer' onClick={goToLastPage} disabled={currentPage === totalPages}>
                            <LastPage />
                        </button>

                        {/* Render orders per page selection */}
                        <select className='text-black flex justify-end items-center' value={ordersPerPage} onChange={handleOrdersPerPageChange}>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50 </option>
                        </select>
                    </div>


                </div>






                <div className='flex w-full -mt-8 bg-transparent'>
                    {/* Render the current orders */}
                    <table className='flex flex-col w-10/12 justify-center text-center p-1 mx-auto bg-transparent'>
                        <tr className='flex w-full gap-x-6 justify-center bg-slate950 mb-2'>
                            <td className='flex w-full justify-center text-center'>No. Crt</td>


                            <td className='flex w-full justify-center text-center'>Date of Purchase</td>
                            <td className='flex w-full justify-center text-center'>Package Name</td>
                            <td className='flex w-full justify-center text-center'>Price</td>
                            <td className='flex w-full justify-center text-center'>Round / IFB value</td>
                            <td className='flex w-full justify-center text-center'>InfinityBee amount</td>
                            <td className='flex w-full justify-center text-center'>Total Value (USDT)</td>
                        </tr>
                        {currentOrders.map((item, key) => (
                            <tr className='flex w-full gap-x-6 whitespace-nowrap mx-auto text-center p-1 bg-slate950 justify-center mb-2'>
                                <td className='flex w-full justify-center text-center'>{key + 1}</td>
                                <td className='flex w-full justify-center  text-center'>{dateHelper(item.order.date)}</td>
                                <td className='flex w-full justify-center text-center'>{getPackage(item.order.package)}</td>
                                <td className='flex w-full justify-center text-center'>{item.order.price}</td>
                                <td className='flex w-full justify-center text-center'>{getRound(item.order.round)}</td>
                                <td className='flex w-full justify-center text-center'>{getDiscount(item.order.package, item.order.amount)}</td>
                                <td className='flex w-full justify-center text-center'>{item.order.value}</td>
                            </tr>

                        ))}

                    </table>


                </div>



            </section>


            <Footer />








        </>
    )
}

