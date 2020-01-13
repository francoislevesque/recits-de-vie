
import * as d3 from "d3";
import colors from "../../services/colors";
import { Graph } from "./graph";

const TICK_PADDING = 6;
const TICK_MARGIN_TOP = 10;
const TRANSITION_DURATION = 200;
const TRANSITION_EASE = d3.easeQuadInOut;

class Graphs {

	constructor (container, data, domainX, filters) {

		this.container = container;
		this.data = data;
		this.domainX = domainX;
		this.filters = filters;
    
		this.categories = ["revenu", "prestations", "benefices", "prelevements"];

		this.containerWidth = this.container.clientWidth;
		this.containerHeight = this.container.clientHeight;
  
		this.margin = {
			top: 24,
			bottom: TICK_MARGIN_TOP + 20,
			left: 190,
			right: 10
		};
    
		this.width = this.containerWidth - this.margin.left - this.margin.right;
		this.height = this.containerHeight - this.margin.top - this.margin.bottom;
        
		this.scaleX = d3.scaleLinear()
			.domain(this.domainX)
			.range([0, this.width]);
      
		this.axisX = d3.axisBottom(this.scaleX)
			.tickSize(5)
			.tickPadding(TICK_PADDING)
			.ticks(3)
			.tickFormat((d) => (+d).priceFormat());

		this.svg = d3.select(container).append("svg")
			.attr("width", this.width + this.margin.left + this.margin.right)
			.attr("height", this.height + this.margin.top + this.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
      
		this.draw();
	}
  
	color (category) {
		return "text-" + colors[category] + "-500";
	}
  
	draw () {

		this.gAxisX = this.svg.append("g")
			.attr("class", "axis axis-x")
			.attr("transform", "translate(0," + (this.height + TICK_MARGIN_TOP) + ")")
			.call(this.axisX);
      
		this.bars = this.svg.selectAll(".bar")
			.data(this.data)
			.enter()
			.append("g");
      
		this.graphs = [];
    
		let numberOfBars = this.data.reduce((acc, d) => acc += d.amounts.length, 0);
		let heightPerBar = this.height / numberOfBars;  
		let offset = 0;
          
		["revenu", "prestations", "benefices", "prelevements"].forEach(category => {
			let data = this.data.find(d => d.name == category).amounts;
			let height = heightPerBar * data.length;
			let g = this.svg.append("g")
				.attr("transform", `translate(${0},${offset})`);
			let graph = new Graph(g, height, this.width, data, this.scaleX, category);
			this.graphs.push(graph);
			graph.draw();
			offset += height;
		});
    
		this.redraw(this.domainX, this.data, this.filters);
	}
  
	redraw (domainX, data, filters) {

		this.data = data;
		this.domainX = domainX;
		this.filters = filters;

		this.scaleX.domain(this.domainX);
    
		this.gAxisX.transition()
			.duration(TRANSITION_DURATION)
			.ease(TRANSITION_EASE)
			.call(this.axisX.scale(this.scaleX));
            
		this.graphs.forEach(g => {
			g.redraw(this.data.find(d => d.name == g.category).amounts);
		});
	}
}

export { Graphs };
