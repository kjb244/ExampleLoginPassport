$(document).ready(function(){
	$(document).foundation();



});



var app = angular.module('myApp', []);

app.service('chartHelper', function($http) {


	this.getChart1 = function(){
		return $http.get('/chartdata1').then(function(res){
			return res.data;
		});

	};

	this.getChart2 = function(){
		return $http.get('/chartdata2').then(function(res){
			return res.data;
		});

	};
});


app.controller('mainCtrl', function($scope, $http, chartHelper) {

	google.charts.load('current', {'packages':['corechart']});

  	// Set a callback to run when the Google Visualization API is loaded.
  	google.charts.setOnLoadCallback(chartLoad);


  	function chartLoad(){
  		var dataJson1 = chartHelper.getChart1();
  		var dataJson2 = chartHelper.getChart2();
  		dataJson1.then(function(result){
  			var data = new google.visualization.DataTable();
  			data.addColumn('string', 'Year');
  			data.addColumn('number', 'Avg Income');

  			var options = {
			    title: "Average American Income from 2000 - 2010" ,
			    titleFontSize: 18, 
			    fontName: "'Arial'", 
			    bold: false,
			    hAxis: { title: 'Year', textStyle: { fontSize: 14 }, titleFontSize: 16 },
			    vAxis: { title: 'Income in USD', textStyle: { fontSize: 14 }, titleFontSize: 16, minValue: 0, format: '$#,###' },
			    legend: 'none',
			    animation:{
			    	startup: true,
			        duration: 1000,
			        easing: 'out'
			      }
			}

			Object.keys(result).forEach(function(key, idx){
				data.addRows(1);
				data.setCell(idx,0, key);
				data.setCell(idx,1, result[key]);
			});
			var view = new google.visualization.DataView(data);
			 	

		    var chart = new google.visualization.ColumnChart(document.getElementById("chart-container-1"));
		    chart.draw(view, options);



  		});
  		dataJson2.then(function(result){
  			var data = new google.visualization.DataTable();
  			data.addColumn('string', 'Year');
  			data.addColumn('number', 'Avg Income');

  			var options = {
			    title: "Average American Income from 1990 - 1999" ,
			    titleFontSize: 18, 
			    fontName: "'Arial'", 
			    bold: false,
			    hAxis: { title: 'Year', textStyle: { fontSize: 14 }, titleFontSize: 16 },
			    vAxis: { title: 'Income in USD', textStyle: { fontSize: 14 }, titleFontSize: 16, minValue: 0, format: '$#,###' },
			    legend: 'none',
			    animation:{
			    	startup: true,
			        duration: 1000,
			        easing: 'out'
			      }
			}

			Object.keys(result).forEach(function(key, idx){
				data.addRows(1);
				data.setCell(idx,0, key);
				data.setCell(idx,1, result[key]);
			});
			var view = new google.visualization.DataView(data);
			 	

		    var chart = new google.visualization.ColumnChart(document.getElementById("chart-container-2"));
		    chart.draw(view, options);



  		});
  	}





});
