const asyncHandler = require('express-async-handler');
const { Incident } = require('../models/incidentRptModel');
const { User } = require('../models/userModel')

const fs = require('fs');
const path = require('path')
require('dotenv').config();

const addIncident = asyncHandler(async (req, res) => {
/* 
    const { user, report, pincodeOfIncident, mimeType, address } = req.body;
    const note= req.file.path

    
    const incident = await Incident.create({
            user,
            report,
            address,
            pincodeOfIncident
        })

        if(incident){
            res.status(201).json({message: "Incident reported successfully"})
        }else{
            res.status(500).json({message: "Something went wrong"})
        }

});


const getAllIncidents = asyncHandler(async(req,res) => {

    const incidents = await Incident.find({});
    const data = []
    for(const x of incidents){
        const user = await User.findById(x.user);
        console.log(user)
        if(user){
            data.push({
                uname: user.uname,
                address: x.address,
                pincode: x.pincodeOfIncident,
                report: x.report,
                isSeen: x.isSeen,
                image: x.meidaSt || "empty",
                createdAt: x.createdAt,
                updatedAt: x.updatedAt
            })
        }
        
    }
    res.status(200).json(data)
});

const acknowledgeInc = asyncHandler(async(req,res) => {

    const inc = req.params.id;
    const incident = await Incident.findById(inc);
    if(incident){
        incident.isSeen = true;
        await incident.save()
    } */
})

module.exports = {addIncident ,getAllIncidents,acknowledgeInc}