let loading = {
	props: {
		showLoading: {
			type: Boolean,
			default: false
		},
		num: {}
	},
	setup() {},
	template: `<div v-show="showLoading" id="loadingProgress" class="loadingProgress init"><slot></slot></div>`
};

export default loading;