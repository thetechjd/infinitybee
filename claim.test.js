
//-------variables-------------//

const [canClaim, setCanClaim] = useState(false)
const [claimTime, setClaimTime] = useState(0)




useEffect(async () => {
   try {
   const nextClaim = await icoContract.methods.getClaimPeriod(walletAddress).call()
   if(Date.now() > nextClaim * 1000){
    setCanClaim(true)

   }
} catch(error){
    setCanClaim(false)
}

}, [walletAddress])

useEffect(async() => {
    getTimeLeft();
})

useEffect(() => {
    const interval = setInterval(() => {

      setClaimTime(claimTime => claimTime - 1);
    }, 1000);
    return () => clearInterval(interval);

  }, [])




const getTimeLeft = async () => {
    let endTime = await icoContract.methods.getClaimPeriod(walletAddress).call();
   
    let start = (Date.now() / 1000);

    let countdown;
    if (endTime < start) {
      countdown = 0;
    } else {
      countdown = endTime - start;
    }
    console.log(countdown)
    setClaimTime(countdown);


  }


function secondsToDhms(seconds) {

    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + ":" : "";
    var hDisplay = h > 0 ? (h < 10 ? "0" + h + ":" : h + ":") : "";
    var mDisplay = m > 0 ? (m < 10 ? "0" + m + ":" : m + ":") : "";
    var sDisplay = s > 0 ? (s < 10 ? "0" + s : s) : "";

    
      if (seconds !== 0) {
        return {
            days: dDisplay,
            hours: hDisplay,
            minutes: mDisplay,
            seconds: sDisplay
        }
      } else {

        setCanClaim(true);
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        }
      } 

    }


const claim = async () => {
    if(canClaim){
        await icoContract.methods.claim().send({from: walletAddress})
        setCanClaim(false)
    }
}


  










//--------JSX----------------//


<span className="ceClaim ceBackRight flex justify-start items-center">
{canClaim ? (
    <button onClick={claim} className="ceBold flex whitespace-nowrap rounded-md ml-1 mr-1 my-3 justify-center items-center bg-blue-400 hover:bg-green-300 py-2 px-1">
    Claim IFB tokens
    </button>
):(
    <>
    <p><span>{secondsToDhms(claimTime).days}</span> days</p>
<p><span>{secondsToDhms(claimTime).hours}</span> hours</p>
<p><span>{secondsToDhms(claimTime).minutes}</span> minutes</p>
</>
)}


</span>