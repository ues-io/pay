import { definition, styles, component } from "@uesio/ui"
import { ChangeEvent } from "react"
import { usePaymentInputs } from "react-payment-inputs"
import images, { type CardImages } from "react-payment-inputs/images"

const typedImages = images as unknown as CardImages

interface CCInputProps {
	onNumberChange?: (value: string) => void
	onExpiryChange?: (value: string) => void
	onCVCChange?: (value: string) => void
	error?: string
}

const CCInput: definition.UtilityComponent<CCInputProps> = (props) => {
	const { onNumberChange, onExpiryChange, onCVCChange, context, error } =
		props

	const FieldWrapper = component.getUtility("uesio/io.fieldwrapper")
	const FieldLabel = component.getUtility("uesio/io.fieldlabel")

	const {
		wrapperProps,
		getCardImageProps,
		getCardNumberProps,
		getExpiryDateProps,
		getCVCProps,
	} = usePaymentInputs()

	const classes = styles.useUtilityStyleTokens(
		{
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

	const { focused } = wrapperProps

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

	const fieldErrors = error ? [{ message: error }] : undefined

	return (
		<FieldWrapper errors={fieldErrors} context={context}>
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
						onChange: (e: ChangeEvent<HTMLInputElement>) => {
							onNumberChange?.(e.target.value)
						},
					})}
				/>
				<input
					className={classes.expiry}
					{...getExpiryDateProps({
						onChange: (e: ChangeEvent<HTMLInputElement>) => {
							onExpiryChange?.(e.target.value)
						},
					})}
				/>
				<input
					className={classes.cvc}
					{...getCVCProps({
						onChange: (e: ChangeEvent<HTMLInputElement>) => {
							onCVCChange?.(e.target.value)
						},
					})}
				/>
			</div>
		</FieldWrapper>
	)
}

export default CCInput
