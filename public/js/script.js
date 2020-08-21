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
        var html = 
        `<div class="form-group beneficiario js-beneficiario">
            <h2>Beneficiário ${newBeneficiarioNumber}</h2>
            <input type="text" class="js-nome-beneficiario" placeholder="Nome">
            <input type="number" class="js-idade-beneficiario" placeholder="Idade" min="0">
          </div>`
        this.beneficiariosGrupos.insertAdjacentHTML('beforeend', html)

        var firstInput = this.beneficiariosGrupos.lastChild.querySelector('input')
        if (!firstInput)
            return
        firstInput.focus()
    }

    resetBeneficiarios() {
        while (this.beneficiariosGrupos.firstChild)
            this.beneficiariosGrupos.removeChild(this.beneficiariosGrupos.firstChild)
        this.currentBeneficiario = 0
    }



    static getAll() {
        var loadersElements = document.querySelectorAll('.js-beneficiarios')
        var loaders = []
        for (let loaderElement of loadersElements) {
            try {
                loaders.push(new BeneficiariosLoader(loaderElement))
            }
            catch (e) {
                console.log('BeneficiariosLoader: '+e)
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
        try {
            this.formBeneficiarios = new BeneficiariosLoader(this.form.querySelector('.js-beneficiarios'))
        }
        catch (e) {
            throw e
        }

        this.messagesSection = this.formContainer.querySelector('.js-messages')
        if (!this.messagesSection)
            throw "'js-messages' not found"
        
        this.resultsContainer = this.formContainer.querySelector('section.js-results-container')
        if (!this.resultsContainer)
            throw "'section.js-results-container' not found"
        this.resultsSection = this.resultsContainer.querySelector('section.js-results')
        if (!this.resultsSection)
            throw "'section.js-results' not found"
        this.backToFormButton = this.formContainer.querySelector('section.js-results-buttons button.js-back-to-form')
            if (!this.backToFormButton)
                throw "'section.js-results-buttons' not found"

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

        this.backToFormButton.addEventListener('click', this.toggleFormResults.bind(this))
    }

    submitButton() {
        this.eraseErrorMessages()
        try {
            var dataArray = this.organizeData()
        }
        catch (e) {
            this.showErrorMessage(e)
            return
        }
        var dataJSON = JSON.stringify(dataArray)
        
        this.sendToServer(dataJSON)
    }

    organizeData() {
        var beneficiariosDivs = this.beneficiariosGrupos.querySelectorAll('.js-beneficiario')
        var beneficiariosArray = []
        for (let beneficiarioDiv of beneficiariosDivs) {
            let nomeElement = beneficiarioDiv.querySelector('.js-nome-beneficiario')
            let idadeElement = beneficiarioDiv.querySelector('.js-idade-beneficiario')
            if (!nomeElement || !idadeElement)
                continue
            let nome = nomeElement.value
            let idade = idadeElement.value

            // throws exception if invalid
            this.validateBeneficiario(nome, idade)
            
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

    validateBeneficiario(nome, idade) {
        if (nome === '')
            throw 'Nomes não podem estar vazios.'
        if (!/^\-{0,1}\d+$/.test(idade))
            throw 'Idade deve ser um número inteiro.'
        if (parseInt(idade, 10) < 0)
            throw 'Idade deve ser maior ou igual a zero.'
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
            this.showErrorMessage("Server error: couldn't parse data")
            return
        }

        if (json.precoTotal === undefined || json.precosBeneficiarios === undefined)
            return
        if (!Array.isArray(json.precosBeneficiarios))
            return
        
        var html = 
            `<table class="precos-individual-results"><tr>
                <th>Preço total</th>
                <td>${json.precoTotal}</td>
            </tr></table>`
        for (let precosBeneficiario of json.precosBeneficiarios) {
            html += 
                `<table class="precos-individual-results">
                <tr>
                    <th>Nome</th>
                    <td>${precosBeneficiario.nome}</td>
                </tr>
                <tr>
                    <th>Idade</th>
                    <td>${precosBeneficiario.idade}</td>
                </tr>
                <tr>
                    <th>Preço</th>
                    <td>${precosBeneficiario.preco}</td>
                </tr>
                </table>`
        }
        html += 
            `<div class="results-download-buttons">
                <a href="/public/files/data-output/beneficiarios.json" onclick="$event.preventDefault()" download>
                    <button class="secondary">Download beneficiarios.json</button>
                </a>
                <a href="/public/files/data-output/proposta.json" onclick="$event.preventDefault()" download>
                    <button class="secondary">Download proposta.json</button>
                </a>
            </div>`

        this.populateResultSection(html)
        this.toggleFormResults()
        this.form.reset()
    }

    populateResultSection(html) {
        while (this.resultsSection.firstChild)
            this.resultsSection.removeChild(this.resultsSection.firstChild)

        this.resultsSection.insertAdjacentHTML('afterbegin', html)
    }

    toggleFormResults() {
        this.eraseErrorMessages()
        
        if (this.form.classList.contains('hidden')) {
            this.form.classList.remove('hidden')
            this.resultsContainer.classList.add('hidden')
        }
        else {
            this.form.classList.add('hidden')
            this.resultsContainer.classList.remove('hidden')

            this.formBeneficiarios.resetBeneficiarios()
            this.formBeneficiarios.addNewBeneficiario()
        }
    }

    showErrorMessage(message, goToTop=true) {
        var html = `<div class="error-message-box">${message}</div>`
        this.messagesSection.insertAdjacentHTML('beforeend', html)

        if (goToTop)
            window.scrollTo(0, 0)
    }

    eraseErrorMessages() {
        while (this.messagesSection.firstChild)
            this.messagesSection.removeChild(this.messagesSection.firstChild)
    }



    static getAll() {
        var geraPlanosForms = document.querySelectorAll('.js-gera-plano')
        var geraPlanos = []
        for (let geraPlanoForm of geraPlanosForms) {
            try {
                geraPlanos.push(new FormGeraPlano(geraPlanoForm))
            }
            catch (e) {
                console.log('FormGeraPlano: '+e)
            }
        }
        return geraPlanos
    }
}



document.addEventListener('DOMContentLoaded', function() {
    FormGeraPlano.getAll()
})