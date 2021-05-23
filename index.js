require('dotenv').config()
const { Telegraf, Markup } = require('telegraf');
const { PerguntasDAO } = require('./perguntas.dao')

const bot = new Telegraf(process.env.TOKEN);
const perguntasDAO = new PerguntasDAO()

const startMessage = 'Olá eu sou o JS_Questões e quero te ajudar a aprender um pouco mais sobre JavaScript, seja bem vindo ';

bot.use(Telegraf.log())

bot.start(async ctx => {
    const name = ctx.update.message.from
    ctx.reply(startMessage + name.first_name);

    await ctx.reply('Selecione a opção desejada',
        Markup.keyboard(['/perguntas'])
            .oneTime()
            .resize()
    )
});


bot.command('perguntas', (ctx) => {
    const perguntas = perguntasDAO.consultarTodasAsPerguntas();
    var pergunta = perguntas[0];
    return ctx.reply(pergunta.enunciadoHTML, {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(
            [
                Markup.button.callback(pergunta.alternativas[0], getAcaoDeResposta(0, pergunta)),
                Markup.button.callback(pergunta.alternativas[1], getAcaoDeResposta(1, pergunta)),
                Markup.button.callback(pergunta.alternativas[2], getAcaoDeResposta(2, pergunta)),
                Markup.button.callback(pergunta.alternativas[3], getAcaoDeResposta(3, pergunta))
            ], {
            columns: 2
        }
        )
    })
})
bot.hears(/.+/, (ctx) => {
    return ctx.reply(
        'Eu ainda não sei me comunicar direito, tenho apenas algumas funções no seu teclado',
        Markup.keyboard(['/perguntas'])
            .oneTime()
            .resize()
    )
})

function getAcaoDeResposta(indiceAtual, pergunta) {
    if (indiceAtual === pergunta.indiceResposta) {
        return 'resposta-certa-' + pergunta.id;
    }
    else {
        return 'resposta-errada';
    }
}

bot.action(/resposta-certa-\d+/, async (ctx, next) => {
    const idPergunta = parseInt(ctx.match.input.split('-')[2])
    const pergunta = perguntasDAO.consultarPerguntaPorId(idPergunta)
    await ctx.editMessageText(pergunta.info, { parse_mode: 'HTML' })
    await ctx.reply('🎉')
    return await ctx.reply('O que você deseja fazer?', {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(
            [
                Markup.button.callback("Próxima pergunta", 'pergunta-' + (idPergunta + 1)),
                Markup.button.callback("Encerrar", "encerrar")
            ], {
            columns: 2
        }
        )
    })
})

bot.action('resposta-errada', (ctx, next) => {
    return ctx.answerCbQuery('Ops, você errou! 👎')
})

bot.action('encerrar', ActionEncerrar)

async function ActionEncerrar(ctx) {
    await ctx.deleteMessage(ctx.update.message_id)
    return await ctx.reply('Obrigado por particiar, espero que você tenha gostado e aprendido.\nEu fui criado pela Miyuki, e meu código esta disponível em https://github.com/kellyMiy/js_questoes\nPara jogar novamente basta clicar no botão disponível no chat.',
        Markup.keyboard(['/perguntas'])
            .oneTime()
            .resize()
    )
}

bot.action(/pergunta-\d+/, async (ctx) => {
    const idPergunta = parseInt(ctx.match.input.split('-')[1])
    const pergunta = perguntasDAO.consultarPerguntaPorId(idPergunta)
    if (pergunta) {
        await ctx.deleteMessage(ctx.update.message_id)
        return await ctx.reply(pergunta.enunciadoHTML, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard(
                [
                    Markup.button.callback(pergunta.alternativas[0], getAcaoDeResposta(0, pergunta)),
                    Markup.button.callback(pergunta.alternativas[1], getAcaoDeResposta(1, pergunta)),
                    Markup.button.callback(pergunta.alternativas[2], getAcaoDeResposta(2, pergunta)),
                    Markup.button.callback(pergunta.alternativas[3], getAcaoDeResposta(3, pergunta))
                ], {
                columns: 2
            }
            )
        })
    } else {
        await ctx.reply("Parabéns você respondeu todas as perguntas!")
        return ActionEncerrar(ctx)
    }
})

bot.catch(error => {
    console.log('telegraf error', error)
})

bot.launch();
process.once('SIGINT', () => bot.stop("SIGINT"));
process.once('SIGTERM', () => bot.stop("SIGTERM"));