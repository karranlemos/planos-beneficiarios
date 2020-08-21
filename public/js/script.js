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

    constructor(formContainer) {
        if (!formContainer.classList.contains('js-gera-plano'))
            throw "Element isn't of class 'js-gera-plano'"
        this.formContainer = formContainer

        this.form = this.formContainer.querySelector('form')
        if (!this.form)
            throw "'form' not found"
        
        this.resultsSection = this.formContainer.querySelector('section.js-results')
        if (!this.resultsSection)
            throw "'section.js-results' not found"

        this.selectCodigo = this.form.querySelector('select[name=plano-codigo]')
        if (!this.selectCodigo)
            throw "'select[name=plano]' not found"
        
        this.beneficiariosGrupos = this.form.querySelector('.js-beneficiarios-grupos')
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
        var beneficiariosDivs = this.beneficiariosGrupos.querySelectorAll('.js-beneficiario')
        var beneficiariosArray = []
        for (let beneficiarioDiv of beneficiariosDivs) {
            let nome = beneficiarioDiv.querySelector('.js-nome-beneficiario')
            let idade = beneficiarioDiv.querySelector('.js-idade-beneficiario')
            if (!nome || !idade)
                continue
            
            beneficiariosArray.push({
                nome: nome.value,
                idade: idade.value
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
            this.showResults(request.responseText)
        }.bind(this)

        request.open('post', '/index.php?rest=calcula-plano')        
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(dataJSON)
    }

    showResults(jsonString) {
        try {
            var json = JSON.parse(jsonString)
        }
        catch {
            // Invalid JSON syntax
        }

        if (json.precoTotal === undefined || json.precosBeneficiarios === undefined)
            return
        if (!Array.isArray(json.precosBeneficiarios))
            return
        
        var html = `<p>Preço total: ${json.precoTotal}</p><ul>`
        for (let precosBeneficiario of json.precosBeneficiarios) {
            html += `
                <li>Nome: ${precosBeneficiario.nome}</li>
                <li>Idade: ${precosBeneficiario.idade}</li>
                <li>Preço: ${precosBeneficiario.preco}</li>
            `
        }
        html += `</ul>`
        html += `<button class="primary">Go back to the form.</button>`

        this.populateResultSection(html)
        this.toggleFormResults()
        this.form.reset()
    }

    populateResultSection(html) {
        while (this.resultsSection.firstChild)
            this.resultsSection.removeChild(this.resultsSection.firstChild)

        this.resultsSection.insertAdjacentHTML('afterbegin', html)

        var button = this.resultsSection.querySelector('button')
        if (!button)
            return
        button.addEventListener('click', function() {
            this.toggleFormResults()
        }.bind(this))
    }

    toggleFormResults() {
        if (this.form.classList.contains('hidden')) {
            this.form.classList.remove('hidden')
            this.resultsSection.classList.add('hidden')
        }
        else {
            this.form.classList.add('hidden')
            this.resultsSection.classList.remove('hidden')
        }
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