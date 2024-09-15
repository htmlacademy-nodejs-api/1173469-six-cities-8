import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.red(`
                            .-.
                           |_:_|
                          /(_Y_)\\
     .                   ( \\/M\\/ )
      '.               _.'-/'-\\'-._
        ':           _/.--'[[[[]'--.\\_
          ':        /_'  : |::"| :  '.\\
            ':     //   ./ |oUU| \.'  :\\
              ':  _:'..' \\_|___|_/ :   :|
                ':.  .'  |_[___]_|  :.':\\
                 [::\\ |  :  | |  :   ; : \\
                  '-'   \\/'.| |.' \\  .;.' |
                  |\\_    \\  '-'   :       |
                  |  \\    \\ .:    :   |   |
                  |   \\    | '.   :    \\  |
                  /       \\   :. .;       |
                 /     |   |  :__/     :  \\
                |  |   |    \\:   | \\   |   ||
               /    \\  : :  |:   /  |__|   /|
               |     : : :_/_|  /'._\\  '--|_\\
               /___.-/_|-'   \\  \\
                              '-'
    `));

    console.info(chalk.green.bold(`
        Программа для подготовки данных для REST API сервера.
    `));

    console.info(`${chalk.blue('Пример:')} ${chalk.yellow('cli.js')} ${chalk.magenta('--<command>')} ${chalk.cyan('[--arguments]')}`);

    console.info(chalk.blue(`
Команды:
    `));

    console.info(`
${chalk.cyan('--version')}:                   ${chalk.magenta('# выводит номер версии')}
${chalk.cyan('--help')}:                      ${chalk.magenta('# печатает этот текст')}
${chalk.cyan('--import')} <${chalk.yellow('path')}>:             ${chalk.magenta('# импортирует данные из TSV')}
${chalk.cyan('--generate')} <${chalk.yellow('n')}> <${chalk.yellow('path')}> <${chalk.yellow('url')}>  ${chalk.magenta('# генерирует произвольное количество тестовых данных')}
    `);
  }
}
