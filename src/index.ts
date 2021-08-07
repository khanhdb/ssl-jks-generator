import {Command, flags} from '@oclif/command'
import {execSync} from "child_process";
import cli from 'cli-ux'

class GenerateSslJks extends Command {
  static description = 'generate .jks file from SSL certificate'

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    cert: flags.string({char: 'c', description: 'path to SSL certificate file', required: true}), // flag with a value (-n, --name=VALUE)
    key: flags.string({char: 'k', description: 'path to SSL key file', required: true}),
    password: flags.string({char: 'p', description: 'keystore password', required: true}),
  }

  static args = [{name: 'output', description: 'output filename'}]

  async run() {
    const {args, flags} = this.parse(GenerateSslJks)
    const outputFileName = args.output ?? 'output.jks'
    cli.action.start(`generating ${outputFileName}...`, 'starting', {stdout: true})
    try{
      const random = Math.round(Math.random()*1000)
      const p12FileName = outputFileName + '_' + random + '.p12'
      const password = flags.password
      const {execSync} = require('child_process');
      execSync(`openssl pkcs12 -export  -password pass:${password} -in ${flags.cert} -inkey ${flags.key} -out ${p12FileName}`);
      execSync(`keytool -importkeystore -srckeystore ${p12FileName} -srcstorepass ${password} -deststorepass ${password} -srcstoretype PKCS12 -destkeystore ${outputFileName} -deststoretype JKS`)
      cli.action.stop('done')
    } catch (err){
      this.error('Some thing wrong. Detail : ' + err)
    }
  }
}

export = GenerateSslJks
