//const express = require('express');
// const app = express();
// const path = require('path');
//app.set('view engine', 'ejs');
const Campground = require('../models/campground')
const cities = require('./cities.js')
const {places,descriptors} = require('./seedHelpers.js')

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })
const db = mongoose.connection;
db.on("error" , console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<300;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '64a42601bd924a36ae7eacbd',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non quidem sint dolore, ipsum voluptate quo cumque fugiat perspiciatis aperiam! Ipsa molestiae labore consequatur ratione sint aliquid repellendus aut animi architecto.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dsubcihfx/image/upload/v1688662528/YelpCamp/pcblps7yfqty66tisufg.jpg',
                    filename: 'YelpCamp/pcblps7yfqty66tisufg',
                },
                {
                  url: 'https://res.cloudinary.com/dsubcihfx/image/upload/v1688661490/YelpCamp/arwewuxkj0p1toyjzrrn.png',
                  filename: 'YelpCamp/arwewuxkj0p1toyjzrrn'
                },
                {
                  url: 'https://res.cloudinary.com/dsubcihfx/image/upload/v1688661490/YelpCamp/pzoamdazfkypgbvxpzgu.png',
                  filename: 'YelpCamp/pzoamdazfkypgbvxpzgu'
                }
              ],
            
            
        })
        await camp.save();
    }
    // const c = new Campground({title: 'purple field'});
    // await c.save();
}

seedDB().then(()=>{
    mongoose.connection.close();
});