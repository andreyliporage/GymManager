const fs = require('fs') // para guardar os dados 
const data = require('./data.json')
const {age, date} = require('./utils')

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
        services: foundInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat("pt-BT").format(foundInstructor.created_at),
    }

    return res.render("instructors/show", {instructor})
}

exports.post = function(req, res) {
    // req.query funciona com "get"
    // req.body funciona com "post"

    const keys = Object.keys(req.body)

    for(key of keys) {
        
        if (req.body[key] == "") {
            return res.send("Preencha todos os campos")
        }
    }

    let {avatar_url, birth, name, services, gender} = req.body

    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.instructors.length + 1)

    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at,
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
        birth: date(foundInstructor.birth)
    }

    return res.render("instructors/edit", {instructor})
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