
import * as d3 from "d3";
import colors from "../../services/colors";
import { isMobile } from "../../services/responsive";
import tooltip from "../../services/tooltip";

const PADDING_LEFT = 5;
const TICK_PADDING = 8;
const BEZIER_CURVE = 10;
const TRANSITION_DURATION = 400;
const TRANSITION_EASE = d3.easeQuadInOut;

class Graph {

	constructor (container, data, subs, cumuls, domainY, filters, callbacks, options = {}) {

		this.options = {
			brush: options.brush === undefined ? false : options.brush,
			transition: options.transition === undefined ? true : options.transition,
			transitionDuration: options.transitionDuration === undefined ? TRANSITION_DURATION : options.transitionDuration
		};
    
		this.container = container;
		this.data = data;
		this.subData = subs;
		this.cumulData = cumuls;
		this.domainY = domainY;
		this.filters = filters;
		this.callbacks = callbacks;
    
		this.categories = ["revenu", "prestations", "benefices", "prelevements"];
    
		this.scales = {
			x: null,
			y: null
		};
    
		this.axis = {
			x: null,
			y: null
		};
    
		this.containerWidth = this.container.clientWidth;
		this.containerHeight = this.container.clientHeight;
    
		this.mobile = isMobile();
  
		this.margin = {
			top: this.mobile ? 17 : 20,
			bottom: this.mobile ? 16 : 40,
			left: 52,
			right: 10
		};
    
		this.width = this.containerWidth - this.margin.left - this.margin.right;
		this.height = this.containerHeight - this.margin.top - this.margin.bottom;
    
		this.scales.x = d3.scaleBand()
			.domain(this.data.map(d => d.year))
			.range([PADDING_LEFT, this.width])
			.padding(0.2);
      
		this.scales.y = d3.scaleLinear()
			.domain(this.domainY)
			.range([this.height, 0]);

		this.axis.x = d3.axisTop(this.scales.x)
			.tickSize(0)
			.ticks(1)
			.tickPadding(TICK_PADDING);
      
		this.axis.y = d3.axisLeft(this.scales.y)
			.tickSize(-this.width)
			.ticks(5)
			.tickFormat((d) => (+d).priceFormat())
			.tickPadding(TICK_PADDING);
    
		this.brush = d3.brushX()
			.extent([[this.scales.x.bandwidth(),0],[this.width,this.height]])
			.on("brush", this.onBrushed(this));
      
		this.svgContainer = d3.select(this.container).append("svg")
			.attr("width", this.width + this.margin.left + this.margin.right)
			.attr("height", this.height + this.margin.top + this.margin.bottom);
      
		this.svg = this.svgContainer.append("g")
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    
		this.resetLayout();

		this.createDefs();
      
		this.draw();
    
		this.redraw(this.domainY, this.filters);
	}
  
	resetLayout () {
		let containerWidth = this.container.clientWidth;
		let containerHeight = this.container.clientHeight;
		let mobile = isMobile();
    
		if (containerWidth != this.containerWidth || containerHeight != this.containerHeight || mobile != this.mobile) {
			this.containerWidth = containerWidth;
			this.containerHeight = containerHeight;
			this.mobile = mobile;
  
			this.margin = {
				top: this.mobile ? 17 : 20,
				bottom: this.mobile ? 16 : 40,
				left: 52,
				right: 10
			};
    
			this.width = this.containerWidth - this.margin.left - this.margin.right;
			this.height = this.containerHeight - this.margin.top - this.margin.bottom;
        
			this.scales.x.range([PADDING_LEFT, this.width]);
      
			this.scales.y.range([this.height, 0]);
      
			this.axis.y.tickSize(-this.width);
    
			this.brush.extent([[this.scales.x.bandwidth(),0],[this.width,this.height]]);
    
			this.svgContainer
				.attr("width", this.width + this.margin.left + this.margin.right)
				.attr("height", this.height + this.margin.top + this.margin.bottom);
      
			this.svg.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
      
			// The axis X will only change on resize
			this.axisX.call(this.axis.x.scale(this.scales.x));
		}
	}

