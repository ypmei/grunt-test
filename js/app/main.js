require(['jquery','underscore','Highcharts','charts/config'],function($,_,Highcharts,chartOptions) {
	$.ajax({
		url:'/js/json/ov.json',
		dataType:'json'
	}).done(function(data){
		// console.log(data);
	    var priceOptions = $.extend(true,{},{series:data,chart:{renderTo:'price'}},chartOptions);
	    var secondOptions = $.extend(true,{},{series:data,chart:{renderTo:'second'}},chartOptions);
		// console.log(options);
		var chart = new Highcharts.Chart(priceOptions);
		var chart2 = new Highcharts.Chart(secondOptions);
	})
	
})