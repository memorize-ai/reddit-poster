import * as snoowrap from 'snoowrap'

const bots = (
	require('../protected/bots.json') as snoowrap.SnoowrapOptions[]
).map(options => new snoowrap(options))

const main = async (submissionId: string) => {
	await Promise.all(bots.map(bot => {
		bot.getSubreddit('').getSubmission(submissionId).upvote()
	}))
}

if (require.main === module)
	main(process.argv[2])
