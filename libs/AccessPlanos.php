<?php

class AccessPlanos {

  const JSON_PATH = PLANOS_JSON_PATH;

  private static $instance = null; 

  private $planos_handler;

  private function __construct() {
    try {
      $this->planos_handler = new AccessEntries(self::JSON_PATH);
    }
    catch (Exception $e) {
      throw $e;
    }
  }

  public function get_planos() {
    return $this->planos_handler->get_entries();
  }

  public function get_plano($codigo) {
    try {
      $this->planos_handler->get_entry($codigo);
    }
    catch (Exception $e) {
      throw $e;
    }
  }

  public function check_plano_exists($codigo) {
    return $this->planos_handler->check_entry_exists($codigo);
  }



  public static function get_instance() {
    if (self::$instance === null) {
      // throws exception
      self::$instance = new self;
    }
    
    return self::$instance;
  }
}