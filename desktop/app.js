const Elementary = require('./funcions');

const argv = process.argv.slice(2);
const elementary = new Elementary();

if (argv.length < 1) {
    console.log('Ajuda: Use "help" para ver os comandos disponíveis.');
} else {
    switch (argv[0]) {
        case 'help':
        case '--help':
        case '-h':
        case '?':
            console.log('Comandos disponíveis:\n' +
                        'help, --help, -h, ?: Mostra esta mensagem de ajuda\n' +
                        'init, -i: Gera um novo token de acesso remoto via socket IO\n' +
                        'version, -v: Mostra a versão do aplicativo\n' +
                        'shutdown, -s: Desliga o sistema\n' +
                        'reboot, -r: Reinicia o sistema\n' +
                        'hide, -h: Esconde o sistema (suspende)\n' +
                        'listing, -l: Conecta ao servidor');
            break;

        case 'init':
        case '-i':
            elementary.init();
            break;

        case 'show':
            elementary.show();
            break;

        case 'version':
        case '-v':
            console.log('v1.0.0');
            break;

        case 'shutdown':
        case '-s':
            elementary.shutdown();
            break;

        case 'reboot':
        case '-r':
            console.log('Reiniciando...');
            break;

        case 'hide':
            elementary.hide();
            break;

        case 'connect':
        case '-c':
            elementary.Connect();
            break;

        case 'listing':
            case '-l':
                elementary.Listing();
                break;

        default:
            console.log('Comando desconhecido. Use "help" para ver os comandos disponíveis.');
    }
}