import { RunActionBotApi } from "@uesio/bots"

type SubmitTokenSuccess = {
	status: "success"
	message: string
	confirmation: string
}

type SubmitTokenFailure = {
	status: "failure"
	message: string
}

type SubmitTokenResponse = SubmitTokenFailure | SubmitTokenSuccess

export default function usio(bot: RunActionBotApi) {
	const actionName = bot.getActionName()

	if (actionName !== "submit_token") {
		bot.addError("unsupported action name: " + actionName)
		return
	}

	const token = bot.params.get("token") as string
	const amount = bot.params.get("amount") as string
	const secondaryAmount = bot.params.get("secondaryAmount") as string
	const firstname = bot.params.get("firstName") as string
	const lastname = bot.params.get("lastName") as string
	const address = bot.params.get("address") as string
	const city = bot.params.get("city") as string
	const state = bot.params.get("state") as string
	const zip = bot.params.get("zip") as string

	const creds = bot.getCredentials()
	const merchantId = creds.merchantId

	if (!merchantId) {
		bot.addError("No Merchant ID provided")
		return
	}

	const login = creds.login

	if (!login) {
		bot.addError("No Usio Login provided")
		return
	}

	const password = creds.password

	if (!password) {
		bot.addError("No Usio Password provided")
		return
	}

	const url = "https://checkout.usiopay.com/2.0/SubmitTokenPayment"

	const requestBody = {
		MerchantID: merchantId,
		Login: login,
		Password: password,
		Token: token,
		Amount: amount,
		SecondaryAmount: secondaryAmount,
		FirstName: firstname,
		LastName: lastname,
		Address1: address,
		//Address2: "string",
		City: city,
		State: state,
		Zip: zip,
		//AdditionalSearch: "string",
		//AccountCode1: "string",
		//AccountCode2: "string",
		//AccountCode3: "string",
		CheckNegativeAccount: false,
		AuthOnly: false,
		DisableDuplicateCheck: false,
	}

	bot.log.info("body", requestBody)

	// Create a new site and get its id
	const result = bot.http.request<unknown, SubmitTokenResponse>({
		method: "POST",
		url,
		body: requestBody,
		headers: {
			["Content-Type"]: "application/json",
		},
	})

	if (result.code !== 200) {
		bot.addError(
			"Error Making Request: " + result.status + " " + result.body
		)
		return
	}

	if (result.body.status === "failure") {
		bot.addError(result.body.message)
		return
	}

	if (result.body.status !== "success") {
		bot.addError("Unexpected status")
	}

	bot.addResult("confirmation", result.body.confirmation)
}
