const html_effects = {
	fade_in: (element, display_timeout = 0) => {
		element.style.display = `flex`;
		setTimeout(() => {
			element.style.opacity = `1`;
		}, display_timeout);
	},
	fade_out: (element, display_timeout = 200) => {
		element.style.opacity = `0`;
		setTimeout(() => {
			element.style.display = `none`;
		}, display_timeout);
	}
}