const asyncHandler = require("express-async-handler");
const {User} = require('../models/userModel');
const {Emergency} = require('../models/emergencyModel')

const {sendHelpEmail,sendHelpEmailContacts} = require('../utils/email')
const axios = require('axios')
let pincode;
let formattedAddress;


const getData = async(url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'womensafety/1.0 (devansh0814dj@gmail.com)' 
      }
    });
    
    const data = response.data;

    if (data && data.address) {
      const address = data.address;
      const pincode = address.postcode;
      const fullAddress = data.display_name;
      
      return {
        formatted_address: fullAddress,
        pincode: pincode,
        addressComponents: address
      };
    } else {
      console.log('No address found for these coordinates.');
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch address:', error);
  }
}

const sendemergencyCntrl = asyncHandler(async (req, res) => {
  const {userId, lat, long} = req.body;
  if(!lat || !long){
    res.status(403).json({message: "latitude or longitude is missing"})
  }
  console.log("in")
  const resp = await getData(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`)
  console.log("out")
  pincode = resp.results[0].pincode;
  formattedAddress = resp.results[0].formatted_address;
  const  user = await User.findById(userId);
  if(!user){
    res.status(404).json({message: "User not found"})
  }
  console.log("user")
  const recipients = [user.emergencyMail];
  if(user.extraEmail1){
    recipients.push(user.extraEmail1)
  }else if(user.extraEmail2){
    recipients.push(user.extraEmail2)
  }
  console.log("done1")
  
  await sendHelpEmail(recipients, lat, long , user.uname, pincode,formattedAddress);
  
  console.log("done2")
  

  const emergency = await Emergency.create({
    user: userId,
    emergencyLctOnMap: `https://maps.google.com/maps?q=${lat},${long}&hl=en&z=14&amp`,
    addressOfIncd: formattedAddress
  })

  res.status(200).json({message: "Sent an SOS for help"})
  

});


const getAllEmergencies = asyncHandler(async(req,res) => {
  const data = []
  const emer = await Emergency.find({});
  for(const x of emer){
    console.log(x.createdAt)
    const user = await User.findById(x.user);
    if(user){
      data.push({
        _id: x._id,
        mapLct: x.emergencyLctOnMap,
        addressOfInc: x.addressOfIncd,
        username: user.uname,
        userId: user._id,
        emergencyNo: user.emergencyNo,
        isResolved: x.isResolved,
        createdAt: x.createdAt,
        updatedAt: x.updatedAt
      })
    }
  }
  res.status(200).json(data)
});


const getSinglEmergency = asyncHandler(async(req,res) => {
  const id = req.params.id;
  const emergency = await Emergency.findById(id);
  if(emergency){
    emergency.isResolved = true;
    await emergency.save();
    const user = await User.findById(emergency.user)
    if(user){
      res.status(200).json({
        
          _id: emergency._id,
          mapLct: emergency.emergencyLctOnMap,
          addressOfInc: emergency.addressOfIncd,
          username: user.uname,
          emergencyNo: user.emergencyNo,
          isResolved: emergency.isResolved
        
      })
    }

    
  }
})


const emergencyUpdate = asyncHandler(async(req,res) => {
  const emerg = req.params.id;
  const emerge = await Emergency.findById(emerg);
  if(emerge){
    emerge.isResolved = true
    await emerge.save()
    res.status(200).json({message: "Resolved"})
  }
})
module.exports = { sendemergencyCntrl,getAllEmergencies,getSinglEmergency,emergencyUpdate };
