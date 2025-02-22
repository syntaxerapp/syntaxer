# syntaxer

CLI-утилита для упрощения работы с документацией.

Если Вы часто что-то устанавливаете или редактируете через терминал (и при этом достаёте какую-то информацию из статей в интернете), то скорее всего Вас раздражает, что авторы зачастую не учитывают разнообразие команд, выполняющих одни и те же функции, но с разным написанием. Например, для установки какой-либо программы в Linux в статье указана команда:

```apt install package```

Автор пользуется Ubuntu, и даже не задумывается о том, что в других дистрибутивах другие пакетные менеджеры. И если Вы используете Arch, то Вам придётся вручную приводить команду к следующему виду:

```pacman -S package```

syntaxer решает эту проблему - он автоматически конвертирует все подходящие для конвертации команды в статье под синтаксис используемых Вами команд.

## Установка

syntaxer реализован на node.js, поэтому прежде всего нужно установить [node v22.x.x](https://nodejs.org/en/download) или выше.

После этого используйте команду, соответствующую вашему пакетному менеджеру:

NPM: ```npm install -g @syntaxerapp/syntaxer```

Yarn: ```npm global add @syntaxerapp/syntaxer```

PNPM: ```pnpm install -g @syntaxerapp/syntaxer```

## Использование

Для конвертации статьи используйте команду:

```syntaxer -l <link>```, где `link` - ссылка на исходную статью.

Сконвертированная статья будет находиться в директории syntaxer/generated в домашней папке пользователя

Для включения или отключения плагинов используйте команды ```syntaxer enable [plugin]``` и ```syntaxer disable [plugin]``` соответственно, где `[plugin]` - название плагина.

Посмотреть список всех плагинов можно командой ```syntaxer plugins```. Список всех команд - ```syntaxer -h```.

Для выбора предпочитаемой команды для плагина используйте ```syntaxer choose <plugin>```, где <plugin> - название плагина.
