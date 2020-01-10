function amounts(scenarios, filters) {
	return scenarios.map(s => {
		return _amounts(s, filters);
	});
}

function _amounts (scenario, filters) {
	let data = {};
	let selected = 	scenario
		.filter(year => year.year >= filters.selected[0] && year.year <= filters.selected[1]);
		
	selected.forEach(year => {
		Object.keys(year.categories).forEach(category => {

			let amounts = year.categories[category];

			if (data[category] === undefined) {
				data[category] = {};

				Object.keys(amounts).forEach(name => {
					data[category][name] = 0;
				});
			}
            
			Object.keys(amounts).forEach(name => {
				data[category][name] += amounts[name] / selected.length;
			});
		});
	});

	let filteredData = [];

	Object.keys(data).forEach(key => {
		let amounts = data[key];
		amounts = Object.keys(amounts)
			.map(name => {
				return {
					name: name,
					value: amounts[name]
				};
			})
			.filter(a => {
				return a.name != "total" && Math.abs(a.value) > 0; 
			})
			.sort((a, b) => {
				if (a.value > b.value) {
					return 1;
				}
				if (a.value < b.value) {
					return -1;
				}
				return 0;
			});
          
		filteredData.push({
			name: key,
			amounts: amounts
		});
	});
      
	return filteredData;
}

export { amounts };
