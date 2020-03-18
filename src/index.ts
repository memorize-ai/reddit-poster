import * as snoowrap from 'snoowrap'
import * as chalk from 'chalk'

import {
	UPVOTE_DELAY_LOWER_BOUND,
	UPVOTE_DELAY_UPPER_BOUND,
	DEFAULT_TIME_ZONE
} from './constants'

const bots = (
	require('../protected/bots.json') as snoowrap.SnoowrapOptions[]
).map(options => new snoowrap(options))

const getRandomUpvoteDelay = () =>
	Math.random() * (
		UPVOTE_DELAY_UPPER_BOUND - UPVOTE_DELAY_LOWER_BOUND
	) + UPVOTE_DELAY_LOWER_BOUND

const sleep = (duration: number): Promise<void> =>
	new Promise(resolve => setTimeout(resolve, duration))

const main = (submissionId: string) =>
	Promise.all(bots.map(async bot => {
		const upvoteDelay = getRandomUpvoteDelay()
		
		const dateString = new Date(Date.now() + upvoteDelay)
			.toLocaleString('en-US', { timeZone: DEFAULT_TIME_ZONE })
		const seconds = (upvoteDelay / 1000).toFixed(2)
		
		console.log(chalk.cyan.bold(
			`${bot.userAgent} will upvote at ${dateString} (${seconds} seconds)`
		))
		
		await sleep(upvoteDelay)
		
		return bot.getSubmission(submissionId).upvote().then(() =>
			console.log(chalk.green.bold(
				`${bot.userAgent} upvoted at ${dateString} (${seconds} seconds)`
			))
		)
	}))

if (require.main === module)
	main(process.argv[2])
		.catch(error => console.log(chalk.red.bold(error)))
