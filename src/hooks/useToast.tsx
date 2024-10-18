import React from "react";
import { useSnackbar, VariantType } from "notistack";

const useToast = () => {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const showToast = (
		variant: VariantType,
		message: string,
		key?: string | number,
	) => {
		const refId = `${key}`;
		const ref = document.getElementById(refId);
		if (ref) {
			ref.innerText = message;
		}
		const toastKey = enqueueSnackbar(<div id={refId}>{message}</div>, {
			variant: variant,
			key: key,
			persist: !!key,
			preventDuplicate: true,
			anchorOrigin: {
				horizontal: "right",
				vertical: "top",
			},
		});

        return toastKey
       
	};

	const dissmisToast = (key: number | string) => {
		closeSnackbar(key);
	};

	return { showToast, dissmisToast };
};

export default useToast;
