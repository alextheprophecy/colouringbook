const User = require("../models/user.model");

const getUser = (user_id) => User.findOne({ _id: user_id })


const isCreditsSufficient = (user_id, credit_cost) => {
    return getUser(user_id).then(user => {
        if(!user) return false
        const newSum = user.credits - credit_cost
        if(newSum<0) return false

        User.updateOne({ _id: user_id }, {credits: newSum})
        return true
    })
}


const generateBookForUser = ({imageCount, greaterQuality}, user_id) => {
    const creditsPerPage = greaterQuality?10:1
    const creditCost = imageCount*creditsPerPage

}