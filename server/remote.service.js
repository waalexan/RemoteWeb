const Command = async (req, res) => {
    try {
        const { token, myself, command } = req.body;

        const io = req.app.get('io');

        io.emit(`command/${token}`, { command, myself });

        console.log(`command [${token}/${myself}]`, command)

        res.status(200).send('Conexão emitida com sucesso');
    } catch (error) {
        console.error('Erro ao processar nova conexão:', error);
        res.status(500).send('Erro ao processar nova conexão');
    }
};

const Signal = async (req, res) => {
    try {
        const { token, myself, command } = req.body;

        const io = req.app.get('io');

        io.emit(`signal/${token}`, { command, myself });

        console.log(`signal [${token}/${myself}]`, command)

        res.status(200).send('Conexão emitida com sucesso');
    } catch (Error) {
        console.error('Erro ao processar nova conexão:', error);
        res.status(500).send('Erro ao processar nova conexão');
    }
}

const newConnect = async (req, res) => {
    try {
        const { token, device, tokenGenerated } = req.body;

        const io = req.app.get('io');

        console.log(`Novo pedido de conexão (deviceConnect/${token}):\nFROM: ${tokenGenerated}\nTO: ${token}\nDevice: ${device}`);
        io.emit(`deviceConnect/${token}`, { device, serverToken: tokenGenerated });

        res.status(200).send('Conexão emitida com sucesso');
    } catch (error) {
        console.error('Erro ao processar nova conexão:', error);
        res.status(500).send('Erro ao processar nova conexão');
    }
};

const acceptConnect = async (req, res) => {
    try {
        const { system, platform, version, user, serverToken, mytoken } = req.body;

        const io = req.app.get('io');

        console.log(`Pedido de aceitação de conexão:\nSystem: ${system}\nPlatform: ${platform}\nVersion: ${version}\nuser: ${user}\nuser: ${serverToken}`);
        io.emit(`deviceaccept/${serverToken}`, { system, platform, version, user, serverToken, mytoken });

        res.status(200).send('Conexão aceita com sucesso');
    } catch (error) {
        console.error('Erro ao aceitar a conexão:', error);
        res.status(500).send('Erro ao aceitar a conexão');
    }
};

const response = async (req, res) => {
    try {
        const { stdout, serverToken, mytoken } = req.body;

        const io = req.app.get('io');

        io.emit(`response/${serverToken}`, { stdout })

        res.status(200).send('Conexão aceita com sucesso');
    } catch (error) {
        console.error('Erro ao aceitar a conexão:', error);
        res.status(500).send('Erro ao aceitar a conexão');
    }
};

module.exports = {
    Command,
    Signal,
    newConnect,
    acceptConnect,
    response
};