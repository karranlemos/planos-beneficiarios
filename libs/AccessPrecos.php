<?php

class AccessPrecos {

  const JSON_PATH = PRECOS_JSON_PATH;

  private $precos_handler;

  public function __construct() {
    try {
      $this->precos_handler = new AccessEntries(self::JSON_PATH);
    }
    catch (Exception $e) {
      throw $e;
    }
  }

  public function get_precos() {
    return $this->precos_handler->get_entries();
  }

  public function get_preco($codigo) {
    try {
      $this->precos_handler->get_entry($codigo);
    }
    catch (Exception $e) {
      throw $e;
    }
  }

  public function check_preco_exists($codigo) {
    return $this->precos_handler->check_entry_exists($codigo);
  }
}