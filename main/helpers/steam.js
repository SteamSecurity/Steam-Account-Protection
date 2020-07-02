const steam = {
	// Generates a class name from a given number so that Steam's stylesheet can show it properly
	level_class: (level) => {
		var e = (function (n) {
			if ((n.toString(), n)) {
				var e = { thousand: '0', hundred: '0', ten: '0', one: '0' };
				return 4 == n.length ? ((e.thousand = n[0]), (e.hundred = n[1]), (e.ten = n[2])) : 3 == n.length ? ((e.hundred = n[0]), (e.ten = n[1])) : 2 == n.length ? (e.ten = n[0]) : (e.one = n[0]), e;
			}
		})('' + level);
		return '0' != e.thousand ? 'lvl_' + e.thousand + e.hundred + '00 lvl_plus_' + e.ten + '0' : '0' != e.hundred ? 'lvl_' + e.hundred + '00 lvl_plus_' + e.ten + '0' : '0' != e.ten ? 'lvl_' + e.ten + '0' : 'lvl_' + level;
	}
}