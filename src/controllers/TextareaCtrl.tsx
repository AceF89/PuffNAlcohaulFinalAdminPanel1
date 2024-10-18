import { Controller } from "react-hook-form";
import { Form } from "react-bootstrap";

import { ITextProps } from "../interfaces";

const TextareaCtrl = ({
	control,
	showError,
	placeholder,
	name,
	required,
	disabled,
	id,
	label,
    rows = 1
}: ITextProps) => {
	const rules: any = {
		required: required,
		pattern: {
			value: /^(?!\s*$).+/,
			message: "Field is invalid",
		},
	};
	return (
		<Controller
			rules={rules}
			name={name}
			control={control}
			render={({ field }) => (
				<>
					<Form.Group className="mb-3">
						<Form.Label htmlFor={id}>
							{label}{" "}
							{required && <span className="text-danger">*</span>}
						</Form.Label>
						<Form.Control
							{...field}
                            as='textarea'
                            rows={rows}
							id={id}
							disabled={disabled}
							placeholder={placeholder}
							isInvalid={
								showError && showError(name) ? true : false
							}
						/>
						{showError && showError(name) ? (
							<Form.Control.Feedback
								type="invalid"
								className="d-block"
							>
								{showError(name)}
							</Form.Control.Feedback>
						) : null}
					</Form.Group>
				</>
			)}
		></Controller>
	);
};

export default TextareaCtrl;
