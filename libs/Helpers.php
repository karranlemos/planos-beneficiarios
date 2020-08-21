<?php

class Helpers {

  private function __construct() {
    // Static class
  }

  public static function return_http_message($code, $message, $content_type=null) {
    http_response_code($code);
    if (!is_null($content_type))
      header('Content-type: '.$content_type.';');
    echo $message;
    exit;
  }
}