	transition (g, animated = true) {
		if (this.options.transition && animated) {
			return g.transition()
				.duration(this.options.transitionDuration)
				.ease(TRANSITION_EASE);
		}
		return g;
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

		this.bars = this.svg.append("g")
			.selectAll(".bar")
			.data(this.data)
			.enter()
			.append("g");
      
		["revenu", "prestations", "benefices", "prelevements"].forEach(category => {
			this.bars.append("rect")
				.attr("data-category", category)
				.attr("class", d => "band fill-current " + this.color(category))
				.attr("y", d => this.bandY(category, d))
				.attr("height", d => 0)
				.attr("x", d => this.scales.x(d.year))
				.attr("width", this.scales.x.bandwidth());
		});
    
		this.barSubs = this.svg.append("g")
			.selectAll(".sub-bar")
			.data(this.subData)
			.enter()
			.append("g");
      
		this.barSubs.append("rect")
			.attr("class", d => "band fill-current text-purple-500")
			.attr("y", d => this.bandSubY(d))
			.attr("height", d =>this.bandSubHeight(d))
			.attr("x", d => this.scales.x(d.year))
			.attr("width", this.scales.x.bandwidth());
      
		this.barCumuls = this.svg.append("g")
			.selectAll(".sub-bar")
			.data(this.cumulData)
			.enter()
			.append("g");
      
		this.barCumuls.append("rect")
			.attr("class", d => "band fill-current text-purple-500")
			.attr("y", d => this.bandCumulY(d))
			.attr("height", d =>this.bandCumulHeight(d))
			.attr("x", d => this.scales.x(d.year))
			.attr("width", this.scales.x.bandwidth());
      
		this.abscisse = this.svg.append("line")
			.attr("x1", this.scales.x(0))
			.attr("x2", this.width)
			.attr("y1", this.scales.y(0))
			.attr("y2", this.scales.y(0))
			.attr("stroke", "#666")
			.attr("stroke-width", 2);
      
		this.selectLineTop = this.svg.append("line")
			.attr("class", "invisible lg:visible")
			.attr("x1", this.scales.x(this.filters.selected[0]))
			.attr("x2", this.width)
			.attr("y1", 0)
			.attr("y2", 0)
			.attr("stroke", "#000")
			.attr("stroke-width", 2);
      
		this.selectLineBottom = this.svg.append("line")
			.attr("class", "invisible lg:visible")
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
      
		this.bezierRight = this.svg.append("path")
			.attr("class", "hidden lg:block")
			.attr("stroke", "#a1a1a1")
			.attr("stroke-dasharray", 4)
			.attr("fill", "transparent")
			.attr("d", this.bezierRightCurve());
      
		// Tooltip
      
		this.tooltip = this.svg.append("g")
			.attr("class", "graph-tooltip")
			.attr("transform", "translate(0,10)")
			.attr("opacity", 0);
      
		this.tooltip.append("path")
			.style("filter", "url(#drop-shadow)")
			.attr("fill", "white")
			.attr("d", this.tooltipPath(50, 20));
    
		this.tooltip.append("path")
			.attr("fill", "white")
			.attr("d", this.tooltipPath(50, 20));
      
		this.tooltip.append("text")
			.text("test!!")
			.attr("y", 4)
			.attr("x", 12)
			.attr("class", "text-sm font-semibold");
      
		if (this.options.brush) {
			this.brushG = this.svg.append("g")
				.attr("transform", "translate(0,0)")
				.attr("class", "brush")
				.call(this.brush)
				.on("dblclick", this.onBrushedDoubleClick(this))
				.on("mousemove", this.handleMouseOver(this))
				.on("mouseout", this.handleMouseOut(this));
		}
	}
  
