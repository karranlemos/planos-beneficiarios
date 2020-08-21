<?php

class AccessEntries {

private $entries;

public function __construct($json_path) {
  try {
    $entries_array = JSONHelper::parseFileJSON($json_path);
  }
  catch (Exception $e) {
    throw $e;
  }

  $this->entries = [];
  foreach ($entries_array as $entry) {
    $this->entries[$entry->codigo] = $entry;
  }
}

public function get_entries() {
  $entries = [];
  foreach ($this->entries as $entry) {
    $entries[] = clone($entry);
  }
  return $entries;
}

public function get_entry($codigo) {
  if ($this->check_entry_exists($codigo))
    throw new Exception(sprintf("Code '%s' doesn't exist", $codigo));
  
  return clone($this->entries[$codigo]);
}

public function check_entry_exists($codigo) {
  return isset($this->entries[$codigo]);
}
}