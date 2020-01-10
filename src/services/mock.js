function mockData () {
	let data = [];
	for (let i = 0; i < 3; i++) {
		data.push(mockScenario());
	}
	return data;
}

function mockScenario() {
	let scenario = [];
	for (let i = 18; i < 76; i++) {
		let data = {
			year: i,
			revenu: {
				total: Math.round(Math.random() * 800000) * (i/80)
			},
			benefices: {
				health: Math.round(Math.random() * 40000),
				education: Math.round(Math.random() * 10000),
				other: Math.round(Math.random() * 10000)
			},
			prestations: {
				return: Math.round(Math.random() * 30000),
				solidarite: Math.round(Math.random() * 30000)
			},
			prelevements: {
				impots: -Math.round(Math.random() * 20000),
				taxes: -Math.round(Math.random() * 20000)
			}
		};

		data.prestations.total = Object.values(data.prestations).reduce((a, b) => a + b, 0);
		data.benefices.total = Object.values(data.benefices).reduce((a, b) => a + b, 0);
		data.prelevements.total = Object.values(data.prelevements).reduce((a, b) => a + b, 0);

		scenario.push(data);
	}
	return scenario;
}

export { mockData };
