const fs = require('fs') // para guardar os dados 
const data = require('../data.json')
const {date} = require('../utils')

exports.index = function(req, res) {
    return res.render("members/index", {members: data.members})
}

exports.show = function(req, res) {
    //req.params
    const {id} = req.params // desestruturação

    const foundMember = data.members.find(function(member) {
        return member.id == id
    })

    if(!foundMember) return res.send("Member not found!")    

    const member = {
        ...foundMember, // espalhando o foundMember dentro do objeto (spread operator)
        birth: date(foundMember.birth).birthDay,
    }

    return res.render("members/show", {member})
}

exports.create = function(req, res) {
    return res.render('members/create')
}

exports.post = function(req, res) {
    // req.query funciona com "get"
    // req.body funciona com "post"

    const keys = Object.keys(req.body)
    // Object = constructor que é uma função que cria um objeto
    // keys pega as chaves do formulário

    for(key of keys) {
        
        if (req.body[key] == "") {
            return res.send("Preencha todos os campos")
        }
    }   

    birth = Date.parse(req.body.birth)
    let id = 1
    const lastMember = data.members[data.members.length - 1]

    if (lastMember) {
        id = lastMember.id + 1
    }

    data.members.push({
        id,
        birth,
        ...req.body,
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Write file error!")

        return res.redirect("/members")
    })
}

exports.edit =  function(req, res) {
    const {id} = req.params // desestruturação

    const foundMember = data.members.find(function(member) {
        return member.id == id
    })

    if(!foundMember) return res.send("Member not found!") 

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).iso
    }

    return res.render("members/edit", {member})
}

exports.put = function(req, res) {
    const {id} = req.body
    let index = 0

    const foundMember = data.members.find(function(member, foundIndex) {
        if(id == member.id) {
            index = foundIndex
            return true
        }
    })

    if(!foundMember) return res.send("Member not found!")

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write File error!")

        return res.redirect(`/members/${id}`)
    })
}

exports.delete = function(req, res) {
    const {id} = req.body

    const filteredMembers = data.members.filter(function(member) {
        return member.id != id
    })

    data.members = filteredMembers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write File error!")

        return res.redirect("/members")
    })
}