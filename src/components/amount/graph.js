
import * as d3 from "d3";
import colors from "../../services/colors";
import VueI18n from "../../i18n";

const TRANSITION_DURATION = 400;
const TRANSITION_EASE = d3.easeQuadInOut;
const BAR_HEIGHT = 4;

class Graph {

	constructor (container, height, width, data, scaleX, category, filters, options = {}) {

		this.container = container;
		this.data = data;
		this.scaleX = scaleX;
		this.category = category;
		this.filters = filters;
    
		this.options = {
			transition: options.transition === undefined ? true : options.transition,
			transitionDuration: options.transitionDuration === undefined ? TRANSITION_DURATION : options.transitionDuration
		};
    
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
  
	transition (g) {
		if (this.options.transition) {
			return g.transition()
				.duration(this.options.transitionDuration)
				.ease(TRANSITION_EASE);
		}
		return g;
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

		this.origin = this.transition(this.svg.select("line.y"))
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
					this.transition(update)
						.attr("transform", d => `translate(0,${this.scaleY(d.name)})`)
						.attr("opacity", d => this.bandOpacity(d));
            
					this.transition(update.select("rect"))
						.attr("y", d => (this.scaleY.bandwidth() - BAR_HEIGHT) / 2)
						.attr("width", d => this.bandWidth(d));
            
					this.transition(update.select("circle.dot"))
						.attr("cy", this.scaleY.bandwidth() / 2)
						.attr("cx", d => this.bandWidth(d));
            
					this.transition(update.select("circle.highlight"))
						.attr("cy", this.scaleY.bandwidth() / 2)
						.attr("cx", d => this.bandWidth(d))
						.style("transform-origin", d => `${this.bandWidth(d)}px ${this.scaleY.bandwidth() / 2}px`)
						.attr("opacity", (this.filters.selectedCategories.includes(this.category) && this.filters.showHighlights) ? 0.6 : 0);
            
					this.transition(update.select("text.label_")
						.attr("class", d => this.fontClasses(d, "label_")))
						.attr("y", d => (this.scaleY.bandwidth() - BAR_HEIGHT) / 2 + 3);
            
					this.transition(update.select("text.value")
						.attr("class", d => this.fontClasses(d, "value")))
						.text(d => d.value.priceFormat())
						.attr("y", d => (this.scaleY.bandwidth()) / 2 + 1)
						.attr("x", d => this.bandWidth(d) + 10);
				},
				exit => exit
					.call(exit => this.transition(exit)
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
