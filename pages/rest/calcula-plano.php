<?php

$data = file_get_contents('php://input');
$json = json_decode($data);

if ($json === null) {
  Helpers::return_http_message(400, "Invalid JSON syntax");
}

if (!isset($json->codigoPlano) || !isset($json->beneficiarios)) {
  Helpers::return_http_message(422, "Must provide 'codigoPlano' and 'beneficiarios'");
}

if (!is_array($json->beneficiarios)) {
  Helpers::return_http_message(422, "'beneficiarios' must be an array");
}

foreach ($json->beneficiarios as $beneficiario) {
  if (!isset($beneficiario->nome) || !isset($beneficiario->idade)) {
    Helpers::return_http_message(
      422,
      "All objects in 'beneficiarios' must be in the format {\"nome\": ..., \"idade\": ...}"
    );
  }
  try {
    $beneficiario->idade = (int) $beneficiario->idade;
  }
  catch (Exception $e) {
    Helpers::return_http_message(422, "Idade must be an integer");
  }
  if ($beneficiario->idade < 0) {
    Helpers::return_http_message(422, "Idade must be greater than 0");
  }
}



$planos = AccessPlanos::get_instance();
$precos = AccessPrecos::get_instance();
$number_beneficiarios = count($json->beneficiarios);

if (!$planos->check_plano_exists($json->codigoPlano)) {
  Helpers::return_http_message(422, "Plano doesn't exist");
}

$precos_idades = $precos->get_preco_greatest_minimo_vidas($json->codigoPlano, $number_beneficiarios);
$preco_total = 0.00;
$beneficiados_precos = [];
foreach ($json->beneficiarios as $beneficiario) {
  if ($beneficiario->idade >= 0 && $beneficiario->idade <= 17)
    $preco = $precos_idades->faixa1;
  else if ($beneficiario->idade >= 18 && $beneficiario->idade <= 40)
    $preco = $precos_idades->faixa2;
  else if ($beneficiario->idade > 40)
    $preco = $precos_idades->faixa3;

  $preco_total += $preco;
  $beneficiados_precos[] = [
    'nome' => $beneficiario->nome,
    'idade' => $beneficiario->idade,
    'preco' => $preco
  ];
}

$form_data_array = [
  'numeroBeneficiarios' => $number_beneficiarios,
  'codigoPlano' => $json->codigoPlano,
  'beneficiarios' => $json->beneficiarios,
];
$proposta_array = [
  'precoTotal' => $preco_total,
  'precosBeneficiarios' => $beneficiados_precos
];

JSONHelper::createFileJSON($form_data_array, __ROOT__.'/data-output/beneficiarios.json');
JSONHelper::createFileJSON($proposta_array, __ROOT__.'/data-output/proposta.json');

Helpers::return_http_message(200, json_encode($proposta_array, JSON_UNESCAPED_UNICODE ), 'aplication/json');