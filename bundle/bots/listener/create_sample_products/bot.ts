import { ListenerBotApi, WireRecord } from "@uesio/bots"

export default function create_sample_products(bot: ListenerBotApi) {
	const sampleProductData = [
		{
			name: "Lucid Dream",
			description: "Flowers and Hexagons. Inspired by spring.",
			price: 200,
			imagepath: "shin-bijutsukai-0150.jpg",
			externalid: "SAMPLE-PRODUCT-01",
			published: true,
			slug: "lucid_dream",
		},
		{
			name: "Stripes on a Pond",
			description: "Flowers floating on a striped pond.",
			price: 180,
			imagepath: "shin-bijutsukai-0298.jpg",
			externalid: "SAMPLE-PRODUCT-02",
			published: true,
			slug: "stripes_on_a_pond",
		},
		{
			name: "Purple and Yellow Dots",
			description: "Exquisite dots on a dark background.",
			price: 40,
			imagepath: "shin-bijutsukai-0300.jpg",
			externalid: "SAMPLE-PRODUCT-03",
			published: true,
			slug: "purple_and_yellow_dots",
		},
		{
			name: "Maple Sea",
			description: "A sea of flowers and clouds.",
			price: 145,
			imagepath: "shin-bijutsukai-0316.jpg",
			externalid: "SAMPLE-PRODUCT-04",
			published: true,
			slug: "maple_sea",
		},
		{
			name: "Storms of Green",
			description: "Combine with Maple Sea. Shows the storms of spring.",
			price: 60,
			imagepath: "shin-bijutsukai-0317.jpg",
			externalid: "SAMPLE-PRODUCT-05",
			published: true,
			slug: "storms_of_green",
		},
		{
			name: "Desert Garden",
			description: "Shows a beautiful oasis in a desert.",
			price: 50,
			imagepath: "shin-bijutsukai-0319.jpg",
			externalid: "SAMPLE-PRODUCT-06",
			published: true,
			slug: "desert_garden",
		},
		{
			name: "Stars of Orange",
			description: "Stars on an orange background by Kamisaka Sekka",
			price: 140,
			imagepath: "shin-bijutsukai-0320.jpg",
			externalid: "SAMPLE-PRODUCT-07",
			published: true,
			slug: "stars_of_orange",
		},
		{
			name: "Teal Rain",
			description: "Beatiful artwork by Shin-Bijutsukai",
			price: 210,
			imagepath: "shin-bijutsukai-0324.jpg",
			externalid: "SAMPLE-PRODUCT-08",
			published: true,
			slug: "teal_rain",
		},
	]
	const productresult = bot.save(
		"usio/pay.product",
		sampleProductData.map((sample) => ({
			"usio/pay.name": sample.name,
			"usio/pay.description": sample.description,
			"usio/pay.price": sample.price,
			"usio/pay.slug": sample.slug,
			"usio/pay.published": sample.published,
			"usio/pay.externalid": sample.externalid,
		})) as unknown as WireRecord[],
		{
			upsert: true,
		}
	)
	sampleProductData.forEach((sample, index) => {
		if (sample.imagepath) {
			bot.copyFile(
				"usio/pay.productpics",
				"images/" + sample.imagepath,
				"usio/pay.product",
				productresult[index]["uesio/core.id"] as string,
				"usio/pay.image"
			)
		}
	})
}
