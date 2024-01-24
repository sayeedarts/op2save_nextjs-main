import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../services/axios'

// async Thunk
export const homePageData = createAsyncThunk(
	'services',
	async () => {
		const callApi = await axios.get('service/all');
		const getData = await callApi.data.data;
		return getData;
	}
)

export const getServiceDetails = createAsyncThunk(
	'service/details',
	async (slug) => {
		const callApi = await axios.get(`service/${slug}/details`);
		const getData = await callApi.data.data;
		return getData;
	}
)

const initialState = {
	settings: [],
	servicex: [], // Short services with limited info
	toggle_contact_modal: true,
	selected_slug: "",
	user: {
		fullname: "",
		email: "",
		phoneno: "",
	},
	// Full services data with all required details
	services: {
		status: 'pending',
		data: []
	},
	service_details: {
		status: 'pending',
		data: []
	},
	query_form: {
		service: {},
		from: "",
		to: ""
	},
	selected_service_id: 0,
	selected_items: [],
	pickup_data: {
		pickup_type: null,
		pickup_date: null
	},
	additional: [],
	instruction: null
}

export const homeSlice = createSlice({
	name: 'service',
	initialState,
	reducers: {
		storeSettings: (state, action) => {
			state.settings = action.payload
		},
		storeServices: (state, action) => {
			state.servicex = action.payload
		},
		selectedService: (state, action) => {
			state.query_form.service = {
				id: action.payload.service.id,
				title: action.payload.service.title,
				slug: action.payload.service.slug,
			};
			state.query_form.from = action.payload.fromLoc
			state.query_form.to = action.payload.toLoc
		},
		getSelectedItems: (state, action) => {
			/**
			 * Checkbox check/uncheck
			 */
			if (action.payload.is_checked) {
				state.selected_items.push({
					id: action.payload.id,
					count: 1
				})
			} else {
				const objIndex = state.selected_items.findIndex((obj => obj.id == action.payload.id))
				state.selected_items.splice(objIndex, 1)
			}
		},
		emptyQuoteReq: (state, action) => {
			state.selected_items = []
		},
		itemCountToggle: (state, action) => {
			/**
			 * Plus or Minus Toggle 
			 */
			const objIndex = state.selected_items.findIndex((obj => obj.id == action.payload.id))
			if (action.payload.mode == "plus") {
				state.selected_items[objIndex]['count'] = (state.selected_items[objIndex]['count'] + 1)
			} else if (action.payload.mode == "minus") {
				if (state.selected_items[objIndex]['count'] > 1) {
					state.selected_items[objIndex]['count'] = (state.selected_items[objIndex]['count'] - 1)
				}
			}
		},
		getAdditionaHelps: (state, action) => {
			if (action.payload.status === true) {
				state.additional.push(action.payload.id)
			} else {
				const objIndex = state.additional.findIndex((obj => obj == action.payload.id))
				state.additional.splice(objIndex, 1)
			}
		},
		getPickupDetails: (state, action) => {
			if (action.payload.pickup_date) {
				state.pickup_data.pickup_date = action.payload.pickup_date
			} else if (action.payload.pickup_type) {
				state.pickup_data.pickup_type = action.payload.pickup_type
			}
		},
		specialInstructions: (state, action) => {
			state.instruction = action.payload;
		},
		userDetails: (state, action) => {
			// Gather User details
			Object.assign(state.user, action.payload);
		},
		selectSlug: (state, action) => {
			state.selected_slug = action.payload
		},
		toggleContactModal: (state, action) => {
			state.toggle_contact_modal = action.payload.status
		}
	},
	extraReducers: {
		[homePageData.pending]: (state, action) => {
			state.services.status = "pending";
			state.services.data = [];
			// state.products = action.payload
		},
		[homePageData.fulfilled]: (state, action) => {
			state.services.status = "success"
			state.services.data = action.payload
		},
		[homePageData.rejected]: (state, action) => {
			state.services.status = 'failed'
			state.services.data = []
		},
		[getServiceDetails.pending]: (state, action) => {
			state.service_details.status = "pending";
			state.service_details.data = [];
			// state.products = action.payload
		},
		[getServiceDetails.fulfilled]: (state, action) => {
			if (typeof action.payload !== "undefined") {
				state.service_details.status = "success"
				state.service_details.data = action.payload
				state.selected_service_id = action.payload.id
			}
		},
		[getServiceDetails.rejected]: (state, action) => {
			state.service_details.status = 'failed'
			state.service_details.data = []
		},
	}
})

// Action creators are generated for each case reducer function
export const {
	storeSettings, storeServices,
	selectedService, emptyQuoteReq,
	getSelectedItems,
	itemCountToggle,
	getAdditionaHelps,
	getPickupDetails,
	specialInstructions,
	userDetails,
	selectSlug,
	toggleContactModal
} = homeSlice.actions

export default homeSlice.reducer