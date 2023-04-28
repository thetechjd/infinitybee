import Input from '../components/Input'

export default function LoginModal(props){
    
    


return (
    
        <div className='absolute bg-black w-full bg-transparent z-0'>
            
            <div className='flex justify-center'>
                <div  className='bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full'>
                    <h2 className='text-white text-4xl mb-8 font-semibold'>
                        {props.variant === 'login' ? 'Sign in': 'Register'}
                    </h2>
                    <div className='flex flex-col gap-4'>
                        {props.variant === 'register' ? (
                            <>
                            {props.walletAddress ? (
                                <div className='flex flex-col'>
                                <p>Wallet Address</p>
                                 <p className='text-sm'>{props.walletAddress}</p>
                                 </div>
                            
                            ):(
                                <button onClick={props.connectWallet} className='bg-royalblue py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition'>
                                    Connect Wallet
                                </button>
                    
                    
                            )}
                            
                       
                        <Input 
                        label="Email"
                        onChange={(e) => props.setEmail(e.target.value)}
                        id='email'
                        type='email'
                        value={props.email}
                        
                        />
                        <Input 
                        style={{border: props.errorMessage ? "#fff": null}}
                        label="Password"
                        onChange={(e) => props.handlePassword(e.target.value)}
                        id='password'
                        type={props.show ? 'text':'password'}
                        value={props.password}
                        error={props.errorMessage ? true:false}
                        show={props.show}
                        togglePw={props.togglePw}
                        
                        
                        
                        />
                        <p className='text-4xs text-red-500'>{props.errorMessage}</p>
                        <Input 
                        label="Re-Type Password"
                        onChange={(e) => props.handlePwCheck(e.target.value)}
                        id='pwcheck'
                        type={props.show ? 'text':'password'}
                        value={props.pwCheck}
                        error={props.errorMessage ? true:false}
                        show={props.show}
                        togglePw={props.togglePw}
                        
                        

                        
                        />
                        </>
                        ): (
                            <>
                             {props.walletAddress ? (
                                <div className='flex flex-col'>
                                <p>Wallet Address</p>
                                 <p className='text-sm'>{props.walletAddress}</p>
                                 </div>
                            
                           
                           ):(
                               <button onClick={props.connectWallet} className='bg-royalblue py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition'>
                                   Connect Wallet
                               </button>
                   
                   
                           )}

                           <Input 
                        label="Email"
                        onChange={(e) => props.setEmail(e.target.value)}
                        id='email'
                        type='email'
                        value={props.email}
                        
                        />

                           

                                 <Input 
                        label="Password"
                        onChange={(e) => props.setPassword(e.target.value)}
                        id='password'
                        type={props.show ? 'text':'password'}
                        value={props.password}
                        show={props.show}
                        togglePw={props.togglePw}
                        
                        />
                                 </>
                        )}
                    </div>
                    <button onClick={props.variant === 'login' ? props.signIn : props.signUp} className='bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition'>
                       {props.variant === 'login' ? 'Login' : 'Sign up'}
                    </button>
                    <p className='text-neutral-500 mt-12'>
                    {props.variant === 'register' ? 'Already have an account?': 'Don\'t have and account yet?'}
                        
                        <span onClick={props.toggleVariant} className='text-white ml-1 hover:underline cursor-pointer'>
                        {props.variant === 'register' ? 'Sign in': 'Create an account'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
   
)
                        }