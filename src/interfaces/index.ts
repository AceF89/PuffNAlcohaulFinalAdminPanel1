

type IBaseCtrlRuleValidate = (value: string) => any;
interface IBaseCtrlRule {
	[key: string]:
		| IBaseCtrlRuleValidate
		| {
				value?: any;
				message?: string;
		  };
	// validate?: (value?: any) => any;
}

type IBaseCtrlComponentName =
	| "PhoneNumber"
	| "Email"
	| "Website"
	| "Address"
	| "Name"
	| "FullName"
	| "Number";
	export interface IBaseCtrl {
		control: any;
		showError: any;
		className?: string;
		placeholder: string;
		name: string;
		required: boolean;
		componentName?: IBaseCtrlComponentName;
		disabled: boolean;
		id?: string;
		float?: boolean;
		defaultValue?: any;
		hint?: string;
		rules?: IBaseCtrlRule;
		minLength?: number;
		maxLength?: number;
	  }

export interface IInputProps extends IBaseCtrl {
	type: string;
	label: string;
	endAdornment?: any;
	startAdornment?: any;
	startAdornmentIcon?: any;
	endAdornmentIcon?: any;
	inputProps?: any;
	as?: "input" | "textarea";
	max?: string;
	min?: string;
	edit?: boolean
}

interface ILatLng {
	lat: number;
	lng: number;
}
interface IMarker {
	name: string;
	placeId: string;
	position: ILatLng;
}
export interface IGoogleMapProps extends IBaseCtrl {
	label: string;
	onChangePlaceId: (placeId: string, latLan: ILatLng) => void;
	marker?: IMarker;
	onChangeInputValue: (inputValue: string) => void;
}

export interface ICheckboxProps extends IBaseCtrl {
	label: string;
	inputProps?: any;
}

export interface IRadioProps extends IBaseCtrl {
	label: string;
	value: any;
}

export interface ITextProps extends IBaseCtrl {
	label: string;
	inputProps?: any;
	rows?: number;
}

export interface ITextAreaProps extends IBaseCtrl {
	label: string;
	endAdornment?: any;
	startAdornment?: any;
	startAdornmentIcon?: any;
	endAdornmentIcon?: any;
	inputProps?: any;
	rows: any;
}



//   export interface IPhoneNumberProps extends IBaseCtrl {
//     type: string;
//     label: string;
//     handleChange?: (
//       val: string,
//       data: CountryData | {},
//       event: React.ChangeEvent<HTMLInputElement>,
//       formattedValue: string
//     ) => void;
//   }

export interface ISelectOption {
	value: string | number;
	label: string;
	item?: { [key: string]: any };
}



export interface ISelectProps extends IBaseCtrl {
	// type: string;
	label: string;
	options: ISelectOption[];
	endAdornment?: any;
	startAdornment?: any;
	startAdornmentIcon?: any;
	endAdornmentIcon?: any;
	inputProps?: any;
	onSelect?: (option: ISelectOption) => void;
	cb?: () => void;
	onChange?:any
	pagination?:any
	promiseMethod?: any;
	showNoneOption?: boolean;
	canFetch?: boolean;
	params?: any;
	labelKey?: string;
	valueKey?: string;
	query?:string
	fetch?:boolean
}

export interface ICheckboxesProps extends IBaseCtrl {
	label: string;
	inputProps?: any;
	options: ISelectOption[];
}
export interface IAsyncSelectProps extends IBaseCtrl {
	// type: string;
	label: string;
	options: ISelectOption[];
	endAdornment?: any;
	startAdornment?: any;
	startAdornmentIcon?: any;
	endAdornmentIcon?: any;
	inputProps?: any;
	onSelect?: (option: ISelectOption) => void;
	cb?: () => void;
	systemObjectId: string | undefined;
	defaultValue?: any;
}

interface IActionPerformedBy {
	AddedBy: number;
	AddedOn: string;
	ModifiedBy: number;
	ModifiedOn: string;
	CreatedName: string;
}

