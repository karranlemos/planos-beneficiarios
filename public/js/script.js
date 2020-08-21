class BeneficiariosLoader {
    
    constructor(beneficiariosLoader) {
        if (!beneficiariosLoader.classList.contains('js-beneficiarios'))
            throw "beneficiariosLoader is not of class '.js-beneficiarios'"
        this.beneficiariosLoader = beneficiariosLoader

        this.beneficiariosGrupos = this.beneficiariosLoader.querySelector('.js-beneficiarios-grupos')
        if (!this.beneficiariosGrupos)
            throw "'.js-beneficiarios-grupos' not found"

        this.loadButton = this.beneficiariosLoader.querySelector('button.js-add-beneficiario')
        if (!this.loadButton)
            throw "'button.js-add-beneficiario' not found"

        this.currentBeneficiario = 0

        this.loadButton.addEventListener('click', function() {
            this.addNewBeneficiario()
        }.bind(this))

        this.addNewBeneficiario()
    }

    addNewBeneficiario() {
        var newBeneficiarioNumber = ++this.currentBeneficiario
        var html = `
          <div class="beneficiario js-beneficiario">
            <h2>Beneficiário ${newBeneficiarioNumber}</h2>
            <input type="text" class="js-nome-beneficiario" placeholder="Nome">
            <input type="number" class="js-idade-beneficiario" placeholder="Idade">
          </div>
        `
        this.beneficiariosGrupos.insertAdjacentHTML('beforeend', html)
    }



    static getAll() {
        var loadersElements = document.querySelectorAll('.js-beneficiarios')
        var loaders = []
        for (let loaderElement of loadersElements) {
            try {
                loaders.push(new BeneficiariosLoader(loaderElement))
            }
            catch (e) {
                console.log(e)
            }
        }
        return loaders
    }
}



class FormGeraPlano {

    constructor(form) {
        if (!form.classList.contains('js-gera-plano'))
            throw "Element isn't of class 'js-gera-plano'"
        this.form = form

        this.selectCodigo = this.form.querySelector('select[name=plano-codigo]')
        if (!this.selectCodigo)
            throw "'select[name=plano]' not found"
        
        this.beneficiariosGrupos = this.form.querySelector('js-beneficiarios-grupos')
        if (!this.beneficiariosGrupos)
            throw "'js-beneficiarios-grupos' not found"
        
        this.buttonSubmit = this.form.querySelector('button.js-submit')
        if (!this.buttonSubmit)
            throw "Button 'js-submit-button' not found"
        this.buttonSubmit.addEventListener('click', this.submitButton.bind(this))
    }

    submitButton() {
        var dataArray = this.organizeData()
        var dataJSON = JSON.stringify(dataArray)
        
        this.sendToServer(dataJSON)
    }

    organizeData() {
        var beneficiariosDivs = this.beneficiariosGrupos.querySelector('js-beneficiario')
        var beneficiariosArray = []
        for (let beneficiarioDiv of beneficiariosDivs) {
            let nome = beneficiarioDiv.querySelector('js-nome-beneficiario')
            let idade = beneficiarioDiv.querySelector('js-idade-beneficiario')
            if (!nome || !idade)
                continue
            
            beneficiariosArray.push({
                nome: nome,
                idade: idade
            })
        }

        var planoObj = {
            codigoPlano: this.selectCodigo.value,
            beneficiarios: beneficiariosArray
        }

        return planoObj
    }

    sendToServer(dataJSON) {
        var request = new XMLHttpRequest()
        
        request.onload = function() {
            if (request.status !== 200)
                return
        }

        request.open('post', '/pages/rest/calcula-plano.php')        
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(dataJSON)
    }



    static getAll() {
        var geraPlanosForms = document.querySelectorAll('.js-gera-plano')
        var geraPlanos = []
        for (let geraPlanoForm of geraPlanosForms) {
            try {
                geraPlanos.push(new FormGeraPlano(geraPlanoForm))
            }
            catch {
                continue
            }
        }
        return geraPlanos
    }
}



document.addEventListener('DOMContentLoaded', function() {
    BeneficiariosLoader.getAll()
    FormGeraPlano.getAll()
})