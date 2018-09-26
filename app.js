#! /usr/bin/env node
const wiki = require('wikijs').default
const prompts = require('prompts')
const capitalize = require('titleize')
const systemLocale = require('os-locale')
const log = console.log
const dateFormat = require('dateformat')


const question = prompts({
    type: 'text',
    name: 'personName',
    message: 'Give me a name'
});

const app = async () => {
	const answer = await question
	const personName = capitalize(answer.personName)
	const whoIsThis = () => log(`Who is ${personName}?`)

	try {
		const {info} = await wiki().page(personName)
		const articleInfo = await info()
		const isNotPerson = !articleInfo.hasOwnProperty('birthDate')
		const isDead = articleInfo.hasOwnProperty('deathDate')

		if (isNotPerson) {
			return whoIsThis()
		}

		if (isDead) {
			const deathDate = dateFormat(articleInfo.deathDate.date, 'dS "of" mmmm yyyy')
			if (articleInfo.deathCause) {
				log(`${personName} died on the ${deathDate}, at the age of ${articleInfo.deathDate.age}, due to a ${articleInfo.deathCause.toLowerCase()}, and would've been ${articleInfo.birthDate.age} years old today.`)
			} else {
				log(`${personName} died on the ${deathDate}, at the age of ${articleInfo.deathDate.age}, and would've been ${articleInfo.birthDate.age} years old today.`)
			}
		} else {
			log(`${personName} is still alive!`)
		}



	} catch (error) {
		whoIsThis()
	}

}

app()
