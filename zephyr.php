<?
$searchTerm=isset($_GET['searchTerm'])?$_GET['searchTerm']:"";
$pages=isset($_GET['pages'])?intval($_GET['pages']):5;
$rawUrl="http://clinicaltrial.gov/ct2/results?term=".urlencode($searchTerm)."&Search=Searc&displayxml=true&pg=";
$result=array();
$cons=array();
$mh = curl_multi_init();
for($i=0;$i<$pages;$i++)
{
	$cons[$i]=curl_init($rawUrl.($i+1));
	curl_setopt($cons[$i],CURLOPT_RETURNTRANSFER,1);
	curl_multi_add_handle($mh, $cons[$i]);
}
do { 
$n=curl_multi_exec($mh,$active); 
} while ($active);
for($i=0;$i<$pages;$i++)
{
      $piece=curl_multi_getcontent($cons[$i]);
      curl_close($cons[$i]);
      $xmlinfo = simplexml_load_string($piece);
	  $data= json_decode(json_encode($xmlinfo));
	  if(isset($data->clinical_study))
	  {
	  	foreach($data->clinical_study as $study)
	  	$result[]=$study;
	  }	
}
header('Content-Type: application/json');
echo json_encode($result);