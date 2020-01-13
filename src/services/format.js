import rawData from "./dataRaw";

let categories = {
	revenu: ["revenu"],
	prestations: ["credit-tps", "credit-solidarite", "afe", "pension", "allocation-cad-enfants", "paiement-soutien-enfants", "regime-assurance-parentale", "allocation-fournitures-scolaires", "cisd"],
	benefices: ["sante", "service-es", "service-de-garde", "service-de-garde-scolaire", "primaire-secondaire", "assurance-medicament", "rentes"],
	prelevements: ["impot", "frais-de-garde", "rrq", "rqap", "ae", "taxes", "fond-service-sante", "regime-assurance-medicament"],
};

function scenarios() {
	return Object.values(rawData).map(d => scenario(d));
}

function scenario(rawData) {
	let data = [];
	for (let i = 18; i <= 87; i++) {
		data.push({
			year: i,
			categories: year(rawData, i)
		});
	}
	return data;
}

function year(rawData, year) {
	let data = {};

	Object.keys(categories).forEach(c => {
		data[c] = {
			total: 0
		};
		categories[c].forEach(a => {
			data[c][a] = 0;
		});
	});

	rawData.forEach(years => {
		let category = years.category;
		let amount = years[year];
		if (amount !== undefined) {
			amount = parseInt(amount);
			Object.keys(categories).forEach(key => {
				if (categories[key].includes(category)) {
					if (key == "prelevements") {
						amount = -amount;
					}
					data[key][category] = amount;
					data[key].total += amount;
				}
			});
		}
	});
  

	return data;
}

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
				return a.name != "total";
			})
			.sort((a, b) => {
				if (Math.abs(a.value) > Math.abs(b.value)) {
					return -1;
				}
				if (Math.abs(a.value) < Math.abs(b.value)) {
					return 1;
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

export { scenarios, amounts };
