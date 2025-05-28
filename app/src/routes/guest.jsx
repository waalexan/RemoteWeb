import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const Guest = () => {
    const [token, setToken] = useState('');
    const [devices, setDevices] = useState([]);
    const [adbToken, setAdbToken] = useState('');

    useEffect(() => {
        const socket = io();
        const generatedToken = generateToken(16);
        setToken(generatedToken);

        const storedDevices = JSON.parse(localStorage.getItem('device')) || [];
        setDevices(storedDevices);

        socket.on('connect', () => {
            console.log('Conectado ao servidor');
        });

        socket.on(`deviceaccept/${generatedToken}`, (data) => {
            try {
                const updatedDevices = [...(JSON.parse(localStorage.getItem('device')) || []), data];
                localStorage.setItem('device', JSON.stringify(updatedDevices));
                setDevices(updatedDevices);
            } catch (error) {
                console.error("Erro ao atualizar dispositivos no localStorage:", error);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const generateToken = (digit) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let link = '';
        for (let i = 0; i < digit; i++) {
            link += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return link;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/newConnect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: adbToken,
                    device: navigator.userAgent,
                    tokenGenerated: token
                })
            });

            if (response.ok) {
                console.log('Pedido de conexão enviado');
            } else {
                console.error('Erro ao enviar o pedido de conexão:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao enviar o pedido de conexão:', error);
        }
    };

    const handleDeviceClick = (device) => {
        sessionStorage.setItem('_selected_token', device.mytoken);
        sessionStorage.setItem('_selected_device', JSON.stringify(device, null, 2));
        window.location.href = '/shell';
    };

    return (
        <div>
            <h1>Controle Remoto</h1>

            <div>
                <form onSubmit={handleSubmit}>
                    <span>Pedido de acesso</span>
                    <input
                        type="text"
                        value={adbToken}
                        onChange={(e) => setAdbToken(e.target.value)}
                        placeholder="Token de dispositivo"
                        required
                    />
                    <button type="submit">Conectar</button>
                    <span>Temp token: <b>{token}</b></span>
                </form>
            </div>

            <div id="device-list">
                {devices.map((device, index) => (
                    <div key={index} onClick={() => handleDeviceClick(device)} style={{ cursor: 'pointer' }}>
                        <span>{device.user}</span>{' '}
                        <span>{device.system}</span>{' '}
                        <span>{device.platform}</span>{' '}
                        <span>{device.version}</span>{' '}
                        <span>{device.mytoken}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
