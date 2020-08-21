<?php

define('__ROOT__', dirname(__DIR__));
define('__BASE__', '/');

define('PLANOS_JSON_PATH', __ROOT__.'/data/planos.json');
define('PRECOS_JSON_PATH', __ROOT__.'/data/precos.json');



const LIBS_OBJECTS = [
  'JSONHelper', 'AccessEntries', 'AccessPlanos', 'AccessPrecos',
];

foreach (LIBS_OBJECTS as $lib_object)
  require_once __ROOT__.'/libs/'.$lib_object.'.php';



require_once __ROOT__.'/pages/form.php';