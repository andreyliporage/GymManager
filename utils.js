module.exports = {
    age: function(timestamp) {

        const today = new Date() // criando um novo objeto de data e colocando dentro da variável
        const birthDate = new Date(timestamp) // data do aniversário da pessoa
    
        let age = today.getFullYear() - birthDate.getFullYear() // retorna a idade
        const month = today.getMonth() - birthDate.getMonth() // retorna o mês
    
        // today.getDate()
        // birthDate.getDate() retornam o dia do mês
        if(month < 0 || month == 0 && today.getDate() < birthDate.getDate()) {
            age = age - 1
        }
    
        return age
    },
    
    date: function(timestamp) {
        const date = new Date(timestamp)

        const year = date.getUTCFullYear()

        const month = `0${date.getUTCMonth() + 1}`.slice(-2) // month de 0 a 11

        const day = `0${date.getUTCDate()}`.slice(-2)

        return `${year}-${month}-${day}`
    }
}