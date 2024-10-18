import { ISelectOption, UserRole } from "../interfaces";
// import Logo from "assets/images/linkedLogo.svg"
export * from "./layout";

interface IUSERROLE {
    ADMIN: UserRole,
    STOREUSER: UserRole,
}

export const USER_ROLE: IUSERROLE = {
    ADMIN: 'Admin',
    STOREUSER: 'StoreUser',
}

export const USER_ROLE_ID = {
    ADMIN: 1,
    STOREUSER: 5,
}

export const UserRoles = [
    {
		Id: 1,
		label: USER_ROLE.ADMIN,
	},
	{
		Id: 3,
		label: USER_ROLE.STOREUSER,
	},
];

export const GoogleMapKey = process.env.REACT_APP_GOOGL_MAP_KEY;

// export const DefaultBrandLogo = Logo;

export const DurationOptions: ISelectOption[] = [
	{
		value: 30,
		label: "30 mins",
	},
	{
		value: 45,
		label: "45 mins",
	},
	{
		value: 60,
		label: "1 hour",
	},
	{
		value: 90,
		label: "1:30 hours",
	},
];


export const SnagStatus = [{
	label: "PENDING",
	value: "PENDING"
},
{
	label: "IN PROGRESS",
	value: "IN PROGRESS"
},
{
	label: "VERIFICATION",
	value: "VERIFICATION"
},
{
	label: "COMPLETE",
	value: "COMPLETE"
},
{
	label: "REJECT",
	value: "REJECT"
},
{
	label: "CANCEL",
	value: "CANCEL"
},

]