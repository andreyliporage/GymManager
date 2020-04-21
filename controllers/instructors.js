const fs = require('fs') // para guardar os dados 
const data = require('../data.json')
const {age, date} = require('../utils')

exports.index = function(req, res) {
    return res.render("instructors/index", {instructors: data.instructors})
}

exports.show = function(req, res) {
    //req.params
    const {id} = req.params // desestruturação

    const foundInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id
    })

    if(!foundInstructor) return res.send("Instructor not found!")    

    const instructor = {
        ...foundInstructor, // espalhando o foundInstructor dentro do objeto (spread operator)
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","), //Transforma string em array e vai quebrar o array na vírgula (",")
        created_at: new Intl.DateTimeFormat("pt-BT").format(foundInstructor.created_at),
    }

    return res.render("instructors/show", {instructor})
}

exports.post = function(req, res) {
    // req.query funciona com "get"
    // req.body funciona com "post"

    const keys = Object.keys(req.body)
    // Object = constructor que é uma função que cria um objeto
    // keys pega todas as chaves do formulário

    for(key of keys) {
        
        if (req.body[key] == "") {
            return res.send("Preencha todos os campos")
        }
    }

    let {avatar_url, birth, name, services, gender} = req.body // desestruturação de objeto

    birth = Date.parse(birth)
    const created_at = Date.now() // constructor Date
    const id = Number(data.instructors.length + 1)// É const pq não está na desestruturação

    data.instructors.push({ // Acrescenta uma nova entrada sem apagar entradas antigas
        id,// Não está na desestruturação pq não está no req.body
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at,// Não está na desestruturação pq não está no req.body
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Write file error!")

        return res.redirect("/instructors")
    })

    //return res.send(req.body)
}

exports.edit =  function(req, res) {
    const {id} = req.params // desestruturação

    const foundInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id
    })

    if(!foundInstructor) return res.send("Instructor not found!") 

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth).iso
    }

    return res.render("instructors/edit", {instructor})
}

exports.create = function(req, res) {
    return res.render('instructors/create')
}

exports.put = function(req, res) {
    const {id} = req.body
    let index = 0

    const foundInstructor = data.instructors.find(function(instructor, foundIndex) {
        if(id == instructor.id) {
            index = foundIndex
            return true
        }
    })

    if(!foundInstructor) return res.send("Instructor not found!")

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write File error!")

        return res.redirect(`/instructors/${id}`)
    })
}

exports.delete = function(req, res) {
    const {id} = req.body

    const filteredInstructors = data.instructors.filter(function(instructor) {
        return instructor.id != id
    })

    data.instructors = filteredInstructors

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write File error!")

        return res.redirect("/instructors")
    })
}