require('dotenv').config()

const {readFileSync} = require('fs')

const {Telegraf} = require('telegraf')

const {MenuTemplate, MenuMiddleware, createBackMainMenuButtons} = require('telegraf-inline-menu')

const menu = new MenuTemplate(() => 'Ola <b>vc*</b>\n bem vindo a meu nome*\n selecicone uma opção\n' + new Date().toISOString())

let mainMenuToggle = false
menu.toggle('toggle me', 'toggle me', {
	set: (_, newState) => {
		mainMenuToggle = newState
		// Update the menu afterwards
		return true
	},
	isSet: () => mainMenuToggle
})

menu.interact('interaction', 'interact', {
	hide: () => mainMenuToggle,
	do: async ctx => {
		await ctx.answerCbQuery('you clicked me!')
		// Do not update the menu afterwards
		return false
	}
})

menu.interact('update after action', 'update afterwards', {
	joinLastRow: true,
	hide: () => mainMenuToggle,
	do: async ctx => {
		await ctx.answerCbQuery('I will update the menu now…')

		return true

		// You can return true to update the same menu or use a relative path
		// For example '.' for the same menu or '..' for the parent menu
		// return '.'
	}
})

let selectedKey = 'b'
menu.select('select', ['A', 'B', 'C'], {
	set: async (ctx, key) => {
		selectedKey = key
		await ctx.answerCbQuery(`you selected ${key}`)
		return true
	},
	isSet: (_, key) => key === selectedKey
})

const foodMenu = new MenuTemplate(function(ctx) { return { text:`Olá <b>${ctx.from.first_name}</b>, tudo certz?`, parse_mode: "HTML"}; })

const people = {Mark: {}, Paul: {}}
const food = ['bread', 'cake', 'bananas']

function personButtonText(_, key) {
	const entry = people[key]
	if (entry?.food) {
		return `${key} (${entry.food})`
	}

	return key
}

function foodSelectText(ctx) {
	const person = ctx.match[1]
	const hisChoice = people[person].food
	if (!hisChoice) {
		return `${person} is still unsure what to eat.`
	}

	return `${person} likes ${hisChoice} currently.`
}

const foodSelectSubmenu = new MenuTemplate(foodSelectText)
foodSelectSubmenu.toggle('Prefer tea', 'tea', {
	set: (ctx, choice) => {
		const person = ctx.match[1]
		people[person].tee = choice
		return true
	},
	isSet: ctx => {
		const person = ctx.match[1]
		return people[person].tee === true
	}
})
foodSelectSubmenu.select('food', food, {
	set: (ctx, key) => {
		const person = ctx.match[1]
		people[person].food = key
		return true
	},
	isSet: (ctx, key) => {
		const person = ctx.match[1]
		return people[person].food === key
	}
})
foodSelectSubmenu.manualRow(createBackMainMenuButtons())

foodMenu.chooseIntoSubmenu('person', () => Object.keys(people), foodSelectSubmenu, {
	buttonText: personButtonText,
	columns: 2
})
foodMenu.manualRow(createBackMainMenuButtons())

menu.submenu('Food menu', 'food', foodMenu, {
	hide: () => mainMenuToggle
})

let mediaOption = 'photo1'
const mediaMenu = new MenuTemplate(() => {
	if (mediaOption === 'video') {
		return {
			type: 'video',
			media: 'https://telegram.org/img/t_main_Android_demo.mp4',
			text: 'Just a caption for a video'
		}
	}

	if (mediaOption === 'animation') {
		return {
			type: 'animation',
			media: 'https://telegram.org/img/t_main_Android_demo.mp4',
			text: 'Just a caption for an animation'
		}
	}

	if (mediaOption === 'photo2') {
		return {
			type: 'photo',
			media: 'https://telegram.org/img/SiteAndroid.jpg',
			text: 'Just a caption for a *photo*',
			parse_mode: 'Markdown'
		}
	}

	if (mediaOption === 'document') {
		return {
			type: 'document',
			media: 'https://telegram.org/file/464001088/1/bI7AJLo7oX4.287931.zip/374fe3b0a59dc60005',
			text: 'Just a caption for a <b>document</b>',
			parse_mode: 'HTML'
		}
	}

	if (mediaOption === 'location') {
		return {
			// Some point with simple coordinates in Hamburg, Germany
			location: {
				latitude: 53.5,
				longitude: 10
			},
			live_period: 60
		}
	}

	if (mediaOption === 'venue') {
		return {
			venue: {
				location: {
					latitude: 53.5,
					longitude: 10
				},
				title: 'simple coordinates point',
				address: 'Hamburg, Germany'
			}
		}
	}

	if (mediaOption === 'just text') {
		return {
			text: 'Just some text'
		}
	}

	return {
		type: 'photo',
		media: 'https://telegram.org/img/SiteiOs.jpg'
	}
})
mediaMenu.interact('Just a button', 'randomButton', {
	do: async ctx => {
		await ctx.answerCbQuery('Just a callback query answer')
		return false
	}
})
mediaMenu.select('type', ['animation', 'document', 'photo1', 'photo2', 'video', 'location', 'venue', 'just text'], {
	columns: 2,
	isSet: (_, key) => mediaOption === key,
	set: (_, key) => {
		mediaOption = key
		return true
	}
})
mediaMenu.manualRow(createBackMainMenuButtons())

