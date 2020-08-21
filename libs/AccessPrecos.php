<?php

class AccessPrecos {

  const JSON_PATH = PRECOS_JSON_PATH;

  private static $instance = null; 

  private $precos_handler;

  private function __construct() {
    try {
      $this->precos_handler = new AccessEntries(self::JSON_PATH);
    }
    catch (Exception $e) {
      throw $e;
    }
  }

  public function get_precos($codigo=null) {
    if ($codigo !== null)
      return $this->precos_handler->get_entries(['codigo'=>$codigo]);
    else
      return $this->precos_handler->get_entries();
  }

  public function get_preco($codigo, $minimo_vidas) {
    return $this->precos_handler->get_entry($codigo, [
      "minimo_vidas" => $minimo_vidas
    ]);
  }

  public function get_preco_greatest_minimo_vidas($codigo, $beneficiados) {
    $precos = $this->get_precos($codigo);
    $greatest_minimo_vidas_under_beneficiados = 0;
    $precos_object = false;
    foreach ($precos as $preco) {
      if ($preco->minimo_vidas < $greatest_minimo_vidas_under_beneficiados)
        continue;
      if ($preco->minimo_vidas > $beneficiados)
        continue;
      $greatest_minimo_vidas_under_beneficiados = $preco->minimo_vidas;
      $precos_object = $preco;
    }
    return $precos_object;
  }



  public static function get_instance() {
    if (self::$instance === null) {
      // throws exception
      self::$instance = new self;
    }
    
    return self::$instance;
  }
}