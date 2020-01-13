
import * as d3 from "d3";
import colors from "../../services/colors";

const PADDING_LEFT = 5;
const TICK_PADDING = 8;
const BEZIER_CURVE = 10;
const TRANSITION_DURATION = 200;
const TRANSITION_EASE = d3.easeQuadInOut;

class Graph {

	constructor (container, data, domainY, filters) {

		this.container = container;
		this.data = data;
		this.domainY = domainY;
		this.filters = filters;
    
		this.categories = ["revenu", "prestations", "benefices", "prelevements"];

		this.containerWidth = this.container.clientWidth;
		this.containerHeight = this.container.clientHeight;
  
		this.margin = {
			top: 24,
			bottom: 40,
			left: 52,
			right: 2
		};
    
		this.width = this.containerWidth - this.margin.left - this.margin.right;
		this.height = this.containerHeight - this.margin.top - this.margin.bottom;
    
		this.scales = {
			x: null,
			y: null
		};
    
		this.scales.x = d3.scaleBand()
			.domain(this.data.map(d => d.year))
			.range([PADDING_LEFT, this.width])
			.padding(0.2);
      
		this.scales.y = d3.scaleLinear()
			.domain(this.domainY)
			.range([this.height, 0]);
      
		this.axis = {
			x: null,
			y: null
		};

		this.svg = d3.select(container).append("svg")
			.attr("width", this.width + this.margin.left + this.margin.right)
			.attr("height", this.height + this.margin.top + this.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
      
		this.axis.x = d3.axisTop(this.scales.x)
			.tickSize(0)
			.ticks(1)
			.tickPadding(TICK_PADDING);
      
		this.axis.y = d3.axisLeft(this.scales.y)
			.tickSize(-this.width)
			.ticks(5)
			.tickFormat((d) => (+d).priceFormat())
			.tickPadding(TICK_PADDING);
      
		this.draw();
    
		this.redraw(this.domainY, this.filters);
	}
  
	color (category) {
		return "text-" + colors[category] + "-500";
	}
  
	draw () {

		this.axisX = this.svg.append("g")
			.attr("class", "axis axis-x")
			.call(this.axis.x);

		this.axisY = this.svg.append("g")
			.attr("class", "axis axis-y")
			.call(this.axis.y);

		this.bars = this.svg.selectAll(".bar")
			.data(this.data)
			.enter()
			.append("g");
      
		["revenu", "prestations", "benefices", "prelevements"].forEach(category => {
			this.bars.append("rect")
				.attr("data-category", category)
				.attr("class", d => "band fill-current " + this.color(category))
				.attr("y", d => this.bandY(category, d))
				.attr("height", d => this.bandHeight(category, d))
				.attr("x", d => this.scales.x(d.year))
				.attr("width", this.scales.x.bandwidth());
		});
      
		this.abscisse = this.svg.append("line")
			.attr("x1", this.scales.x(0))
			.attr("x2", this.width)
			.attr("y1", this.scales.y(0))
			.attr("y2", this.scales.y(0))
			.attr("stroke", "#666")
			.attr("stroke-width", 2);
      
		this.selectLineTop = this.svg.append("line")
			.attr("x1", this.scales.x(this.filters.selected[0]))
			.attr("x2", this.width)
			.attr("y1", 0)
			.attr("y2", 0)
			.attr("stroke", "#000")
			.attr("stroke-width", 2);
      
		this.selectLineBottom = this.svg.append("line")
			.attr("x1", this.scales.x(this.filters.selected[0]))
			.attr("x2", this.width)
			.attr("y1", this.scales.y(0))
			.attr("y2", this.scales.y(0))
			.attr("stroke", "#000")
			.attr("stroke-width", 2);
            
		this.bezierLeft = this.svg.append("path")
			.attr("class", "hidden lg:block")
			.attr("stroke", "#a1a1a1")
			.attr("stroke-dasharray", 4)
			.attr("fill", "transparent")
			.attr("d", this.bezierLeftCurve());
      
		this.bezierLeft = this.svg.append("path")
			.attr("class", "hidden lg:block")
			.attr("stroke", "#a1a1a1")
			.attr("stroke-dasharray", 4)
			.attr("fill", "transparent")
			.attr("d", this.bezierRightCurve());
	}
  
	redraw (domainY, filters) {

		this.domainY = domainY;
		this.filters = filters;

		this.scales.y.domain(this.domainY);
    
		this.axisY.transition()
			.duration(TRANSITION_DURATION)
			.ease(TRANSITION_EASE)
			.call(this.axis.y.scale(this.scales.y));
    
		this.bars
			.selectAll("rect")
			.transition()
			.duration(TRANSITION_DURATION)
			.ease(TRANSITION_EASE)
			.attr("height", (d, i, node) => this.bandHeight(node[i].getAttribute("data-category"), d))
			.attr("y", (d, i, node) => this.bandY(node[i].getAttribute("data-category"), d))
			.attr("opacity", (d, i, node) => {
				if (d.year < this.filters.visible[0] || d.year > this.filters.visible[1]) {
					return 0;
				} 
				if (d.year < this.filters.selected[0] || d.year > this.filters.selected[1]) {
					return 0.1;
				}
				if (this.filters.category != null && node[i].getAttribute("data-category") != this.filters.category) {
					return 0.1;
				} 
				return 1;
			});
      
		this.abscisse
			.transition()
			.ease(TRANSITION_EASE)
			.duration(TRANSITION_DURATION)
		  .attr("x1", this.scales.x(0))
			.attr("x2", this.width)
			.attr("y1", this.scales.y(0))
			.attr("y2", this.scales.y(0));
    
		this.selectLineTop
			.transition()
			.ease(TRANSITION_EASE)
			.duration(TRANSITION_DURATION)
			.attr("x1", this.scales.x(this.filters.selected[0]))
			.attr("x2", this.scales.x(this.filters.selected[1]) + this.scales.x.bandwidth());
      
		this.selectLineBottom
			.transition()
			.ease(TRANSITION_EASE)
			.duration(TRANSITION_DURATION)
			.attr("x1", this.scales.x(this.filters.selected[0]))
			.attr("x2", this.scales.x(this.filters.selected[1]) + this.scales.x.bandwidth())
			.attr("y1", this.scales.y(0))
			.attr("y2", this.scales.y(0));
      
		this.bezierLeft
			.transition()
			.ease(TRANSITION_EASE)
			.duration(TRANSITION_DURATION)
			.attr("d", this.bezierLeftCurve());
      
		this.bezierLeft
			.transition()
			.ease(TRANSITION_EASE)
			.duration(TRANSITION_DURATION)
			.attr("d", this.bezierRightCurve());
	}
  
	bandY (category, d) {
		let y = Math.min(this.scales.y(0), this.scales.y(d.categories[category].total));
		if (category == "prestations" || category == "benefices") {
			y -= (this.scales.y(0) - this.scales.y(d.categories.revenu.total));
		}
		if (category == "benefices") {
			y -= (this.scales.y(0) - this.scales.y(d.categories.prestations.total));
		}
		return y;
	}
  
	bandHeight (category, d) {
		return Math.abs(this.scales.y(d.categories[category].total) - this.scales.y(0));
	}

	bezierBottom () {
		return this.height + this.margin.bottom;
	}
  
	bezierLeftCurve () {
		return `M ${this.scales.x(this.filters.selected[0])} 0 L ${this.scales.x(this.filters.selected[0])} ${this.bezierBottom() - BEZIER_CURVE} q 0 ${BEZIER_CURVE} -${BEZIER_CURVE} ${BEZIER_CURVE} L 0 ${this.bezierBottom()}`;
	}

	bezierRightCurve () {
		return `M ${this.scales.x(this.filters.selected[1]) + this.scales.x.bandwidth()} 0 L ${this.scales.x(this.filters.selected[1]) + this.scales.x.bandwidth()} ${this.bezierBottom() - BEZIER_CURVE} q 0 ${BEZIER_CURVE} ${BEZIER_CURVE} ${BEZIER_CURVE} L ${this.width} ${this.bezierBottom()}`;
	}
}

export { Graph };
