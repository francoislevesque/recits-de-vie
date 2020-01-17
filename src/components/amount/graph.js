
import * as d3 from "d3";
import colors from "../../services/colors";
import VueI18n from "../../i18n";

const TRANSITION_DURATION = 400;
const TRANSITION_EASE = d3.easeQuadInOut;
const BAR_HEIGHT = 4;

class Graph {

	constructor (container, height, width, data, scaleX, category, filters) {

		this.container = container;
		this.data = data;
		this.scaleX = scaleX;
		this.category = category;
		this.filters = filters;
    
		this.margin = {
			top: 0,
			bottom: 5,
			left: 0,
			right: 0
		};
    
		this.width = width - this.margin.left - this.margin.right;
		this.height = height - this.margin.top - this.margin.bottom;
      
		this.svg = this.container
			.append("g")
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
      
		this.bars = this.svg.append("g").attr("class","bars");
    
		this.scaleY = this.getScaleY();
	}
  
	draw () {
		this.drawBands();
      
		this.origin = this.svg.append("line")
			.attr("class", "y")
			.attr("x1", this.scaleX(0))
			.attr("x2", this.scaleX(0))
			.attr("y1", 0)
			.attr("y2", this.height)
			.attr("stroke", "#000")
			.attr("stroke-width", 1)
			.attr("opacity", this.lineOpacity());
	}
  
	redraw (data, filters) {
		this.data = data;
		this.filters = filters;
		this.scaleY = this.getScaleY();
    
		this.drawBands();

		this.origin = this.svg.select("line.y").transition()
			.duration(TRANSITION_DURATION)
			.ease(TRANSITION_EASE)
			.attr("y2", this.height)
			.attr("opacity", this.lineOpacity());
	}
  
	drawBands () {
		this.bars.selectAll("g").data(this.data, d => d.name)
			.join(
				enter =>  {
					let g = enter.append("g")
						.attr("transform", d => `translate(0,${this.scaleY(d.name)})`)
						.attr("opacity", d => this.bandOpacity(d));

					g.append("rect")
						.attr("class", d => "fill-current " + this.colorClass("500"))
						.attr("x", 0)
						.attr("height", BAR_HEIGHT)
						.attr("y", d => (this.scaleY.bandwidth() - BAR_HEIGHT) / 2)
						.attr("width", d => this.bandWidth(d));
            
					g.append("circle")
						.attr("class", d => "highlight fill-current " + this.colorClass("500"))
						.attr("cy", this.scaleY.bandwidth() / 2)
						.attr("cx", d => this.bandWidth(d))
						.style("transform-origin", d => `${this.bandWidth(d)}px ${this.scaleY.bandwidth() / 2}px`)
						.attr("r", 6);

					g.append("circle")
						.attr("class", d => "dot fill-current " + this.colorClass("700"))
						.attr("cy", this.scaleY.bandwidth() / 2)
						.attr("cx", d => this.bandWidth(d))
						.attr("r", 6);
            
					g.append("text")
						.attr("class", d => this.fontClasses(d, "label_"))
						.attr("text-anchor", "end")
						.attr("alignment-baseline", "middle")
						.text(d => VueI18n.tc(d.name))
						.attr("y", d => (this.scaleY.bandwidth()) / 2 + 1)
						.attr("x", -8);
            
					g.append("text")
						.attr("class", d => this.fontClasses(d, "value"))
						.attr("text-anchor", "start")
						.attr("alignment-baseline", "middle")
						.text(d => d.value.priceFormat())
						.attr("y", d => (this.scaleY.bandwidth()) / 2 + 1)
						.attr("x", d => this.bandWidth(d) + 10);
				},
				update => {
					update.transition()
						.duration(TRANSITION_DURATION)
						.ease(TRANSITION_EASE)
						.attr("transform", d => `translate(0,${this.scaleY(d.name)})`)
						.attr("opacity", d => this.bandOpacity(d));
            
					update.select("rect")
						.transition()
						.duration(TRANSITION_DURATION)
						.ease(TRANSITION_EASE)
						.attr("y", d => (this.scaleY.bandwidth() - BAR_HEIGHT) / 2)
						.attr("width", d => this.bandWidth(d));
            
					update.select("circle.dot")
						.transition()
						.duration(TRANSITION_DURATION)
						.ease(TRANSITION_EASE)
						.attr("cy", this.scaleY.bandwidth() / 2)
						.attr("cx", d => this.bandWidth(d));
            
					update.select("circle.highlight")
						.transition()
						.duration(TRANSITION_DURATION)
						.ease(TRANSITION_EASE)
						.attr("cy", this.scaleY.bandwidth() / 2)
						.attr("cx", d => this.bandWidth(d))
						.style("transform-origin", d => `${this.bandWidth(d)}px ${this.scaleY.bandwidth() / 2}px`)
						.attr("opacity", (this.filters.selectedCategories.includes(this.category) && this.filters.showHighlights) ? 0.6 : 0);
            
					update.select("text.label_")
						.attr("class", d => this.fontClasses(d, "label_"))
						.transition()
						.duration(TRANSITION_DURATION)
						.ease(TRANSITION_EASE)
						.attr("y", d => (this.scaleY.bandwidth() - BAR_HEIGHT) / 2 + 3);
            
					update.select("text.value")
						.attr("class", d => this.fontClasses(d, "value"))
						.transition()
						.duration(TRANSITION_DURATION)
						.ease(TRANSITION_EASE)
						.text(d => d.value.priceFormat())
						.attr("y", d => (this.scaleY.bandwidth()) / 2 + 1)
						.attr("x", d => this.bandWidth(d) + 10);
				},
				exit => exit
					.call(exit => exit
						.transition()
						.duration(TRANSITION_DURATION)
						.ease(TRANSITION_EASE)
						.attr("transform", "scale(0, 1)")
						.remove())
			);
	}
  
	getScaleY () {
		return d3.scaleBand()
			.domain(this.data.map(d => d.name))
			.range([0, this.height])
			.padding(0.2);
	}
  
	lineOpacity () {
		if (!this.filters.visibleCategories.includes(this.category)) {
			return 0.1;
		}
		return 1;
	}
  
	bandOpacity (d) {
		if (!this.filters.visibleCategories.includes(this.category)) {
			return 0.1;
		}
		if (d.value === 0) {
			return 0.1;
		}
		if (this.filters.selectedCategories.includes(this.category)) {
			return 1;
		}
		return 0.8;
	}

	bandWidth (d) {
		if (this.filters.firstAppear) {
			return 0;
		}
		if (!this.filters.visibleCategories.includes(this.category)) {
			return 0;
		}
		return Math.abs(this.scaleX(d.value));
	}
  
	colorClass (opacity) {
		return "text-" + colors[this.category] + "-" + opacity;
	}
  
	color () {
		return this.colorClass("800");
	}
  
	fontClasses (d, classes) {
		return classes + " fill-current text-xs " + this.color();
	}
}

export { Graph };
