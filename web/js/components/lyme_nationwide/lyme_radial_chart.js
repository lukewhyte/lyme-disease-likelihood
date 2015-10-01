import can from 'can';
import 'can/map/define/define';
import $ from 'jquery';
import _ from 'lodash';
import d3 from 'd3';
import 'bower_components/qtip2/jquery.qtip.min';

export default can.Component.extend({
	tag: 'lyme-radial-chart',
	viewModel: {
		define: {
			counties: {
				type: '*',
				value: null
			},
			width: {
				get: function () {
					return $(window).width();
				},
				type: 'number'
			},
			height: { 
				value: 0, 
				type: 'number',
				set: function (val) {
					if (val) {
						this.attr('barHeight', val / 1.5);
					}
					return val * 1.1;
				}
			},
			barHeight: { value: 0, type: 'number' },
			innerRadius: { type: 'number', value: 80 }
		},
		states: ['Massachusetts', 'Pennsylvania', 'Connecticut', 'New Jersey', 'Maine', 'New York', 'Rhode Island', 'Delaware', 'Virginia'],
		getColor: function () {
			return d3.scale.ordinal()
				.domain(this.attr('states'))
				.range(['#001f3f', '#0074D9', '#7FDBFF', '#7FDBFF', '#3D9970', '#2ECC40', '#01FF70', '#FFDC00', '#FF851B']);
		},
		getSvg: function (el) {
			var width = this.attr('width'),
				height = this.attr('height');

			return d3.select(el).append('svg')
				.attr({
					width: width,
					height: height
				})
				.append('g')
					.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
		}
	},

	events: {
		inserted: function () {
			if (this.viewModel.attr('counties')) {
				this.buildChart();
			}
		},

		'{viewModel} counties': 'buildChart',

		buildChart: function () {
			var data = this.viewModel.attr('counties'),
				svg = this.viewModel.getSvg(this.element.get(0)),
				color = this.viewModel.getColor();

			var extent = d3.extent(data, function (d) { return d.Cases2014; });
			var barScale = d3.scale.linear()
				.domain(extent)
				.range([this.viewModel.attr('innerRadius'), this.viewModel.attr('barHeight')]);

		  	var numBars = data.length;

		  	var x = d3.scale.linear()
		  		.domain(extent)
		  		.range([-this.viewModel.attr('innerRadius'), -this.viewModel.attr('barHeight')]);

		  	var xAxis = d3.svg.axis()
				.scale(x).orient("left")
				.ticks(3);

			var tilt = function (i) {
				return i + 4;
			};

			var arc = d3.svg.arc()
				.startAngle(function(d,i) { return (tilt(i) * 2 * Math.PI) / (numBars * 1.1); })
				.endAngle(function(d,i) { return ((tilt(i) + 0.6) * 2 * Math.PI) / (numBars * 1.1); })
				.innerRadius(this.viewModel.attr('innerRadius'))
				.outerRadius(function (d) { return barScale(+d.Cases2014); });

			var segments = svg.selectAll("path")
				.data(data)
				.enter().append("path")
				.style("fill", function (d) { return color(d.STNAME); })
				.attr('d', arc)
				.attr('class', 'country')
				.each(function (d) {
					$(this).qtip({
						content: {
							text: d.CTYNAME + ', ' + d.STNAME + ': \n' + d.Cases2014 + ' cases of Lyme Disease in 2014'
						},
						style: { classes: 'qtip-tipsy' },
						position: {
							target: 'mouse',
							my: 'right bottom',
							at: 'top left'
						}
					});
				});

			var circles = svg.selectAll('circle')
				.data(x.ticks(3))
				.enter().append('circle')
					.attr('r', function (d) { return barScale(d); })
					.style({
						fill: 'none',
						stroke: '#eee',
						'stroke-width': '2px'
					});

			svg.append("g")
			    .attr("class", "x axis")
			    .call(xAxis);

			var legend = svg.append('g')
				.attr('class', 'legend')
				.attr('transform', 'translate(' + (this.viewModel.attr('width') * -0.35) + ',' + (this.viewModel.attr('height') * -0.4) + ')');

			legend.append('text')
				.attr('class', 'header')
				.text('Counties Where You\'re Most Likely To Get Lyme Disease');

			legend.append('text')
				.attr('class', 'subhead')
				.attr('y', 20)
				.text('(Mouseover chart for more details)');

			legend.selectAll('circle').data(this.viewModel.attr('states'))
				.enter().append('circle')
				.attr({
					cy: function (d, i) {
						return (i + 1) * 30 + 20;
					},
					r: 6,
					cx: 6,
					class: 'legendMarker',
				})
				.style({
					fill: function (d) { return color(d); },
				});

			legend.selectAll('.desc').data(this.viewModel.attr('states'))
				.enter().append('text')
				.attr({
					y: function (d, i) {
						return (i + 1) * 30 + 24;
					},
					x: 20,
					class: 'desc',
				})
				.text(function (d) {
					return d;
				});
		}
	}
});