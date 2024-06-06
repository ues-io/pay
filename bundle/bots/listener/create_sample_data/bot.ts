import { ListenerBotApi } from "@uesio/bots"

export default function create_sample_data(bot: ListenerBotApi) {
	bot.callBot("usio/pay.create_sample_products", {})
}
