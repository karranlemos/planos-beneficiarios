<?php

class JSONHelper {

  private function __construct($path) {
    // Static class
  }

  public static function parseFileJSON($path) {
    $file_string = file_get_contents($path);
    if (!$file_string)
      throw new Exception("JSON at path '".$path."' couldn't be open");
    
    $json_array = json_decode($file_string);
    if (!$json_array)
      throw new Exception("Couldn't decode JSON");
    
    return $json_array;
  }

  public static function createFileJSON($array, $path) {
    $json_string = json_encode($array);
    if ($json_string === false)
      throw new Exception("Couldn't encode JSON");

    $success = file_put_contents($path, $json_string);
    if ($success === false)
      throw new Exception("Couldn't create JSON file at path '".$path."'");
  }
}