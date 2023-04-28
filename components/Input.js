import React, {useState} from 'react';
import HidePassword from '../components/HidePassword'





const Input = ({
    id,
    onChange,
    value,
    label,
    type,
    error,
    show,
    togglePw
    
}) => {
    
   
    
    return (
        <div className='relative w-full'>
        <div className='flex flex-row justify-between'>
        <input
        onChange={onChange}
        type={type}
        value={value}
        id={id}
        error={error}
        show={show}
        togglePw={togglePw}
        style={{ borderTopRightRadius: id === 'password' || id === 'pwcheck' ? "0px": null, borderBottomRightRadius: id === 'password' || id === 'pwcheck' ? "0px": null, borderColor: error ? "red": null, borderWidth: error ? "2px": null}}
        className='
        block
        rounded-md
        px-6
        pt-6
        pb-1
        w-full
        text-md
        text-white
        cursor-pointer
        bg-neutral-700
        appearance-none
        focus:outline-none
        focus:ring-0
        peer'
        placeholder=' '
        />
        <label
        className='
        absolute
        text-md
        text-zinc-400
        duration-150
        transform
        -translate-y-3
        scale-75
        top-4
        z-8
        origin-[0]
        left-6
        cursor-pointer
        peer-placeholder-shown:scale-100
        peer-placeholder-shown:translate-y-0
        peer-focus:scale-75
        peer-focus:-translate-y-3'


        htmlFor={id}
        >
            {label}
            
        </label>
        {(id === 'password' || id === 'pwcheck') &&(
            <HidePassword
            togglePw={togglePw}
            show={show}
             />

        )}
       
        </div>
        </div>
    )
}

export default Input;