import React, {useState} from 'react'
import Link from 'next/link'


export default function Header(props){
    const [packages, setPackages] = useState(false);
    const [about, setAbout] = useState(false);
    const [languages, setLanguages] = useState(false);


    const showPackages = () => {
        setPackages(!packages);
    }

    const showAbout = () => {
      setAbout(!about);
    }

    const showLanguages = () => {
      setLanguages(!languages);
    }

    return(
        <header className='fixed w-full top-0 md:px-8 px-5 pt-5 pb-3 z-70 transition-colors duration-500 z-40 flex-none md:z-50 bg-lavender'>

        {/* Header Container */}
        <div className='flex h-full items-center justify-center max-w-11xl mx-auto border-opacity-0'>

          {/* Logo Section */}

          <div className='flex-grow'>
            <div className='flex '>
              <Link className='w-1/5' href='/' passHref>
                <a className='flex items-center'>

                  <img alt='' src='/images/beelogo.png' className='h-[40px]' />
                  <span className='px-2'>InfinityBee (IFB)</span>
                </a>
              </Link>
            </div>
          </div>



          <nav>

            <section className="MOBILE-MENU flex lg:hidden">
              <div
                className="HAMBURGER-ICON space-y-2"
                onClick={() => props.setIsNavOpen((prev) => !prev)}
              >
                <span className="block h-0.5 w-12 animate-pulse bg-gray-100"></span>
                <span className="block h-0.5 w-12 animate-pulse bg-gray-100"></span>
                <span className="block h-0.5 w-12 animate-pulse bg-gray-100"></span>
              </div>

              <div className={props.isNavOpen ? "showMenuNav" : "hideMenuNav"}>
                <div
                  className="absolute top-0 right-0 px-8 py-8"
                  onClick={() => props.setIsNavOpen(false)}
                >
                  <svg
                    className="h-8 w-8 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <div className=''>
                  <ul className="flex flex-col items-center justify-between min-h-[250px]">

                    <li className="border-b text-white border-gray-400 my-2 uppercase">
                      <a href="">Packages</a>
                    </li>
                    <li className="border-b text-white border-gray-400 my-2 uppercase">
                      <a href="/store">About</a>
                    </li>
                    <li className="border-b text-white border-gray-400 my-2 uppercase">
                      <a href="">EN</a>
                    </li>
                    <li className="border-b text-white border-gray-400 my-2 uppercase">
                      <a href="">Login</a>
                    </li>
                    

            
                  </ul>
                </div>
              </div>
            </section>

            <ul className="DESKTOP-MENU hidden space-x-8 lg:flex mr-10">


              
              <li className='relative'>
                <a href="/member"  onMouseEnter={showPackages} className='hidden sm:flex w-full bg-opacity-0 text-white opacity-80 items-center relative h-9 tracking-widest pt-0.5 first::pt-0 uppercase text-lg padding-huge bg-blue-300 duration-200 px-10 flex justify-center flex-row cursor-pointer '>
                  <p className='rounded uppercase text-xs font-black
          text-white md:flex'>Packages</p>
                </a>
                {packages &&(
                    <div onMouseLeave={showPackages} className='absolute my-2'>
                    <a href='#adventurer'><div  className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Mercury <span id="price" className='flex w-1/2'>200 USDT</span></div></a>
                    <a href='#adventurer'><div  className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Mars <span id="price" className='flex w-1/2'>500 USDT</span></div></a>
                    <a href='#adventurer'><div  className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Venus <span id="price"  className='flex w-1/2'>1.1K USDT</span></div></a>
                    <a href='#master'><div  className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Earth <span id="price" className='flex w-1/2'>2.3K USDT</span></div></a>
                    <a href='#master'><div  className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Neptune <span id="price" className='flex w-1/2 mx-2'>5K USDT</span></div></a>
                    <a href='#master'><div  className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Uranus <span id="price" className='flex w-1/2'>11K USDT</span></div></a>
                    <a href='#legend'><div  className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Saturn <span id="price" className='flex w-1/2'>23K USDT</span></div></a>
                    <a href='#legend'><div  className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Jupiter <span id="price" className='flex w-1/2'>48K USDT</span></div></a>
                </div>
                )}
                


              </li>
              <li className='relative'>
                <a href="/member" onMouseEnter={showAbout} className='hidden sm:flex w-full bg-opacity-0 text-white opacity-80 items-center relative h-9 tracking-widest pt-0.5 first::pt-0 uppercase text-lg padding-huge bg-blue-300 duration-200 px-10 flex justify-center flex-row cursor-pointer '>
                  <p className='rounded uppercase text-xs font-black
          text-white md:flex'>About</p>
                </a>
                {about &&(
                    <div onMouseLeave={showAbout} className='absolute my-2'>
                    <div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>White paper</div>
                    <div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Roadmap</div>
                    <div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>About IFB token</div>
                    <div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Tokenomics</div>
                    <div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Contact Us</div>
                    <div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>FAQ</div>
                    <div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Presale Rounds</div>
                </div>
                )}
              </li>
              <li className='relative'>
                <a href="/member" onMouseEnter={showLanguages} className='hidden sm:flex w-full bg-opacity-0 text-white opacity-80 items-center relative h-9 tracking-widest pt-0.5 first::pt-0 uppercase text-lg padding-huge bg-blue-300 duration-200 px-10 flex justify-center flex-row cursor-pointer '>
                  <p className='rounded uppercase text-xs font-black
          text-white md:flex'>EN</p>
                </a>
                {languages &&(
                    <div onMouseLeave={showLanguages} className='absolute my-2'>
                    <div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Romanian</div>
                    <div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Spanish</div>
                    <div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>French</div>
                    <div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>German</div>
                    <div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Italian</div>
                    <div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Chinese</div>
                </div>
                )}
              </li>
              
              <li>
                <button className='hidden sm:flex bg-opacity-0 text-white opacity-80 items-center relative h-9 tracking-widest pt-0.5 first::pt-0 uppercase text-lg padding-huge bg-blue-300 duration-200 px-3 hover:bg-opacity-90 flex justify-center flex-row cursor-pointer '>
                  <p className='rounded uppercase text-xs font-black
          text-white md:flex'>Login</p>
                </button>
              </li>
              
              {/* CONNECT WALLET */}
             

            </ul>
          </nav>
          <style>{`
      .hideMenuNav {
        display: none;
      }
      .showMenuNav {
        display: block;
        position: absolute;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        background: #000;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
    `}</style>
        </div>

      </header>
    )
}