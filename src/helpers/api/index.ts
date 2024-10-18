import {
	login,
	logout,
	signup,
	forgotPassword,
	me,
} from "./auth";

import {  saveUser, getUser, getAllUser, deleteUser,getAllWorker  } from "./user";
import {  getAllRoles, getRolesDetail } from "./roles"
import {getAllOrder,  saveOrder, deleteOrder,} from "./order"
import { saveCoupon, getAllCoupon, getCoupon, deleteCoupon} from "./coupons"
import { saveCategories, getAllCategories, getCategories, deleteCategories} from "./category"
import {saveStores, getAllStores, getStores, deleteStores} from "./store"


export { login, logout,getAllWorker, signup,
	 forgotPassword,saveUser, getUser, getAllUser, deleteUser , me , getAllRoles, getRolesDetail 
	,getAllOrder,  saveOrder, deleteOrder,saveStores, getAllStores, getStores, deleteStores,
	  saveCoupon, getAllCoupon, getCoupon, deleteCoupon, saveCategories, getAllCategories, getCategories, deleteCategories};
