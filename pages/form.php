<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <base href="<?=__BASE__?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="public/css/style.css">
  <title>Bitix Test - crie seu plano!</title>
</head>
<body>
  
  <div class="content">

    <div class="floating-container">
      <div class="floating-content">
        
        <form action="" method="post" class="js-gera-plano gera-plano full-length">
          
          <div class="content-fields">
            <select>
              <!-- <option value="opcao">Opção</option> -->
            </select>
  
            <div class="beneficiarios js-beneficiarios">
              <div class="beneficiario">
                <h2>Beneficiário number</h2>
                <input type="text" name="nome-beneficiario-<number>" placeholder="Nome">
                <input type="number" name="idade-beneficiario-<number>" placeholder="Idade">
              </div>
            </div>
  
            <button type="button" class="secondary add js-add-beneficiario"></button>
          </div>

          <button type="button" class="primary js-submit">Enviar</button>

        </form>

      </div>
    </div>

  </div>

</body>
</html>