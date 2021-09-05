const time = {
	now: () => Date.now(),

	utcToString: (utc_time) => new Date(new Date(utc_time).getTime()).toLocaleString(),

	hoursToMilliseconds: (hours) => hours * 60 * 60 * 1000,

	checkAge: (age, hours) => age + time.hoursToMilliseconds(hours) > time.now(),	// True = fresh data, no need to request more. False = stale data, request an update!

	updateSchedule: (cached_time, timeout) => `\nCurrent time: ${time.utc_to_string(time.now())}\nNext Update: ${time.utc_to_string(cached_time + timeout)}`,

	getCreationDate: (utc_time) => {
		if (utc_time.toString().length !== 13) utc_time = utc_time * 1000;	// Sometimes we get times that are not 13 digits long, this tries to fix that.
		const account_creation_date = new Date(utc_time);
		return account_creation_date.toLocaleString({ year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/(.*)\D\d+/, '$1');
	}
};
