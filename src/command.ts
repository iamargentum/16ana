import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generate, get_pub_key_from_secret } from './keypair';
import { transact } from './transaction';

const get_secret_key_from_string = (secret_key_string: string) => {
    return secret_key_string
        .replace("[", "")
        .replace("]", "")
        .split(",")
        .map(s => parseInt(s));
}

yargs(hideBin(process.argv))
    .command(
        'transfer',
        'Creates a transfer between provided wallet addresses',
        (yargs) => yargs
        .option('payer-secret', {
            alias: 'f',
            type: 'string',
            description: `Payer's secret key`
        })
        .option('to', {
            alias: 't',
            type: 'string',
            description: `Payee's wallet address`
        })
        .option('sols', {
            alias: 's',
            type: 'number',
            description: 'Number of sols to be transfered'
        })
        .demandOption(['payer-secret'], 'Please provide private key of the payer')
        .demandOption(['to'], 'Please provide wallet address/public key of the payee')
        .demandOption(['sols'], 'Specify amount to be transfered'),
        (argv) => {
            const payer_secret_key = get_secret_key_from_string(argv['payer-secret']);

            // do not allow any array other than a number array
            if(payer_secret_key.some(n => isNaN(n))) throw new Error("Secret key is invalid");

            transact(payer_secret_key, argv.to, argv.sols);
        }
    )
    .command(
        'keypair',
        'Creates a new keypair or helps getting a public key from secret key',
        (yargs) => yargs
        .option('from-secret', {
            type: 'string',
            description: 'Gets a public key from provided secret. Secret should be a Uint8Array. Not to be used with -s/--show-secret'
        })
        .option('show-secret', {
            alias: 's',
            type: 'boolean',
            description: 'Displays the private key after generating the keypair'
        })
        .conflicts('from-secret', 'show-secret'),
        (argv) => {
            if(!argv['from-secret']) return generate(!!argv['show-secret']);

            // parse a secret key out of the given string
            const secret_key = get_secret_key_from_string(argv['from-secret']);            

            // do not allow any array other than a number array
            if(secret_key.some(n => isNaN(n))) throw new Error("Secret key is invalid");

            return get_pub_key_from_secret(secret_key);
        }
    )
    .parse();