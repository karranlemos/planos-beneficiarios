<?php

class AccessEntries {

  private $entries;
  private $codigos;

  public function __construct($json_path) {
    try {
      $this->entries = JSONHelper::parseFileJSON($json_path, true, 512);
    }
    catch (Exception $e) {
      throw $e;
    }

    $this->codigos = [];
    foreach ($this->entries as $entry) {
      if (isset($entry->codigo))
        $this->codigos[$entry->codigo] = true;
    }
  }

  public function get_entries($args=[]) {
    if ($args !== null && !is_array($args))
      throw new InvalidArgumentException('provided args must be an array.');

    $entries = [];
    foreach ($this->entries as $entry) {

      $arg_not_found = false;
      foreach ($args as $key => $value) {
        if (!isset($entry->$key))
          continue;
        if ($entry->$key === $value)
          continue;
        
        $arg_not_found = true;
        break;
      }
      
      if ($arg_not_found)
        continue;
    
      $entries[] = clone($entry);
    }
    return $entries;
  }

  public function get_entry($codigo, $args=[]) {
    if ($args !== null && !is_array($args))
      throw new InvalidArgumentException('provided args must be an array.');

    foreach ($this->entries as $entry) {
      if ($entry->codigo !== $codigo)
        continue;
      
      $arg_not_found = false;
      foreach ($args as $key => $value) {
        if (!isset($entry->$key))
          continue;
        if ($entry->$key === $value)
          continue;
        
        $arg_not_found = true;
        break;
      }

      if ($arg_not_found)
        continue;
      
      return clone($entry);
    }

    return false;
  }



  public function check_entry_exists($codigo) {
    return isset($this->codigos[$codigo]);
  }
}