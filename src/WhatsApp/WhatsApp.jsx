import React, { useState, useEffect } from 'react';
import axios from 'axios';

import UserChat from "./Components/UserChat";
import MessageChat from "./Components/MessageChat";

export default function WhatsAppSender ({ idInstance, apiTokenInstance, onLogout }){
    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messages, setMessages] = useState({});
    const [lastMessages, setLastMessages] = useState({});


    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    const urlApi = idInstance.toString().slice(0, 4);

    const handleUserChatClick = (chatId) => {
        setSelectedChatId(chatId);
    };
    const fetchChats = async () => {
        try {

            const cachedChats = localStorage.getItem('chats');
            if (cachedChats) {
                const parsedChats = JSON.parse(cachedChats);


                const cacheExpiration = localStorage.getItem('chatsExpiration');
                if (cacheExpiration && Date.now() < parseInt(cacheExpiration, 10)) {
                    setChats(parsedChats);
                    return;
                } else {

                    localStorage.removeItem('chats');
                    localStorage.removeItem('chatsExpiration');
                }
            }

            const response = await fetch(
                `https://${urlApi}.api.green-api.com/waInstance${idInstance}/GetChats/${apiTokenInstance}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData?.message || response.statusText}`);
            }

            const chatsData = await response.json();
            const updatedChats = [];

            for (const chat of chatsData) {
                try {
                    const raw = JSON.stringify({
                        chatId: chat.id,
                        count: 10,
                    });

                    const requestOptions = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: raw,
                        redirect: 'follow',
                    };

                    const historyResponse = await fetch(
                        `https://${urlApi}.api.green-api.com/waInstance${idInstance}/getChatHistory/${apiTokenInstance}`,
                        requestOptions
                    );

                    if (!historyResponse.ok) {
                        const errorData = await historyResponse.json();
                        throw new Error(`HTTP error! status: ${historyResponse.status}, message: ${errorData?.message || historyResponse.statusText}`);
                    }

                    const history = await historyResponse.json();
                    updatedChats.push({
                        ...chat,
                        message: history,
                        lastMessage: history.length > 0 ? history[0] : null,
                    });

                } catch (historyError) {
                    console.error(`Ошибка при загрузке истории чата ${chat.id}:`, historyError);
                    updatedChats.push({
                        ...chat,
                        lastMessage: null,
                        message: [],
                    });

                }
                await new Promise((resolve) => setTimeout(resolve, 1000));

            }
            setChats(updatedChats);


            localStorage.setItem('chats', JSON.stringify(updatedChats));


            const expirationTime = Date.now() + (60 * 60 * 1000);
            localStorage.setItem('chatsExpiration', expirationTime.toString());



        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    };

    useEffect(() => {
        fetchChats();
    }, [urlApi, idInstance, apiTokenInstance]);

    const sendMessage = async () => {
        const url = `https://${urlApi}.api.green-api.com/waInstance${idInstance}/SendMessage/${apiTokenInstance}`;

        try {
            const res = await axios.post(url, {
                chatId: `${phoneNumber}@c.us`,
                message: message,
            });
            setResponse(res.data);
        } catch (error) {
            setResponse('Ошибка при отправке сообщения');
            console.error(error);
        }
    };
    return (
        <div className={'main-content bg-[#111B21]'}>
            <div className={'grid grid-cols-[4%,27%,69%]'}>
                <div className={'header bg-[#202C33] border-e-2 border-[#2F3B43] flex justify-center py-5'}>
                    <span className={'chat active relative'}>
                        <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="z-20" fill="none">
                            <title>chats-outline</title>
                            <path
                            d="M4.8384 8.45501L5 8.70356V9V17.8333C5 18.7538 5.7462 19.5 6.6667 19.5H20.3333C21.2538 19.5 22 18.7538 22 17.8333V6.66667C22 5.74619 21.2538 5 20.3333 5H2.5927L4.8384 8.45501Z"
                            stroke="#AEBAC1" strokeWidth="2">

                            </path>
                            <line x1="10" y1="10" x2="17" y2="10" stroke="#AEBAC1" strokeWidth="2"
                                  strokeLinecap="round">
                            </line>
                            <line
                            x1="10" y1="14" x2="15" y2="14" stroke="#AEBAC1" strokeWidth="2"
                            strokeLinecap="round">
                            </line>
                        </svg>
                    </span>
                </div>
                <div className={'chats-block pt-4 px-4 border-e-2 border-[#2F3B43]'}>
                    <div className={'flex justify-between items-center mb-6 relative'}>
                        <h2 className={'text-white font-bold text-[22px]'}>Чаты</h2>
                        <span className={'new-chat'}>
                            <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" fill="none">
                                <title>new-chat-outline</title>
                                <path
                                d="M9.53277 12.9911H11.5086V14.9671C11.5086 15.3999 11.7634 15.8175 12.1762 15.9488C12.8608 16.1661 13.4909 15.6613 13.4909 15.009V12.9911H15.4672C15.9005 12.9911 16.3181 12.7358 16.449 12.3226C16.6659 11.6381 16.1606 11.0089 15.5086 11.0089H13.4909V9.03332C13.4909 8.60007 13.2361 8.18252 12.8233 8.05119C12.1391 7.83391 11.5086 8.33872 11.5086 8.991V11.0089H9.49088C8.83941 11.0089 8.33411 11.6381 8.55097 12.3226C8.68144 12.7358 9.09947 12.9911 9.53277 12.9911Z"
                                fill="#AEBAC1">
                                </path>
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M0.944298 5.52617L2.99998 8.84848V17.3333C2.99998 18.8061 4.19389 20 5.66665 20H19.3333C20.8061 20 22 18.8061 22 17.3333V6.66667C22 5.19391 20.8061 4 19.3333 4H1.79468C1.01126 4 0.532088 4.85997 0.944298 5.52617ZM4.99998 8.27977V17.3333C4.99998 17.7015 5.29845 18 5.66665 18H19.3333C19.7015 18 20 17.7015 20 17.3333V6.66667C20 6.29848 19.7015 6 19.3333 6H3.58937L4.99998 8.27977Z"
                                      fill="#AEBAC1">
                                </path>
                            </svg>
                        </span>
                    </div>
                    {
                        chats.map((chat) => (
                           <span key={chat.id} onClick={() => handleUserChatClick(chat.id)}>
                                <UserChat
                                    key={chat.id}
                                    id = {chat.id}
                                    phone = {chat.id.replace(/\D/g, '')}
                                    lastMessage = {chat.lastMessage|| null}

                                />
                           </span>
                            ))
                    }
                </div>
                <div className={'chat-content-block'}>
                    {
                        selectedChatId ? (
                            <MessageChat
                                chatId={selectedChatId}
                            />
                        ) : (<></>)
                    }

                </div>
            </div>
            {/*<h1>Отправить сообщение в WhatsApp</h1>
            <input
                type="text"
                placeholder="Номер телефона"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <textarea
                placeholder="Сообщение"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Отправить</button>
            {response && <p>Ответ: {JSON.stringify(response)}</p>}
            <button onClick={onLogout} style={{marginTop: '20px', color: 'red'}}>
                Выйти
            </button>*/}
        </div>
    );
}