	redraw (domainY, filters) {

		this.resetLayout();

		this.domainY = domainY;
		this.filters = filters;
    
		this.scales.y.domain(this.domainY);
            
		this.transition(this.axisY)
			.call(this.axis.y.scale(this.scales.y));
    
		if (this.options.brush) {
			this.brush.move(this.brushG, 
				[this.scales.x(this.filters.selected[0]), this.scales.x(this.filters.selected[1]) + this.scales.x.bandwidth()]
			); 
		}
      
		this.transition(this.abscisse)
		  .attr("x1", this.scales.x(0))
			.attr("x2", this.width)
			.attr("y1", this.scales.y(0))
			.attr("y2", this.scales.y(0));
    
		this.updateSelected();
      
		this.updateTooltip();
	}
  
	updateSelected (animated = true) {

		if (!this.filters.showSubstraction && !this.filters.showCumul) {
			this.transition(this.bars.selectAll("rect"), animated)
				.attr("x", d => this.scales.x(d.year))
				.attr("width", this.scales.x.bandwidth())
				.attr("height", (d, i, node) => this.bandHeight(node[i].getAttribute("data-category"), d))
				.attr("y", (d, i, node) => this.bandY(node[i].getAttribute("data-category"), d))
				.attr("opacity", (d, i, node) => {
					return this.bandOpacity(d, node[i].getAttribute("data-category"));
				});
		} else {
			this.bars.selectAll("rect").attr("opacity", 0);
		}
      
		if (this.filters.showSubstraction) {
			this.transition(this.barSubs.selectAll("rect"), animated)
				.attr("x", d => this.scales.x(d.year))
				.attr("width", this.scales.x.bandwidth())
				.attr("height", d =>this.bandSubHeight(d))
				.attr("y", d => this.bandSubY(d))
				.attr("opacity", (d, i, node) => {
					return this.bandSubOpacity(d);
				});
		} else {
			this.barSubs.selectAll("rect").attr("height", 0);
		}
    
		if (this.filters.showCumul) {
			this.transition(this.barCumuls.selectAll("rect"), animated)
				.attr("height", d =>this.bandCumulHeight(d))
				.attr("y", d => this.bandCumulY(d))
				.attr("x", d => this.scales.x(d.year))
				.attr("width", this.scales.x.bandwidth())
				.attr("opacity", (d, i, node) => {
					return this.bandSubOpacity(d);
				});
		} else {
			this.barCumuls.selectAll("rect")
				.attr("height", 0);
		}
      
		this.transition(this.selectLineTop, animated)
			.attr("x1", this.scales.x(this.filters.selected[0]))
			.attr("x2", this.scales.x(this.filters.selected[1]) + this.scales.x.bandwidth())
			.attr("opacity", (this.filters.showSelection) ? 1 : 0);
      
		this.transition(this.selectLineBottom, animated)
			.attr("x1", this.scales.x(this.filters.selected[0]))
			.attr("x2", this.scales.x(this.filters.selected[1]) + this.scales.x.bandwidth())
			.attr("y1", this.scales.y(0))
			.attr("y2", this.scales.y(0))
			.attr("opacity", (this.filters.showSelection) ? 1 : 0);
      
		this.transition(this.bezierLeft, animated)
			.attr("d", this.bezierLeftCurve())
			.attr("opacity", (this.filters.showSelection) ? 1 : 0);
      
		this.transition(this.bezierRight, animated)
			.attr("d", this.bezierRightCurve())
			.attr("opacity", (this.filters.showSelection) ? 1 : 0);
	}
  
	bandOpacity (d, category) {
		if (!this.filters.visibleCategories.includes(category)) {
			return 0;
		} 
		if (d.year < this.filters.selected[0] || d.year > this.filters.selected[1]) {
			return 0.2;
		}
		if (!this.filters.selectedCategories.includes(category)) {
			return 0.2;
		} 
		return 1;
	}
  
