import $ from 'jquery';
import _ from 'lodash';
import d3 from 'd3';
import 'bower_components/qtip2/jquery.qtip.min';

export default can.Component.extend({
	tag: 'lyme-radial-chart',
	viewModel: {
		width: $(window).width(),
		height: width * 0.70,
		innerRadius: 80,
		barHeight: height / 1.5,
		continents: ['AS', 'NA', 'EU', 'OC', 'AF', 'SA'],
		getColor: function () {
			return d3.scale.ordinal()
				.domain(continents)
				.range(['#FDC02E', '#35974C', '#2884C2', '#3FBBAC', '#51509A', '#B2D043']);
		},
		getSvg: function () {
			var width = this.attr('width'),
				height = this.attr('height');

			return d3.select('#viz2').append('svg')
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
			this.buildChart();
		},

		buildChart: function () {
			var data = rawData.slice(0, Math.round(rawData.length * 0.4));


			var extent = d3.extent(data, function (d) { return d.inmates; });
			var barScale = d3.scale.linear()
				.domain(extent)
				.range([innerRadius, barHeight]);

		  	var numBars = data.length;

		  	var x = d3.scale.linear()
		  		.domain(extent)
		  		.range([-innerRadius, -barHeight]);

		  	var xAxis = d3.svg.axis()
				.scale(x).orient("left")
				.ticks(3);

			var tilt = function (i) {
				return i + 10;
			};

			var arc = d3.svg.arc()
				.startAngle(function(d,i) { return (tilt(i) * 2 * Math.PI) / (numBars * 1.1); })
				.endAngle(function(d,i) { return ((tilt(i) + 0.6) * 2 * Math.PI) / (numBars * 1.1); })
				.innerRadius(innerRadius)
				.outerRadius(function (d) { return barScale(+d.inmates); });

			var segments = svg.selectAll("path")
				.data(data)
				.enter().append("path")
				.style("fill", function (d) { return color(d.continent); })
				.attr('d', arc)
				.attr('class', 'country')
				.each(function (d) {
					$(this).qtip({
						content: {
							text: d.country + ': \n' + d.inmates + ' inmates per every 100,000 citizens'
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
				.attr('transform', 'translate(' + (width * -0.35) + ',' + (height * -0.4) + ')');

			legend.append('text')
				.attr('class', 'header')
				.text('Number of Inmates Per 100,000 Citizens');

			legend.append('text')
				.attr('class', 'subhead')
				.attr('y', 20)
				.text('(Mouseover chart for more details)');

			legend.selectAll('circle').data(continents)
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

			var continentMap = {
				AS: 'Asia', 
				NA: 'North America', 
				EU: 'Europe', 
				OC: 'Pacific', 
				AF: 'Africa', 
				SA: 'South America'
			};

			legend.selectAll('.desc').data(continents)
				.enter().append('text')
				.attr({
					y: function (d, i) {
						return (i + 1) * 30 + 24;
					},
					x: 20,
					class: 'desc',
				})
				.text(function (d) {
					return continentMap[d];
				});
		}
	}
});