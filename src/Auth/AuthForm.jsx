import React, { useState } from 'react';

export default function AuthForm ({ onAuth }) {
    const [idInstance, setIdInstance] = useState('');
    const [apiTokenInstance, setApiTokenInstance] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAuth({ idInstance, apiTokenInstance });
    };

    return (
        <div className={'main-content bg-[#111B21] flex justify-center items-center my-auto'}>
            <form onSubmit={handleSubmit}>
                <h2 className={'text-3xl text-white font-semibold mb-12'}>Авторизация в Green-API</h2>
                <div className={'flex flex-col mb-3'}>
                    <label className={'text-white mb-2'}>
                        Введите свой "idInstance":
                    </label>
                    <input
                        className={'bg-[#202C33] rounded-lg py-1 px-3 text-white outline-0'}
                        type="text"
                        value={idInstance}
                        onChange={(e) => setIdInstance(e.target.value)}
                        required
                    />
                </div>
                <div className={'flex flex-col mb-6'}>
                    <label className={'text-white mb-2'}>
                        Введите свой "apiTokenInstance":
                    </label>
                    <input className={'bg-[#202C33] rounded-lg py-1 px-3 text-white outline-0'}
                        type="password"
                        value={apiTokenInstance}
                        onChange={(e) => setApiTokenInstance(e.target.value)}
                        required
                    />
                </div>
                <button
                    className={'rounded-lg text-[#111B21] bg-[#00A884] py-1 px-3 w-full ' +
                        'hover:bg-[#037960] transition duration-300 ease-linear'}
                    type="submit">
                    Авторизоваться
                </button>
            </form>
        </div>
    );
}