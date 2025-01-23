const os = require('os');
const { exec } = require('child_process');
const fs = require('fs');
const { io } = require('socket.io-client');
const readline = require('readline');

const system = os.type();
const user = os.userInfo().username;
const platform = os.platform();
const version = os.release();
const USER_PWD = process.env.HOME;
const file = '.ctrl_remote';
if (!file) {
    throw new Error('File name cannot be empty');
}
const api = 'https://ctrl-remote.onrender.com';

class Elementary {
    // Função para executar comandos do sistema
    executeCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(`Erro: ${error.message}`);
                    return;
                }
                if (stderr) {
                    reject(`Erro no comando: ${stderr}`);
                    return;
                }
                resolve(stdout);
            });
        });
    }

    generateToken = (digit) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let link = '';
        for (let i = 0; i < digit; i++) {
            link += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return link;
    };

    send_answer = async (serverToken, mytoken) => {
        console.log('Aguardando resposta do servidor...');
        try {
            const response = await fetch(`${api}/acceptConnect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    system,
                    platform,
                    version,
                    user:USER_PWD,
                    serverToken,
                    mytoken
                })
            });

            console.log('Resposta do servidor:', response.status);

            if (response.status === 200) {
                console.log('Conexão aceita.');
                // Adicione aqui a lógica para aceitar a conexão
            } else {
                console.log('Erro ao aceitar a conexão.');
                // Adicione aqui a lógica para tratar o erro
            }
        } catch (error) {
            console.log('Erro ao aceitar a conexão.', error);
        } finally {
            process.exit(0);
        }
    }

    send_stdout = async (mytoken, serverToken, stdout) => {
        try {
            const response = await fetch(`${api}/command/response`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    stdout,
                    serverToken,
                    mytoken
                })
            });

            if (response.status === 200) {
                console.log('commando execuato com sucesso');
                // Adicione aqui a lógica para aceitar a conexão
            } else {
                console.log('Erro ao aceitar a conexão.');
                // Adicione aqui a lógica para tratar o erro
            }
        } catch (error) {
            console.log('Erro ao aceitar a conexão.', error);
        }
    }

    // Função para esconder o sistema (suspender)
    async hide() {
        console.log(`[0%] Escondendo o sistema...`);
        try {
            if (system === 'Windows_NT') {
                await this.executeCommand('shutdown /s /f'); // Desliga o sistema no Windows
            } else if (system === 'Linux' || system === 'Darwin') {
                await this.executeCommand('systemctl suspend'); // Suspende o sistema no Linux/Mac
            } else {
                console.error('Sistema operacional não suportado para este comando.');
            }
            console.log("[100%] Sistema escondido com sucesso.");
        } catch (error) {
            console.error(`Erro ao esconder o sistema: ${error}`);
        }
    }

    // Função para desligar o sistema
    async shutdown() {
        console.log(`[0%] Desligando o sistema...`);
        try {
            if (system === 'Windows_NT') {
                await this.executeCommand('shutdown /s /f'); // Desliga o sistema no Windows
            } else if (system === 'Linux' || system === 'Darwin') {
                await this.executeCommand('systemctl poweroff'); // Desliga o sistema no Linux/Mac
            } else {
                console.error('Sistema operacional não suportado para este comando.');
            }
            console.log("[100%] Sistema desligado com sucesso.");
        } catch (error) {
            console.error(`Erro ao desligar o sistema: ${error}`);
        }
    }

    // Cria um token e salva no arquivo
    async init() {
        try {
            const token = this.generateToken(16);
            const filePath = platform === 'win32' ? `${USER_PWD}\\${file}` : `${USER_PWD}/${file}`;
            fs.writeFileSync(filePath, token);
            console.log("Token gerado e salvo com sucesso:", token);
        } catch (error) {
            console.error(`Erro ao criar o token: ${error.message}`);
        }
    }

    // Exibe o token armazenado no arquivo
    async show() {
        try {
            const filePath = platform === 'win32' ? `${USER_PWD}\\${file}` : `${USER_PWD}/${file}`;
            if (fs.existsSync(filePath)) {
                const token = fs.readFileSync(filePath, 'utf8');
                console.log(`Token armazenado: ${token}`);
            } else {
                console.log("Nenhum token encontrado.");
            }
        } catch (error) {
            console.error(`Erro ao exibir o token: ${error.message}`);
        }
    }

    async Listing (){
        let mytoken = null;

        const filePath = platform === 'win32' ? `${USER_PWD}\\${file}` : `${USER_PWD}/${file}`;
        if (fs.existsSync(filePath)) {
            mytoken = fs.readFileSync(filePath, 'utf8');    
        } else {
            console.log("Nenhum token encontrado.");
        }

        const socket = io(api);

        socket.on('connect', () => {
            console.log('[CONNECTED] Esperando commandos... \n');
        });

        socket.on('disconnect', () => {
            console.log('Desconectado do servidor');
            return;
        });

        socket.on(`signal/${mytoken}`, (data) => {
            if (data.command) {
                switch(data.command){
                    case 'shutdown':
                        this.shutdown();
                        break;
                    case 'hide':
                        this.hide();
                        break;
                    case 'init':
                        this.init();
                        break;
                    case 'connect':
                        this.Connect();
                        break;
                    default:
                        console.log("sinal desconhecimento")
                }
            } else {
                console.error('Erro: Comando vazio recebido.');
            }
        });

        socket.on(`command/${mytoken}`, (data) => {
            if (data.command) {
                exec(data.command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Erro: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.error(`Erro no comando: ${stderr}`);
                        return;
                    }
                    this.send_stdout(mytoken, data.myself, stdout);
                });
            } else {
                console.error('Erro: Comando vazio recebido.');
            }
        });
    }

    // Conecta-se ao servidor usando Socket.IO e emite mensagens
    async Connect() {
        let mytoken = null;

        const filePath = platform === 'win32' ? `${USER_PWD}\\${file}` : `${USER_PWD}/${file}`;
        if (fs.existsSync(filePath)) {
            mytoken = fs.readFileSync(filePath, 'utf8');    
        } else {
            console.log("Nenhum token encontrado.");
        }

        const socket = io(api);

        socket.on('connect', () => {
            console.log('[CONNECT] Esperando conexao... \n -> token: ', mytoken);
            socket.emit('clientMessage', `Cliente ${user} está escutando`);
        });


        socket.on('disconnect', () => {
            console.log('Desconectado do servidor');
            return;
        });

        socket.on(`deviceConnect/${mytoken}`, (data) => {
            console.log(`=======================================================`);
            console.log(`Novo pedido de conexão: ${data.serverToken}\n${data.device}`);
            console.log(`=======================================================`);

            // Adicione um campo leitor de texto que receba N ou Y
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Aceitar conexão? (Y/N): ', (answer) => {
                if (answer.toLowerCase() === 'y') {
                    this.send_answer(data.serverToken, mytoken)
                } else {
                    console.log('Conexão recusada.');
                    process.exit(0);
                }
                rl.close();
            });

        });
    }
}

module.exports = Elementary;
