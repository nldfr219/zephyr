<!DOCTYPE html>
<html>
<head>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="http://code.highcharts.com/highcharts.js"></script>
<script src="http://code.highcharts.com/modules/exporting.js"></script>
<script src="zephyr.js"></script>
<link rel='stylesheet' type='text/css' href='zephyr.css'>
</head>
	<body>
		<div align=center><input type="txt" id="searchTerm"> <input type=button value="search" onclick="fetch()"><br>
pages			
<select id='selector'>	
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
  <option value="5"	selected="selected">5</option>
</select> (1 page=20 results)</div>	
		<div id="container1" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
		<div id="container2" style="min-width: 310px; height: 400px; margin: 0 auto"></div>
		<div id="container3"></div>
	</body>
</html>