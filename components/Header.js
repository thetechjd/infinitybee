import React, { useCallback, useState, useRef } from 'react'
import Link from 'next/link'









export default function Header(props) {


  const [packages, setPackages] = useState(false);
  const [pmenu, setPmenu] = useState(false);
  const [amenu, setAmenu] = useState(false)
  const [omenu, setOmenu] = useState(false)
  const [lmenu, setLmenu] = useState(false)
  const [about, setAbout] = useState(false);
  const [languages, setLanguages] = useState(false);
  const [office, setOffice] = useState(false)




  const showPackages = (bool) => {
    setPackages(bool)
  }

  const showOmenu = (bool) => {
    setOmenu(bool)
  }


  const showPmenu = (bool) => {
    setPmenu(bool);

  }

  const showOffice = (bool) => {
    setOffice(bool)
  }



  const showAbout = (bool) => {
    setAbout(bool);
  }

  const showAmenu = (bool) => {
    setAmenu(bool);

  }


  const showLanguages = (bool) => {
    setLanguages(bool);
  }

  const showLmenu = (bool) => {
    setLmenu(bool)
  }

  return (
    <header className='fixed w-full top-0 md:px-8 px-5 pt-5 pb-3 z-70 transition-colors duration-500 z-30 flex-none md:z-40 bg-lavender'>

      {/* Header Container */}
      <div className='flex h-full items-center justify-center max-w-11xl mx-auto border-opacity-0'>

        {/* Logo Section */}

        <div className='flex-grow '>
          <div className='flex flex-row'>
            <Link className='w-1/5' href='/' passHref>
              <a className='flex items-center'>

                <img alt='' src='/images/beelogo.png' className='h-[40px]' />
                <span className='px-2'>InfinityBee (IFB)</span>
              </a>
            </Link>
            <div>

            <a href='' className='flex px-3 text-xl tracking-widest items-center pt-0.5'>White Paper</a>
          </div>
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

                  <li onClick={() => props.setIsNavOpen(false)} className="border-b text-white border-gray-400 my-2 uppercase">
                    <a href="#adventurer">{props.translate("packages")}</a>
                  </li>
                  <li className="border-b text-white border-gray-400 my-2 uppercase">
                    <a href="">{props.translate("about")}</a>
                  </li>
                  <li className="border-b text-white border-gray-400 my-2 uppercase">
                    <details href="">
                      <summary>{props.lang}</summary>
                      <p onClick={() => { props.lang === 'RO' ? props.setLang('EN') : props.setLang('RO') }} className='flex w-full justify-between bg-opacity-60 text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>{props.lang === 'RO' ? <p>EN</p> : <p>RO</p>}</p>
                      <p onClick={() => { props.lang === 'ES' ? props.setLang('EN') : props.setLang('ES') }} className='flex w-full justify-between bg-opacity-60  text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>{props.lang === 'ES' ? <p>EN</p> : <p>ES</p>}</p>
                      <p onClick={() => { props.lang === 'FR' ? props.setLang('EN') : props.setLang('FR') }} className='flex w-full justify-between bg-opacity-60  text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>{props.lang === 'FR' ? <p>EN</p> : <p>FR</p>}</p>
                      <p onClick={() => { props.lang === 'DE' ? props.setLang('EN') : props.setLang('DE') }} className='flex w-full justify-between bg-opacity-60  text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>{props.lang === 'DE' ? <p>EN</p> : <p>DE</p>}</p>
                      <p onClick={() => { props.lang === 'IT' ? props.setLang('EN') : props.setLang('IT') }} className='flex w-full justify-between bg-opacity-60  text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>{props.lang === 'IT' ? <p>EN</p> : <p>IT</p>}</p>
                      <p onClick={() => { props.lang === 'CN' ? props.setLang('EN') : props.setLang('CN') }} className='flex w-full justify-between bg-opacity-60  text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>{props.lang === 'CN' ? <p>EN</p> : <p>CN</p>}</p>
                    </details>
                  </li>
                  <li onClick={() => { props.setIsNavOpen(false); props.showLoginModal(true) }} className="border-b text-white border-gray-400 my-2 uppercase">
                    <p>Login</p>
                  </li>



                </ul>
              </div>
            </div>
          </section>

          <ul className="DESKTOP-MENU hidden lg:h-full space-x-5 lg:flex mr-20">



            <li className='relative' >
              <div onMouseEnter={() => { showPackages(true) }}
                onMouseLeave={() => {
                  setTimeout(() => {
                    if (!pmenu) {
                      showPackages(false)
                    }
                  }, 300)
                }}
                className='hidden sm:flex w-full bg-opacity-0 text-white opacity-80 items-center relative h-9 tracking-widest pt-0.5 first::pt-0 uppercase text-lg padding-huge bg-blue-300 duration-200 px-10 flex justify-center flex-row cursor-pointer '>
                <p className='relative rounded uppercase text-xs font-black
          text-white md:flex'>{props.translate("packages")}</p>
              </div>
              {(packages || pmenu) && (
                <div onMouseEnter={() => { showPmenu(true) }} onMouseLeave={() => { showPackages(false); showPmenu(false) }} className='absolute dropdown-column my-2'>
                  <a href='#adventurer'><div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Mercury <span id="price" className='flex w-1/2'>200 USDT</span></div></a>
                  <a href='#adventurer'><div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Mars <span id="price" className='flex w-1/2'>500 USDT</span></div></a>
                  <a href='#adventurer'><div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Venus <span id="price" className='flex w-1/2'>1.1K USDT</span></div></a>
                  <a href='#master'><div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Earth <span id="price" className='flex w-1/2'>2.3K USDT</span></div></a>
                  <a href='#master'><div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Neptune <span id="price" className='flex w-1/2 mx-2'>5K USDT</span></div></a>
                  <a href='#master'><div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Uranus <span id="price" className='flex w-1/2'>11K USDT</span></div></a>
                  <a href='#legend'><div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Saturn <span id="price" className='flex w-1/2'>23K USDT</span></div></a>
                  <a href='#legend'><div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Jupiter <span id="price" className='flex w-1/2'>48K USDT</span></div></a>
                </div>
              )}

            </li>
            <li className='relative'>
              <div onMouseEnter={() => { showAbout(true) }}
                onMouseLeave={() => {
                  setTimeout(() => {
                    if (!amenu) {
                      showAbout(false)
                    }
                  }, 300)
                }}
                className='hidden sm:flex w-full bg-opacity-0 text-white opacity-80 items-center relative h-9 tracking-widest pt-0.5 first::pt-0 uppercase text-lg padding-huge bg-blue-300 duration-200 px-10 flex justify-center flex-row cursor-pointer '>
                <p className='rounded uppercase text-xs font-black
          text-white md:flex'>{props.translate("about")}</p>
              </div>
              {(about || amenu) && (
                <div onMouseEnter={() => { showAmenu(true) }} onMouseLeave={() => { showAbout(false); showAmenu(false) }} className='absolute justify-center items-center my-2'>
                  <div className='flex w-full justify-center bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>About IFB token</div>
                  <div className='flex w-full justify-center bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Tokenomics</div>
                  <div className='flex w-full justify-center bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Presale Rounds</div>
                  <a href='#roadmap'><div className='flex w-full justify-center bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Roadmap</div></a>
                  {/*<div className='flex w-full justify-center bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>White paper</div>*/}
                  <a href="#faq"><div className='flex w-full justify-center bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>FAQ</div></a>

                  <div className='flex w-full justify-center bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Contact Us</div>
                  
                </div>
              )}
            </li>
            <li className='relative'>
              <div onMouseEnter={() => { showLanguages(true) }}
                onMouseLeave={() => {
                  setTimeout(() => {
                    if (!lmenu) {
                      showLanguages(false)
                    }
                  }, 300)
                }}
                className='hidden sm:flex w-full bg-opacity-0 text-white opacity-80 items-center relative h-9 tracking-widest pt-0.5 first::pt-0 uppercase text-lg padding-huge bg-blue-300 duration-200 px-10 flex justify-center flex-row cursor-pointer '>
                <span className='w-full flex flex-row'><p className='rounded uppercase text-xs font-black
          text-white md:flex'>{props.lang}</p> <img src={`/images/${props.lang}_icon.png`} className='w-[20px]' /></span>
              </div>
              {(languages || lmenu) && (
                <div onMouseEnter={() => { showLmenu(true) }} onMouseLeave={() => { showLanguages(false); showLmenu(false) }} className='absolute my-2'>
                  <div onClick={() => { props.lang === 'RO' ? props.setLang('EN') : props.setLang('RO') }} className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>{props.lang === 'RO' ? <p>English</p> : <p>Romanian</p>}</div>
                  <div onClick={() => { props.lang === 'ES' ? props.setLang('EN') : props.setLang('ES') }} className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>{props.lang === 'ES' ? <p>English</p> : <p>Spanish</p>}</div>
                  <div onClick={() => { props.lang === 'FR' ? props.setLang('EN') : props.setLang('FR') }} className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>{props.lang === 'FR' ? <p>English</p> : <p>French</p>}</div>
                  <div onClick={() => { props.lang === 'DE' ? props.setLang('EN') : props.setLang('DE') }} className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>{props.lang === 'DE' ? <p>English</p> : <p>German</p>}</div>
                  <div onClick={() => { props.lang === 'IT' ? props.setLang('EN') : props.setLang('IT') }} className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>{props.lang === 'IT' ? <p>English</p> : <p>Italian</p>}</div>
                  <div onClick={() => { props.lang === 'CN' ? props.setLang('EN') : props.setLang('CN') }} className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>{props.lang === 'CN' ? <p>English</p> : <p>Chinese</p>}</div>
                </div>
              )}
            </li>

            <li className='relative'>
              <div onMouseEnter={() => { showOffice(true) }}
                onMouseLeave={() => {
                  setTimeout(() => {
                    if (!omenu) {
                      showOffice(false)
                    }
                  }, 300)
                }}
                className='hidden sm:flex w-full bg-opacity-0 text-white opacity-80 items-center relative h-9 tracking-widest pt-0.5 first::pt-0 uppercase text-lg padding-huge bg-blue-300 duration-200 px-10 flex justify-center flex-row cursor-pointer '>
                <span className='w-full flex flex-row'><p className='rounded uppercase text-xs font-black
          text-white md:flex'>My Account</p></span>
              </div>
              {(office || omenu) && (
                <div onMouseEnter={() => { showOmenu(true) }} onMouseLeave={() => { showOffice(false); showOmenu(false) }} className='absolute ml-8 my-2'>
              <div className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>Back Office</div>
              <div onClick={props.loggedIn ? props.logOut : props.showLoginModal} className='flex w-full justify-between bg-lavender bg-opacity-60 bg-lavender text-sm hover:bg-blue-300 my-1 px-4 py-2 whitespace-nowrap'>
                <p className='rounded uppercase text-xs font-black
          text-white md:flex'>{props.loggedIn ? "Logout" : props.translate("login")}</p>
              </div>
              </div>
              )}
            </li>
            {/*} <li className='flex h-full items-center my-auto'>
                <img src='/images/basket.png' className='flex w-[20px] hover:w-[30px] items-center justify-center'/>
                </li>*/}

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