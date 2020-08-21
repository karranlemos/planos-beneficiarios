<?php

define('__ROOT__', dirname(__DIR__));
define('__BASE__', '/');



const LIBS_OBJECTS = [
  'JSONHelper'
];

foreach (LIBS_OBJECTS as $lib_object)
  require_once __ROOT__.'/libs/'.$lib_object.'.php';



require_once __ROOT__.'/pages/form.php';