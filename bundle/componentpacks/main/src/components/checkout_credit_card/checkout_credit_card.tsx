import { styles, definition, component, api, signal } from "@uesio/ui"
import { useState } from "react"

import CCInput from "./utilities/cc_input/cc_input"
import CheckoutButton from "./utilities/checkout_button/checkout_button"

type ComponentDefinition = {
	submitText: string
	amount?: string
	secondaryAmount?: string
	onSuccessSignals?: signal.SignalDefinition[]
	onSubmitSignals?: signal.SignalDefinition[]
}

type SubmitTokenResult = {
	confirmation: string
}

const defaultOnSubmitSignals = [
	{
		signal: "integration/RUN_ACTION",
		integration: "usio/pay.usio",
		stepId: "submit_token",
		action: "submit_token",
		params: {
			token: "$SignalOutput{[checkout][token]}",
			amount: "$SignalOutput{[checkout][amount]}",
			secondaryAmount: "$SignalOutput{[checkout][secondaryAmount]}",
			firstName: "$SignalOutput{[checkout][firstName]}",
			lastName: "$SignalOutput{[checkout][lastName]}",
			address: "$SignalOutput{[checkout][address]}",
			city: "$SignalOutput{[checkout][city]}",
			state: "$SignalOutput{[checkout][state]}",
			zip: "$SignalOutput{[checkout][zip]}",
		},
	},
]

const defaultOnSuccessSignals = [
	{
		signal: "notification/ADD",
		text: "Payment success: $SignalOutput{[checkout][confirmation]}",
		severity: "success",
	},
]

const numberToString = (num: string | number | undefined) => {
	if (!num) return "0"
	return num + ""
}

const sampleMerchantKey = "AEAE82F9-5A34-47C3-A61E-1E8EE37BE3AD"
const errorText = "There was a problem submitting your payment."

const Component: definition.UC<ComponentDefinition> = (props) => {
	const { context, definition } = props
	const { onSubmitSignals, onSuccessSignals } = definition

	const { submitText = "Pay Now" } = props.definition

	const TextField = component.getUtility("uesio/io.textfield")
	const NumberField = component.getUtility("uesio/io.numberfield")
	const FieldWrapper = component.getUtility("uesio/io.fieldwrapper")
	const FieldLabel = component.getUtility("uesio/io.fieldlabel")

	const secondaryAmount = definition.secondaryAmount

	const [amount, setAmount] = useState(definition.amount)

	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [email, setEmail] = useState("")
	const [cardNumber, setCardNumber] = useState("")
	const [expiryDate, setExpiryDate] = useState("")
	const [cvc, setCVC] = useState("")
	const [address, setAddress] = useState("")
	const [city, setCity] = useState("")
	const [state, setState] = useState("")
	const [zip, setZip] = useState("")

	const [error, setError] = useState("")

	const classes = styles.useStyleTokens(
		{
			wrapper: ["h-full", "grid", "justify-center", "items-center"],
			root: ["max-w-[390px]", "m-8"],
			nameWrapper: ["grid", "grid-cols-2", "gap-4"],
			locationWrapper: ["grid", "grid-cols-4", "gap-4"],
			cityWrapper: ["col-span-2"],
			buttonWrapper: ["mt-6", "flex", "gap-4", "items-start"],
			amountWrapper: ["grid", "grid-cols-2", "gap-4"],
			errorWrapper: [
				"grow",
				"text-xs",
				"text-rose-500",
				"py-1",
				"font-bold",
			],
			errorTitle: ["font-light"],
		},
		props
	)

	return (
		<div className={classes.wrapper}>
			<div className={classes.root}>
				<div className={classes.amountWrapper}>
					{definition.amount === undefined && (
						<FieldWrapper context={context}>
							<FieldLabel context={context} label="Amount" />
							<NumberField
								setValue={setAmount}
								context={context}
							/>
						</FieldWrapper>
					)}
					{definition.secondaryAmount === undefined && (
						<FieldWrapper context={context}>
							<FieldLabel
								context={context}
								label="Secondary Amount"
							/>
							<NumberField
								setValue={setAmount}
								context={context}
							/>
						</FieldWrapper>
					)}
				</div>
				<div className={classes.nameWrapper}>
					<FieldWrapper context={context}>
						<FieldLabel context={context} label="First Name" />
						<TextField setValue={setFirstName} context={context} />
					</FieldWrapper>
					<FieldWrapper context={context}>
						<FieldLabel context={context} label="Last Name" />
						<TextField setValue={setLastName} context={context} />
					</FieldWrapper>
				</div>
				<FieldWrapper context={context}>
					<FieldLabel context={context} label="Email" />
					<TextField setValue={setEmail} context={context} />
				</FieldWrapper>
				<CCInput
					onNumberChange={setCardNumber}
					onExpiryChange={setExpiryDate}
					onCVCChange={setCVC}
					context={context}
					error={error}
				/>
				<FieldWrapper context={context}>
					<FieldLabel context={context} label="Address" />
					<TextField setValue={setAddress} context={context} />
				</FieldWrapper>
				<div className={classes.locationWrapper}>
					<FieldWrapper
						context={context}
						className={classes.cityWrapper}
					>
						<FieldLabel context={context} label="City" />
						<TextField setValue={setCity} context={context} />
					</FieldWrapper>
					<FieldWrapper context={context}>
						<FieldLabel context={context} label="State" />
						<TextField setValue={setState} context={context} />
					</FieldWrapper>
					<FieldWrapper context={context}>
						<FieldLabel context={context} label="Zip" />
						<TextField setValue={setZip} context={context} />
					</FieldWrapper>
				</div>
				<div className={classes.buttonWrapper}>
					<CheckoutButton
						request={{
							merchantKey: sampleMerchantKey,
							email,
							cardNumber,
							expiryDate,
							cvc,
						}}
						context={context}
						label={submitText}
						onSuccess={async (result) => {
							const newContext = await api.signal.runMany(
								onSubmitSignals || defaultOnSubmitSignals,
								context.addSignalOutputFrame("checkout", {
									token: result.token,
									amount: numberToString(amount),
									secondaryAmount:
										numberToString(secondaryAmount),
									firstName,
									lastName,
									address,
									city,
									state,
									zip,
								})
							)

							if (newContext.hasErrors()) {
								setError(
									newContext.getCurrentErrors().join(", ")
								)
							} else {
								const resultData =
									newContext.getSignalOutputData(
										"submit_token"
									) as SubmitTokenResult

								setError("")
								await api.signal.runMany(
									onSuccessSignals || defaultOnSuccessSignals,
									context.addSignalOutputFrame(
										"checkout",
										resultData
									)
								)
							}
						}}
						onError={(result) => {
							setError(result.message)
						}}
					/>
					{error && (
						<div className={classes.errorWrapper}>
							<div className={classes.errorTitle}>
								{errorText}
							</div>
							<div>{error}</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Component
