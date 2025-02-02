import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import AuthForm from "./Auth/AuthForm";
import WhatsApp from "./WhatsApp/WhatsApp";

const App = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [idInstance, setIdInstance] = useState('');
    const [apiTokenInstance, setApiTokenInstance] = useState('');

    // Проверяем, есть ли сохраненные данные в localStorage при загрузке приложения
    useEffect(() => {
        const savedIdInstance = localStorage.getItem('idInstance');
        const savedApiTokenInstance = localStorage.getItem('apiTokenInstance');

        if (savedIdInstance && savedApiTokenInstance) {
            setIdInstance(savedIdInstance);
            setApiTokenInstance(savedApiTokenInstance);
            setIsAuth(true);
        }
    }, []);

    // Обработчик авторизации
    const handleAuth = ({ idInstance, apiTokenInstance }) => {
        localStorage.setItem('idInstance', idInstance);
        localStorage.setItem('apiTokenInstance', apiTokenInstance);
        setIdInstance(idInstance);
        setApiTokenInstance(apiTokenInstance);
        setIsAuth(true);
    };
    const handleLogout = () => {
        localStorage.removeItem('idInstance');
        localStorage.removeItem('apiTokenInstance');
        setIdInstance('');
        setApiTokenInstance('');
        setIsAuth(false);
    };
    return (
        <div className={'max-w-[1600px] mx-auto'}>
            {isAuth ? (
                <WhatsApp
                    idInstance={idInstance}
                    apiTokenInstance={apiTokenInstance}
                    onLogout={handleLogout}
                />
            ) : (
                <AuthForm onAuth={handleAuth}/>
            )}
        </div>
    );
};

export default App;