


const helpText = () => (
  console.log(`Программа запускает http-сервер и формирует файл с данными для API.

    Команды:
    --version:            выводит номер версии
    --help:               печатает этот текст
    --generate <count>    формирует файл mocks.json
  `)
);

module.exports = {
  name: `--help`,
  run() {
    helpText();
  }
};
