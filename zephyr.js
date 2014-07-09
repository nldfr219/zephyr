var rawData;
var result;
var currentStatus;
var currentCondition;
var next={'':'+','+':'-','-':''};
var map={'':'','+':'&#916;','-':'&#8711;'};
$(function(){
	$( "#container3" ).delegate( "th.sortable", "click", function(){
		var index=$(this).find('span').attr('value');
		//console.debug(index);		
		showTable(currentStatus,currentCondition,this.id,next[index]);
});
	//fetch();
});
function fetch()
{
	$('#container1').hide();
	$('#container2').hide();
	$('#container3').hide();
	//var searchTerm="stroke and brain";
	var searchTerm=$('#searchTerm').val();
	if(searchTerm=="")
	{
		alert("Search term can't be empty");
		return;
	}
	var pages=$("#selector").val();	
	$.ajax({
		url:"zephyr.php",
		data:{
			searchTerm:searchTerm,
			pages:pages
		},
		success:function(data){
			rawData=data;
			result={};
			//console.debug(data);
			for(var i=0;i<data.length;i++)
			{
				var status=data[i].status;
				if(result[status]==null)
					result[status]={'count':0};
				result[status]['count']++;
				var temp=data[i].condition_summary.split(";");
				for(var j=0;j<temp.length;j++)
				{
					var condition=temp[j].trim();
					if(result[status][condition]==null)
						result[status][condition]={'count':0,"ids":[]};
					result[status][condition]['count']++;
					result[status][condition]['ids'].push(i);
				}
					
			}
			//console.debug(data);
			//console.debug(result);
			showChart("status");
		}
	});
}
function showChart(type,status)
{
	var categories=[],data=[],container;
	if(type=='status')
	{
		container='#container1';
		for(var key in result)
		{
			categories.push(key);
			data.push(result[key]['count']);
		}
	}
	else if(type=='condition')
	{
		currentStatus=status;
		container='#container2';
		for(var key in result[status])
		{
			if(key!="count")
			{
				categories.push(key);
				data.push(result[status][key]['count']);
			}
		}
	}
	display(container,categories,data);	
}
function display(container,categories,data) 
{
		if(container=='#container2')
			$('#container3').hide();
        $(container).highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Status Chart'
            },
            subtitle: {
                text: 'Source: clinicaltrial.gov'
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: '# of Studies'
                }
            },
            tooltip: {
                /*
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
                */
            },
            plotOptions: {
            	series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function() {
                        	 if(container=='#container1')
                             	showChart("condition",this.category);
                             else if(container=='#container2')
                             {
                             	currentCondition=this.category;
                             	showTable(currentStatus,this.category,'','');
                             }	
                        }
                    }
                }
            },
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Status',
                data: data
            }]
        });
        $(container).show();
}
function showTable(status,condition,sortWord, sortWay)
{
	//alert(status+condition);
	//console.debug(sortWay);
	var studies=[];
	var sortInfo={'title':'','score':'','last_changed':''};
	for(var i=0;i<result[status][condition]['ids'].length;i++)
		studies[i]=rawData[result[status][condition]['ids'][i]];
	if(sortWay!='')
	{	
		//console.debug(sortWay);
		studies.sort(dynamicSort(sortWay+sortWord));
		//console.debug(sortWay+sortWord);
		//console.debug(studies);
		sortInfo[sortWord]=sortWay;		
	}			
	var content='<table><tbody><tr><th class="sortable" id="title">Title <span value="'+sortInfo['title']+'">'+map[sortInfo['title']]+'</span></th><th>URL</th><th>Conditions</th><th>Status</th><th class="sortable" id="score">Score <span value="'+sortInfo['score']+'">'+map[sortInfo['score']]+'</span></th><th class="sortable" id="last_changed">Last Changed <span value="'+sortInfo['last_changed']+'">'+map[sortInfo['last_changed']]+'</span></th></tr>';
	for(var i=0;i<studies.length;i++)
		content+='<tr><td class="title'+(i==0?' first':'')+'">'+studies[i]['title']+'</td><td>'+studies[i]['url']+'</td><td>'+studies[i]['condition_summary']+'</td><td>'+studies[i]['status']+'</td><td>'+studies[i]['score']+'</td><td>'+studies[i]['last_changed']+'</td></tr>';	
	content+='</tbody></table>';
	//console.debug(content);
	$('#container3').html(content).show();
}
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
    }
    property = property.substr(1);
    return function (a,b) {
    	var ap=a[property],bp=b[property];
    	if(property=='last_changed')
    	{
	    	ap=Date.parse(ap);
	    	bp=Date.parse(bp);
    	}
        var result = (ap < bp) ? -1 : (ap > bp) ? 1 : 0;
        return result * sortOrder;
    }
}


    
