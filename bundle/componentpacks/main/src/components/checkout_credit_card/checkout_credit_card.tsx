import { styles, definition, component } from "@uesio/ui"
import { ChangeEvent, useState } from "react"
import { usePaymentInputs } from "react-payment-inputs"
import images, { type CardImages } from "react-payment-inputs/images"

type ComponentDefinition = {
	submitText: string
}

const typedImages = images as unknown as CardImages

const Component: definition.UC<ComponentDefinition> = (props) => {
	const { context } = props
	const { submitText = "Pay Now" } = props.definition

	const TextField = component.getUtility("uesio/io.textfield")
	const FieldWrapper = component.getUtility("uesio/io.fieldwrapper")
	const FieldLabel = component.getUtility("uesio/io.fieldlabel")
	const Button = component.getUtility("uesio/io.button")

	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [email, setEmail] = useState("")
	const [number, setNumber] = useState("")
	const [expiry, setExpiry] = useState("")
	const [cvc, setCVC] = useState("")

	const {
		wrapperProps,
		getCardImageProps,
		getCardNumberProps,
		getExpiryDateProps,
		getCVCProps,
	} = usePaymentInputs()
	const classes = styles.useStyleTokens(
		{
			wrapper: ["h-full", "grid", "justify-center", "items-center"],
			root: ["max-w-[380px]", "m-8"],
			nameWrapper: ["grid", "grid-cols-2", "gap-6"],
			buttonWrapper: ["mt-6"],
			expiry: ["w-[4em]"],
			number: ["w-[11em]"],
			cvc: ["w-[2.5em]"],
			focused: [
				"outline",
				"outline-2",
				"outline-inherit",
				"-outline-offset-2",
				"outline-blue-700",
			],
		},
		props
	)

	const inputClasses = styles.useUtilityStyleTokens(
		{
			input: [
				"flex",
				"items-center",
				"gap-2",
				"[&>input]:outline-none",
				"[&>input::placeholder]:font-light",
			],
		},
		props,
		"uesio/io.field"
	)

	const { focused } = wrapperProps

	const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
		setNumber(e.target.value)
	}

	const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
		setExpiry(e.target.value)
	}

	const handleCVCChange = (e: ChangeEvent<HTMLInputElement>) => {
		setCVC(e.target.value)
	}

	const onSubmit = () => {
		console.log(firstName, lastName, email, number, expiry, cvc)
	}

	return (
		<div className={classes.wrapper}>
			<div className={classes.root}>
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
				<FieldWrapper context={context}>
					<FieldLabel context={context} label="Credit Card" />
					<div
						className={styles.cx(
							inputClasses.input,
							focused && classes.focused
						)}
					>
						<svg
							className={classes.card}
							{...getCardImageProps({ images: typedImages })}
						/>
						<input
							className={classes.number}
							{...getCardNumberProps({
								onChange: handleNumberChange,
							})}
						/>
						<input
							className={classes.expiry}
							{...getExpiryDateProps({
								onChange: handleExpiryChange,
							})}
						/>
						<input
							className={classes.cvc}
							{...getCVCProps({
								onChange: handleCVCChange,
							})}
						/>
					</div>
				</FieldWrapper>
				<div className={classes.buttonWrapper}>
					<Button
						context={context}
						label={submitText}
						variant="uesio/io.secondary"
						onClick={onSubmit}
					/>
				</div>
			</div>
		</div>
	)
}

export default Component
