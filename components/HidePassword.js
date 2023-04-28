import React from 'react';





const HidePassword = ({togglePw, show}) => {
    return (
        <span className='flex w-1/5 rounded-md justify-center rounded-l-none bg-neutral-700 items-center'>
        <img onClick={togglePw} className='w-[20px]' src={show ? '/images/eye_closed.png': '/images/eye_open.png'}/>
     </span>
    )
}

export default HidePassword;