export interface IVendor extends IActionPerformedBy {
	Id: number;
	CompanyName: string;
	Password: string;
	ConfirmPassword: string;
	TypeOfService: string;
	Address: string;
	CityId: number;
	MainContact: string;
	Title: string;
	ContactEmail: string;
	ContactPhone: string;
	TimeZone: string;
	SecondaryContact: string;
	MainPhone: string;
	SecondaryTitle: string;
	SecondaryEmail: string;
	SecondaryPhone: string;
	SecondaryWebsite: string;
	GooglePlaceId: string;
	LogoFileId: number;
	CityName: string;
	StateId: number;
	StateName: string;
	CountryId: number;
	CountryName: string;
	LogoURL: any;
	FullFileUrl: string;
	AssetsServing: string;
	NoofBusinesses: number;
	NoofClients: number;
	NoofEquipment: number;
	NoofFleets: number;
	NoofLocation: number;
	Lat: number;
	Long: number;
	GoogleMapLocation: string;
}

export interface ICountry {
	Id: number;
	Name: string;
	SortName: string;
	PhoneCode: number;
}

export interface IState {
	Id: number;
	Name: string;
	CountryId: number;
	IsActive: boolean;
}

export interface ICity {
	Id: number;
	Name: string;
	StateId: number;
	IsActive: boolean;
}

export interface IAssets extends IActionPerformedBy {
	Address: string;
	LocationName: string;
	StateName: string
	Id: number;
	Name: string;
	Code: string;
	CategoryId: number;
	AssetTypeId: number;
	Type: string;
	LocationId: number;
	Room: string;
	Department: string;
	Model: string;
	Make: string;
	SerialNumber: string;
	Height: number;
	Width: number;
	Depth: number;
	FilesIds: string;
	IsActive: boolean;
	Cost: number;
	ReplacementCost: number;
	PurchasedOn: string;
	Notes: string;
	AddedBy: number;
	CurrentLocation?: string;
	GooglePlaceId: string;
	Lat: number;
	Long: number;
	GoogleMapLocation: string;
	FloorId: number;
	FullFloorFileUrl: string;
	FloorCoordinateTitle: string;
	FloorCoordinateX: number;
	FloorCoordinateY: number;
	Floors?: IFloor[];
}

export type UserRole = "Admin" | "StoreUser";

export interface IUser extends IActionPerformedBy {
	Id: number;
	FirstName: string;
	LastName: string;
	WorkEmail: string;
	ContactPhone: string;
	Gender: string;
	RoleId: number;
	TeamId: number;
	IsActive: boolean;
	IsBlocked: boolean;
	AssignedSuprvisor: string;
	BusinessIds: string;
	LocationIds: string;
	AuthorityToCheckOutAssets: boolean;
	OTP: number;
	PersonalEmail: string;
	Password: string;
	WorkPhoneNumber: string;
	Cell: string;
	ProfilePicId: number;
	CertificationId: number;
	LicensesId: number;
	DOB: string;
	CityId: number;
	Address: string;
	PhoneNumber: string;
	Email: string;
	ZipCode: string;
	DOBValue: string;
	Age: number;
	fullName: string;
	roleName: UserRole;
	IsSuperAdmin: boolean;
	IsAdmin: boolean;
	IsUser: boolean;
	IsManager: boolean;
	Token: string;
	IsProfileCompleted: boolean;
	CityName: string;
	StateId: number;
	StateName: string;
	CountryId: number;
	CountryName: string;
	FileName: string;
	FileUrl: string;
	CertificationPicUrl: string;
	LicensesPicUrl: string;
	FullFileUrl: string;
	FullCertificationPicUrl: string;
	FullLicensesPicUrl: string;
	TeamName: string;
	token: string;
	FullTeamLogoUrl: string;
	IsImpersonate?: boolean;
}

export interface IIssue extends IActionPerformedBy {
	Id: number;
	Description: string;
	AssetId: number;
	AssignedId: number;
	IssueType: string;
	Type: string;
	DueDate: string;
	Status: string;
	AssetName: string;
	AssignedName: string;
}

export interface IAssetType extends IActionPerformedBy {
	Id: number;
	Name: string;
}

