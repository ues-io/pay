import { definition, component } from "@uesio/ui"

interface CheckoutButtonProps {
	label: string
	request: CheckoutRequest
	onError: (result: CheckoutErrorResult) => void
	onSuccess: (result: CheckoutSuccessResult) => void
}

type CheckoutRequest = {
	merchantKey: string
	email: string
	cardNumber: string
	expiryDate: string
	cvc: string
}

type CheckoutErrorResult = {
	status: "failure"
	message: string
}

type CheckoutSuccessResult = {
	status: "success"
	paymentType: string
	token: string
	message: string
	last4: string
	expDate: string
	cardBrand: string
	emailAddress: string
}

type CheckoutResult = CheckoutErrorResult | CheckoutSuccessResult

const checkoutUrl = "https://checkout.usiopay.com/2.0/GenerateToken"

const formatExpiry = (expiry: string) => {
	const expiryParts = expiry.split(" / ")
	return expiryParts[0] + "20" + expiryParts[1]
}

const formatCardNumber = (cardNumber: string) => cardNumber.replace(/\s/g, "")

const CheckoutButton: definition.UtilityComponent<CheckoutButtonProps> = (
	props
) => {
	const { label = "Pay Now", request, onError, onSuccess, context } = props

	const Button = component.getUtility("uesio/io.button")

	return (
		<Button
			context={context}
			label={label}
			variant="uesio/io.secondary"
			onClick={async () => {
				const result = await fetch(checkoutUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						MerchantKey: request.merchantKey,
						PaymentType: "CreditCard",
						EmailAddress: request.email,
						CardNumber: formatCardNumber(request.cardNumber),
						ExpDate: formatExpiry(request.expiryDate),
						CVV: request.cvc,
					}),
				})
				const resultJson = (await result.json()) as CheckoutResult
				if (resultJson.status === "success") {
					onSuccess(resultJson)
				} else {
					onError(resultJson)
				}
			}}
		/>
	)
}

export default CheckoutButton