	bandY (category, d) {
		if (d.year < this.filters.visible[0] || d.year > this.filters.visible[1] || this.filters.firstAppear || this.filters.showSubstraction || this.filters.showCumul) {
			return this.scales.y(0);
		}
		let y = Math.min(this.scales.y(0), this.scales.y(d.categories[category].total));
		if ((category == "prestations" || category == "benefices") && this.filters.visibleCategories.includes("revenu")) {
			y -= (this.scales.y(0) - this.scales.y(d.categories.revenu.total));
		}
		if (category == "benefices" && this.filters.visibleCategories.includes("prestations") ) {
			y -= (this.scales.y(0) - this.scales.y(d.categories.prestations.total));
		}
		return y;
	}
  
	bandHeight (category, d) {
		if (d.year < this.filters.visible[0] || d.year > this.filters.visible[1] || this.filters.firstAppear || this.filters.showSubstraction || this.filters.showCumul) {
			return 0;
		}
		return Math.abs(this.scales.y(d.categories[category].total) - this.scales.y(0));
	}
  
	bandSubOpacity (d) {
		if (d.year < this.filters.selected[0] || d.year > this.filters.selected[1]) {
			return 0.2;
		}
		return 1;
	}
  
	bandSubY (d) {
		if (this.filters.showSubstraction) {
			return Math.min(this.scales.y(0), this.scales.y(d.value));
		}
		return this.scales.y(0);
	}

	bandSubHeight (d) {
		if (this.filters.showSubstraction) {
			return Math.abs(this.scales.y(d.value) - this.scales.y(0));
		}
		return 0;
	}
  
	bandCumulY (d) {
		if (this.filters.showCumul) {
			return Math.min(this.scales.y(0), this.scales.y(d.value));
		}
		return this.scales.y(0);
	}

	bandCumulHeight (d) {
		if (this.filters.showCumul) {
			return Math.abs(this.scales.y(d.value) - this.scales.y(0));
		}
		return 0;
	}

	bezierBottom () {
		return this.height + this.margin.bottom;
	}
  
	bezierLeftCurve () {
		if (!this.filters.showAmounts) {
			return `M ${this.scales.x(this.filters.selected[0])} 0 L ${this.scales.x(this.filters.selected[0])} ${this.bezierBottom()}`;
		}
		return `M ${this.scales.x(this.filters.selected[0])} 0 L ${this.scales.x(this.filters.selected[0])} ${this.bezierBottom() - BEZIER_CURVE} q 0 ${BEZIER_CURVE} -${BEZIER_CURVE} ${BEZIER_CURVE} L 0 ${this.bezierBottom()}`;
	}

	bezierRightCurve () {
		if (!this.filters.showAmounts) {
			return `M ${this.scales.x(this.filters.selected[1]) + this.scales.x.bandwidth()} 0 L ${this.scales.x(this.filters.selected[1]) + this.scales.x.bandwidth()} ${this.bezierBottom()}`;
		}
		return `M ${this.scales.x(this.filters.selected[1]) + this.scales.x.bandwidth()} 0 L ${this.scales.x(this.filters.selected[1]) + this.scales.x.bandwidth()} ${this.bezierBottom() - BEZIER_CURVE} q 0 ${BEZIER_CURVE} ${BEZIER_CURVE} ${BEZIER_CURVE} L ${this.width} ${this.bezierBottom()}`;
	}
  
	createDefs () {
		// filters go in defs element
		this.defs = this.svg.append("defs");

		// create filter with id #drop-shadow
		// height=130% so that the shadow is not clipped
		this.filter = this.defs.append("filter")
			.attr("id", "drop-shadow")
			.attr("height", "130%");

		// SourceAlpha refers to opacity of graphic that this filter will be applied to
		// convolve that with a Gaussian with standard deviation 3 and store result
		// in blur
		this.filter.append("feGaussianBlur")
			.attr("in", "SourceAlpha")
			.attr("stdDeviation", 2);

		// translate output of Gaussian blur to the right and downwards with 2px
		// store result in offsetBlur
		this.filter.append("feOffset")
			.attr("dx", 1)
			.attr("dy", 1)
			.attr("result", "offsetBlur");
    
		// Control opacity of shadow filter
		this.feTransfer = this.filter.append("feComponentTransfer");
    
		this.feTransfer.append("feFuncA")
			.attr("type", "linear")
			.attr("slope", 0.4);
    
		// overlay original SourceGraphic over translated blurred opacity by using
		// feMerge filter. Order of specifying inputs is important!
		this.feMerge = this.filter.append("feMerge");

		this.feMerge.append("feMergeNode")
			.append("feMergeNode")
			.attr("in", "SourceGraphic");
      
	}
  
