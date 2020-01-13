
import * as d3 from "d3";
import colors from "../../services/colors";
import VueI18n from "../../i18n";

const TRANSITION_DURATION = 200;
const TRANSITION_EASE = d3.easeQuadInOut;
const BAR_HEIGHT = 6;

class Graph {

	constructor (container, height, width, data, scaleX, category) {

		this.container = container;
		this.data = data;
		this.scaleX = scaleX;
		this.category = category;    
    
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
  
	color (opacity) {
		return "text-" + colors[this.category] + "-" + opacity;
	}
  
	draw () {
		this.drawBands();
      
		this.origin = this.svg.append("line")
			.attr("x1", this.scaleX(0))
			.attr("x2", this.scaleX(0))
			.attr("y1", 0)
			.attr("y2", this.height)
			.attr("stroke", "#000")
			.attr("stroke-width", 1);
	}
  
	redraw (data) {
		this.data = data;
		this.scaleY = this.getScaleY();
    
		this.drawBands();

		this.origin = this.svg.append("line").transition()
			.duration(TRANSITION_DURATION)
			.ease(TRANSITION_EASE)
			.attr("y2", this.height);
	}
  
	drawBands () {
		this.bars.selectAll("g").data(this.data)
			.join(
				enter =>  {
					let g = enter.append("g")
						.attr("transform", d => `translate(0,${this.scaleY(d.name)})`);

					g.append("rect")
						.attr("class", d => "fill-current " + this.color("300"))
						.attr("x", 0)
						.attr("height", BAR_HEIGHT)
						.attr("y", d => (this.scaleY.bandwidth() - BAR_HEIGHT) / 2)
						.attr("width", d => this.bandWidth(d));

					g.append("circle")
						.attr("class", d => "fill-current " + this.color("500"))
						.attr("cy", this.scaleY.bandwidth() / 2)
						.attr("cx", d => this.bandWidth(d))
						.attr("r", 6);
            
					g.append("text")
						.attr("class", d => "fill-current text-xs " + this.color("700"))
						.attr("text-anchor", "end")
						.attr("alignment-baseline", "middle")
						.text(d => VueI18n.tc(d.name))
						.attr("y", d => (this.scaleY.bandwidth() - BAR_HEIGHT) / 2 + 3)
						.attr("x", -8)
						.attr("opacity", d => (d.value == 0) ? 0.1 : 1);
				},
				update => {
					update.transition()
						.duration(TRANSITION_DURATION)
						.ease(TRANSITION_EASE)
						.attr("transform", d => `translate(0,${this.scaleY(d.name)})`);
            
					update.select("rect")
						.transition()
						.duration(TRANSITION_DURATION)
						.ease(TRANSITION_EASE)
						.attr("y", d => (this.scaleY.bandwidth() - BAR_HEIGHT) / 2)
						.attr("width", d => this.bandWidth(d));
            
					update.select("circle")
						.transition()
						.duration(TRANSITION_DURATION)
						.ease(TRANSITION_EASE)
						.attr("cy", this.scaleY.bandwidth() / 2)
						.attr("cx", d => this.bandWidth(d));
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
  
	bandWidth (d) {
		return Math.abs(this.scaleX(d.value));
	}
}

export { Graph };
