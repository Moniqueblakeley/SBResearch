<?php

$IsLocal = true;

$subdomain =  explode(".",$_SERVER['HTTP_HOST']);
$subdomain = array_shift($subdomain);

// Include our basic dev settings.
if (file_exists('sites/default/global.inc')) {
  require('sites/default/global.inc');
}

if($subdomain == 'avdashboard')
{


	$conf['file_public_path'] = 'sites/' . $subdomain . '.tlt.stonybrook.edu/files';
	$conf['file_temporary_path'] = 'sites/' . $subdomain . '.tlt.stonybrook.edu/tmp-files';
}

else
{

	$conf['file_public_path'] = 'sites/' . $subdomain . '.stonybrook.edu/files';
	$conf['file_temporary_path'] = 'sites/' . $subdomain . '.stonybrook.edu/tmp-files';
}


///////////////////////////////////////////////////////////////////////
//       Please don't edit anything between <@@ADCP_CONF@@> tags     //
// This section is autogenerated by Acquia Dev Desktop Control Panel //
///////////////////////////////////////////////////////////////////////
//<@@ADCP_CONF@@>
$base_url = 'http://' . $subdomain . '.it.local:8080';


//D7 DB config
$databases = array('default' => array('default' => array(
    'driver' => 'mysql',
    'database' => $subdomain . 'local',
    'username' => 'drupaluser',
    'password' => 'drupal',
    'host' => '127.0.0.1',
    'port' => 3306 )));

//password=drupal
//</@@ADCP_CONF@@>