	updateTooltip () {
		if (this.filters.tooltip == null) {
			this.transition(this.tooltip)
				.attr("opacity", 0);
		} else {

			let year = this.filters.tooltip[0];
			let category = this.filters.tooltip[1];
			let direction = this.filters.tooltip.length > 2 ? this.filters.tooltip[2] : null;
			let d = this.data.find(d => d.year == year);
			let amount = d.categories[category].total;

			let x = this.scales.x(year);
			let y = this.tooltipY(category, d);
        
			let textElement = this.tooltip.select("text");
			textElement.text(amount.priceFormat());
			let bbox = textElement.node().getBBox();
			let width = bbox.width;
			let height = bbox.height;
      
			if (direction == null) {

				direction = "right";
        
				if (x + width + 20 > this.width) {
					direction = "left";
				}
			}

			if (direction == "right") {
				x += (2 + this.scales.x.bandwidth());
			} else {
				x -= 2;
			}
      
			this.transition(this.tooltip)
				.attr("opacity", 1)
				.attr("transform", `translate(${x},${y})`);
        
			this.transition(textElement)
				.attr("x", (direction == "right") ? 12 : -width -12);
      
			this.transition(this.tooltip.selectAll("path"))
				.attr("d", this.tooltipPath(width + 15, height + 4, direction));
		}
	}
  
	tooltipPath (width, height, direction = "right") {
		return tooltip.tooltipPath(width, height, 5, 3, direction);
	}
  
	tooltipY (category, d) {
		if (d.year < this.filters.visible[0] || d.year > this.filters.visible[1] || this.filters.firstAppear || this.filters.showSubstraction || this.filters.showCumul) {
			return this.scales.y(0);
		}
		let y = this.scales.y(d.categories[category].total);
		if (category == "prestations" || category == "benefices") {
			y -= (this.scales.y(0) - this.scales.y(d.categories.revenu.total));
		}
		if (category == "benefices") {
			y -= (this.scales.y(0) - this.scales.y(d.categories.prestations.total));
		}
		return y;
	}
  
	handleMouseOver (ctx) {
		return function () {
			let svgPoint = d3.mouse(this);
			let windowPointX = d3.event.clientX;
			let windowPointY = d3.event.clientY;
      
			let year = ctx.scaleBandInvert(ctx.scales.x)(svgPoint[0]);
			ctx.callbacks.mousemove({
				year: year,
				x: windowPointX,
				y: windowPointY
			});
		};
	}
  
	handleMouseOut (ctx) {
		return function () {
			ctx.callbacks.mousemove(null);
		};
	}

	scaleBandInvert (scale) {
		var domain = scale.domain();
		var paddingOuter = scale(domain[0]);
		var eachBand = scale.step();
		return function (value) {
			var index = Math.floor(((value - paddingOuter) / eachBand));
			return domain[Math.max(0,Math.min(index, domain.length-1))];
		};
	}
  
	onBrushed (ctx) {
		return function () {
			if (!d3.event.sourceEvent) return; // Ignore "move"
			if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
			let s = d3.event.selection || this.scales.x.range();
			let invertX = ctx.scaleBandInvert(ctx.scales.x);
			ctx.filters.selected = [invertX(s[0]), invertX(s[1])];
			ctx.callbacks.brushed(ctx.filters.selected);
			ctx.updateSelected(false);
		};
	}
  
	onBrushedDoubleClick (ctx) {
		return function () {
			if (ctx.options.brush) {
				ctx.brush.move(ctx.brushG, 
					ctx.scales.x.range()
				); 
			}
		};
	}
}

export { Graph };
