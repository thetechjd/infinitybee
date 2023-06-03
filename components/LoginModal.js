import { useRef, useEffect } from 'react';
import Input from '../components/Input'


export default function LoginModal(props) {

    const wrapperRef = useRef(null);


    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                props.showLoginModal(false);
                props.setReset(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);





    return (
        <>
            {/*<div className='absolute bg-black w-full bg-transparent z-0'>*/}

            <div className='absolute flex items-center w-full justify-center z-0'>
                <div ref={wrapperRef} className='relative bg-black bg-opacity-70 px-16 py-10 self-center mt-10 lg:w-2/5 lg:max-w-md rounded-md w-full'>
                    <div onClick={() => { props.showLoginModal(false); props.setReset(false) }} className='flex right justify-end'>
                        <p className='text-white'>X</p>
                    </div>
                    <h2 className='text-white text-4xl mb-8 font-semibold'>
                        {props.variant === 'login' ? 'Sign in' : 'Register'}
                    </h2>
                    <div className='flex flex-col gap-4'>
                        {props.variant === 'register' ? (
                            <>

                                {!props.reset && (
                                    <>
                                        {props.walletAddress ? (
                                            <div className='flex flex-col'>
                                                <p>Wallet Address</p>
                                                <p className='text-sm'>{props.walletAddress}</p>
                                            </div>


                                        ) : (
                                            <>
                                            <button onClick={props.connectWallet} className='bg-royalblue py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition'>
                                                Connect Wallet
                                            </button>
                                             
                                                <p className='text-red-500'>Connect wallet to complete registration. Note that you will be unable to change your wallet address for the duration of the ICO. </p>
                                                </>
                                            


                                        )}
                                    </>
                                )}



                                <Input
                                    label="Email"
                                    onChange={(e) => props.setEmail(e.target.value)}
                                    id='email'
                                    type='email'
                                    value={props.email}

                                />
                                <Input
                                    style={{ border: props.loginMessage ? "#fff" : null }}
                                    label="Password"
                                    onChange={(e) => props.handlePassword(e.target.value)}
                                    id='password'
                                    type={props.show ? 'text' : 'password'}
                                    value={props.password}
                                    error={props.loginMessage ? true : false}
                                    show={props.show}
                                    togglePw={props.togglePw}



                                />
                                <p className='text-4xs text-red-500'>{props.loginMessage}</p>
                                <Input
                                    label="Re-Type Password"
                                    onChange={(e) => props.handlePwCheck(e.target.value)}
                                    id='pwcheck'
                                    type={props.show ? 'text' : 'password'}
                                    value={props.pwCheck}
                                    error={props.loginMessage ? true : false}
                                    show={props.show}
                                    togglePw={props.togglePw}




                                />
                            </>
                        ) : (
                            <>
                                {!props.reset && (
                                    <>
                                        {props.walletAddress ? (
                                            <div className='flex flex-col'>
                                                <p>Wallet Address</p>
                                                <p className='text-sm'>{props.walletAddress}</p>
                                            </div>


                                        ) : (
                                            <button onClick={props.connectWallet} className='bg-royalblue py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition'>
                                                Connect Wallet
                                            </button>


                                        )}
                                    </>
                                )}


                                <Input
                                    label="Email"
                                    onChange={(e) => props.setEmail(e.target.value)}
                                    id='email'
                                    type='email'
                                    value={props.email}

                                />

                                {!props.reset && (
                                    <Input
                                        label="Password"
                                        onChange={(e) => props.setPassword(e.target.value)}
                                        id='password'
                                        type={props.show ? 'text' : 'password'}
                                        value={props.password}
                                        show={props.show}
                                        togglePw={props.togglePw}
                                    />
                                )}




                            </>
                        )}
                    </div>

                    {props.reset ? (
                        <>
                            <button onClick={props.resetPassword} className='bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition'>
                                Reset Password
                            </button>

                            {props.loginMessage && (
                                <p className='text-red-500'>{props.loginMessage}</p>
                            )}
                        </>

                    ) : (
                        <button onClick={props.variant === 'login' ? props.signIn : props.signUp} className='bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition'>

                            {props.variant === 'login' ? 'Login' : 'Sign up'}
                        </button>
                    )}


                    <p className='text-neutral-500 mt-12'>
                        {props.variant === 'register' ? 'Already have an account?' : 'Don\'t have and account yet?'}

                        <span onClick={props.toggleVariant} className='text-white ml-1 hover:underline cursor-pointer'>
                            {props.variant === 'register' ? 'Sign in' : 'Create an account'}
                        </span>
                    </p>
                    <p className='text-neutral-500 mt-12'>
                        {!props.reset && (
                            <span onClick={props.setReset} className='text-white ml-1 hover:underline cursor-pointer'>
                                Reset Password
                            </span>
                        )}

                    </p>
                </div>
            </div>

            {/*}</div>*/}
        </>

    )
}