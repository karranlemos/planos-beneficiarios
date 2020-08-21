<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <base href="<?=__BASE__?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="public/css/style.css">
  <script src="public/js/script.js"></script>
  <title>Bitix Test - crie seu plano!</title>
</head>
<body>
  
  <div class="content">

    <div class="body-container">
      <div class="content">

      <header><h1>Bitix Test - crie seu plano!</h1></header>
        
        <div class="form-container">
          <form action="" method="post" class="js-gera-plano gera-plano full-length">
            
            <div class="content-fields">
              <select name="plano-codigo">
                <?php foreach (AccessPlanos::get_instance()->get_planos() as $plano):?>
                    <option value="<?=$plano->codigo?>"><?=$plano->nome?></option>
                <?php endforeach; ?>
              </select>
    
              <div class="beneficiarios js-beneficiarios">
                <div class="beneficiarios-grupos js-beneficiarios-grupos"></div>
                <button type="button" class="secondary add js-add-beneficiario"></button>
              </div>
            </div>

            <button type="button" class="primary js-submit">Enviar</button>

          </form>
        </div>

      </div>
    </div>

  </div>

</body>
</html>