export interface MenuItemTypes {
	key: string;
	label: string;
	isTitle?: boolean;
	icon?: string;
	url?: string;
	badge?: {
		variant: string;
		text: string;
	};
	parentKey?: string;
	target?: string;
	allowedUsers: UserRole[];
	extraFields?: Record<string, any>;
	children?: MenuItemTypes[];
}

export interface IDataTypeValue extends IActionPerformedBy {
	Id: number;
	TypeId: number;
	Value: string;
	Value2?: string;
	DataTypeName: string;
}

export interface IDepartment extends IActionPerformedBy {
	Id: number;
	Name: string;
}

export interface IAssetTransaction {
	Id: number;
	UserId: number;
	AssetId: number;
	TeamId: number;
	TransactionType: string;
    OutDateTime: string;
    InDateTime: string;
	TransactionDateTime: string;
	Notes: string;
	AssetName: string;
	LocationName: string;
	TeamName: string;
	UserName: string;
}

export interface ICheckOut {
	Id: number;
	AssetId: number;
	TeamId: number;
	ReasonId: number;
	Duration: number;
	TransactionType: string;
	TransactionDateTime: string;
	Date: any;
	Time: any;
	IsGoodCondition: boolean | string;
	IsWorking: boolean | string;
	Notes: string;
	UserChecked: string;
	UserId: number;
}

export interface ITeam extends IActionPerformedBy, ICountryStateCity {
	Id: number;
	Name: string;
	Address: string;
	LogoFileId: number;
	TimeZone: string;
	TypeId: number;
	Website: string;
	PhoneNumber: string;
	MainContactPerson: string;
	MainContactTitle: string;
	MainContactEmail: string;
	MainContactPhoneNumber: string;
	SecondaryContactPerson: string;
	SecondaryContactTitle: string;
	SecondaryContactEmail: string;
	SecondaryContactPhoneNumber: string;
	GooglePlaceId: string;
	GoogleMapLocation: string;
	Lat: number;
	Long: number;
	FullFileUrl: string;
	Description: string;
}

export interface ICompanyInforamtion extends ITeam {}

interface IGoogleMap {
	GooglePlaceId: string;
	GoogleMapLocation: string;
	Lat: number;
	Long: number;
}

interface ICountryStateCity {
	CityId: number;
	CityName?: string;
	StateId: number;
	StateName?: string;
	CountryId: number;
	CountryName?: string;
}

export interface ILocation
	extends IGoogleMap,
		ICountryStateCity,
		IActionPerformedBy {
	Id: number;
	Name: string;
	TeamId: number;
	TimeZoneId: number;
	TeamName: string;
}

export interface IFloor extends IActionPerformedBy {
	Id: number;
	Name: string;
	Notes: string;
	FileId: number;
	LocationId: number;
	LocationName: string;
	TeamName: string;
	FileUrl: string;
	FullFileUrl: string;
}

export interface IFile extends IActionPerformedBy {
	Id: number;
	FileName: string;
	FileUrl: string;
	Type: string;
	FullFileUrl: string;
}

export interface ITicket extends IIssue, IGoogleMap, IActionPerformedBy {
	FileIds?: string;
	Priority: string;
	VendorId: 0;
	AssetTypeId: 0;
}

export interface IInspection {
	Id: number;
	AssetId: number;
	UserId: number;
	StartDate: string;
	EndDate: string;
	Duration: number;
	Description: string;
	IsSelfAssesment: boolean;
	IsQualityAssesment: boolean;
	IsOther: boolean;
	HealthSafetyFileIds: string;
	MaterialHandlingFileIds: string;
	ActivitiesFileIds: string;
}

export interface IMaintenanceSchedule {
	Id: number;
	AssetId: number;
	Status: string;
	Recurring: string;
	Description: string;
	AssignedTo: number;
	MaintType: string;
	DueDate: string;
	IsEmailSend: boolean;
	EmailsSentTo: string;
	AddedBy: number;
	ModifiedBy: number;
	ModifiedOn: string;
	AddedOn: string;
	AssetName: string;
	AssignedName: string;
	Frequency?: string;
	FrequencyValue?: string;
}

export interface IIcon {
	width?: number;
	height?: number;
	color?: string;
}


export interface ITextProps extends IBaseCtrl {
    label: string;
    inputProps?: any;
    rows?: number;
}