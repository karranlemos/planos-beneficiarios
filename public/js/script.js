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
          <div class="beneficiario">
            <h2>Beneficiário ${newBeneficiarioNumber}</h2>
            <input type="text" name="nome-beneficiario-${newBeneficiarioNumber}" placeholder="Nome">
            <input type="number" name="idade-beneficiario-${newBeneficiarioNumber}" placeholder="Idade">
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


document.addEventListener('DOMContentLoaded', function() {
    BeneficiariosLoader.getAll()
})