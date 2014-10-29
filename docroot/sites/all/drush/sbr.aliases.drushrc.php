<?php

if (!isset($drush_major_version)) {
  $drush_version_components = explode('.', DRUSH_VERSION);
  $drush_major_version = $drush_version_components[0];
}
// Site sbresearch, environment dev
$aliases['dev'] = array(
  'root' => '/var/www/html/sbresearch.dev/docroot',
  'ac-site' => 'sbresearch',
  'ac-env' => 'dev',
  'ac-realm' => 'devcloud',
  'uri' => 'sbresearchdev.devcloud.acquia-sites.com',
  'remote-host' => 'srv-1428.devcloud.hosting.acquia.com',
  'remote-user' => 'sbresearch.dev',
  'path-aliases' => array(
    '%drush-script' => 'drush' . $drush_major_version,
  )
);

if (!isset($drush_major_version)) {
  $drush_version_components = explode('.', DRUSH_VERSION);
  $drush_major_version = $drush_version_components[0];
}
// Site sbresearch, environment prod
$aliases['prod'] = array(
  'root' => '/var/www/html/sbresearch.prod/docroot',
  'ac-site' => 'sbresearch',
  'ac-env' => 'prod',
  'ac-realm' => 'devcloud',
  'uri' => 'sbresearch.devcloud.acquia-sites.com',
  'remote-host' => 'srv-1428.devcloud.hosting.acquia.com',
  'remote-user' => 'sbresearch.prod',
  'path-aliases' => array(
    '%drush-script' => 'drush' . $drush_major_version,
  )
);

if (!isset($drush_major_version)) {
  $drush_version_components = explode('.', DRUSH_VERSION);
  $drush_major_version = $drush_version_components[0];
}
// Site sbresearch, environment test
$aliases['test'] = array(
  'root' => '/var/www/html/sbresearch.test/docroot',
  'ac-site' => 'sbresearch',
  'ac-env' => 'test',
  'ac-realm' => 'devcloud',
  'uri' => 'sbresearchtest.devcloud.acquia-sites.com',
  'remote-host' => 'srv-1428.devcloud.hosting.acquia.com',
  'remote-user' => 'sbresearch.test',
  'path-aliases' => array(
    '%drush-script' => 'drush' . $drush_major_version,
  )
);

if($devHost == "sbro-368")
  $localFolder = 'C:/Users/rprajapati/Desktop/SVN/';

//else if($devHost == "peters-macbook-air.local" || $devHost == "peters-macbook-air")
//  $localFolder = '/Users/peterjasko/DoIT_Merge/';

//else if($devHost == "rover.local" || $devHost == "rover")
//  $localFolder = '/Users/rich/git/';

//else
//  $localFolder = 'c:/sites/';

$aliases['local'] = array(
  'root' => 'C:/Users/rprajapati/Desktop/SVN/sbresearch/docroot',
  'path-aliases' => array(
    '%dump-dir' => 'C:/Users/rprajapati/Desktop/SVN/sbresearch-dump'
  ),
);


//RESEARCH SETTINGS
$aliases['research.dev'] = array(
  'parent' => '@dev',
  'uri' => 'research-d.stonybrook.edu',
);

$aliases['research.stage'] = array(
  'parent' => '@stage',
  'uri' => 'research-s.stonybrook.edu',
);

$aliases['research.prod'] = array(
  'parent' => '@prod',
  'uri' => 'research.stonybrook.edu',
);

$aliases['research.local'] = array(
  'parent' => '@local',
  'uri' => 'research.localhost:8082',
);

//FACULTY SETTINGS
$aliases['faculty.dev'] = array(
  'parent' => '@dev',
  'uri' => 'faculty.dev.sinc.stonybrook.edu',
);

$aliases['faculty.stage'] = array(
  'parent' => '@stage',
  'uri' => 'faculty.stage.sinc.stonybrook.edu',
);

$aliases['faculty.prod'] = array(
  'parent' => '@prod',
  'uri' => 'faculty.prod.sinc.stonybrook.edu',
);

$aliases['faculty.local'] = array(
  'parent' => '@local',
  'uri' => 'faculty2local.localhost:8082',
);