menu.submenu('Media Menu', 'media', mediaMenu)

const menuMiddleware = new MenuMiddleware('/', menu)
console.log(menuMiddleware.tree())

const bot = new Telegraf(process.env.TOKEN);

bot.use(async (ctx, next) => {
	if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
		console.log('another callbackQuery happened', ctx.callbackQuery.data.length, ctx.callbackQuery.data)
	}

	return next()
})

bot.command('start', async ctx => menuMiddleware.replyToContext(ctx))
bot.use(menuMiddleware.middleware())

bot.catch(error => {
	console.log('telegraf error', error)
})


bot.command('onetime', (ctx) =>
    ctx.reply('One time keyboard', Markup
        .keyboard(['/simple', '/inline', '/pyramid'])
        .oneTime()
        .resize()
    )
)

bot.command('custom', async (ctx) => {
    return await ctx.reply('Custom buttons keyboard', Markup
        .keyboard([
            ['🔍 Search', '😎 Popular'], // Row1 with 2 buttons
            ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
            ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
        ])
        .oneTime()
        .resize()
    )
})

bot.hears('🔍 Search', ctx => ctx.reply('Yay!'))
bot.hears('📢 Ads', ctx => ctx.reply('Free hugs. Call now!'))

bot.command('special', (ctx) => {
    return ctx.reply(
        'Special buttons keyboard',
        Markup.keyboard([
            Markup.button.contactRequest('Send contact'),
            Markup.button.locationRequest('Send location')
        ]).resize()
    )
})

bot.command('pyramid', (ctx) => {
    return ctx.reply(
        'Keyboard wrap',
        Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
            wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2
        })
    )
})

bot.command('simple', (ctx) => {
    return ctx.replyWithHTML(
        '<b>Coke</b> or <i>Pepsi?</i>',
        Markup.keyboard(['Coke', 'Pepsi'])
    )
})

bot.command('inline', (ctx) => {
    return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
            Markup.button.callback('Coke', 'Coke'),
            Markup.button.callback('Pepsi', 'Pepsi')
        ])
    })
})

bot.command('random', (ctx) => {
    return ctx.reply(
        'random example',
        Markup.inlineKeyboard([
            Markup.button.callback('Coke', 'Coke'),
            Markup.button.callback('Dr Pepper', 'Dr Pepper'),
            Markup.button.callback('Pepsi', 'Pepsi')
        ])
    )
})

bot.command('caption', (ctx) => {
    return ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' },
        {
            caption: 'Caption',
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                Markup.button.callback('Plain', 'plain'),
                Markup.button.callback('Italic', 'italic')
            ])
        }
    )
})

bot.hears(/\/wrap (\d+)/, (ctx) => {
    return ctx.reply(
        'Keyboard wrap',
        Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
            columns: parseInt(ctx.match[1])
        })
    )
})

bot.action('Dr Pepper', (ctx, next) => {
    return ctx.reply('🎉').then(() => next())
})

bot.action('plain', async (ctx) => {
    await ctx.answerCbQuery('le plain')
    await ctx.editMessageCaption('Caption', Markup.inlineKeyboard([
        Markup.button.callback('Plain', 'plain'),
        Markup.button.callback('Italic', 'italic')
    ]))
})

bot.action('italic', async (ctx) => {
    await ctx.answerCbQuery('mama italic!')
    await ctx.editMessageCaption('_Caption_', {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            Markup.button.callback('Plain', 'plain'),
            Markup.button.callback('* Italic *', 'italic')
        ])
    })
})

bot.action(/.+/, (ctx) => {
    return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
})

async function startup() {
	await bot.launch()
	console.log(new Date(), 'Bot started as', bot.botInfo.username)
}

startup()