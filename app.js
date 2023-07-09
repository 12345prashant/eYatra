// if(process.env.NODE_ENV !== "production"){
//     require('dotenv').config();
// }
require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/users');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const mongoSanitize = require('express-mongo-sanitize');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
   // useCreateIndex: true,
    useUnifiedTopology: true,
    //useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize())


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async (req,res)=>{
    const user = new User({email: 'coltttttt@gmail.com', username: 'colttt'});
    const newUser = await User.register(user,'chicken')
    res.send(newUser)
})
app.use('/',userRoutes)
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})




// app.get('/', (req,res)=>{
//     // res.send('Hello from yelpcamp');
//     res.render('home.ejs')
// })
// app.get('/campgrounds', catchAsync(async (req,res)=>{
//     const campgrounds = await Campground.find({});
//     res.render('campgrounds/index',{campgrounds})
// }))

// app.get('/campgrounds/new', catchAsync((req,res)=>{
//     res.render('campgrounds/new.ejs')
// }))
// app.post('/campgrounds', validateCampground,catchAsync(async (req,res,next)=>{
//     // res.send(req.body)
//    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    
//     const campground = new Campground(req.body.campground);
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`);
// }))
// app.get('/campgrounds/:id', catchAsync(async(req,res,next)=>{
//     const campground = await Campground.findById(req.params.id).populate('reviews');
//     res.render('campgrounds/show.ejs', {campground});
// }))
// app.get('/campgrounds/:id/edit', catchAsync(async(req,res)=>{
//     const campground = await Campground.findById(req.params.id);
//     res.render('campgrounds/edit.ejs', {campground});
// }))
// app.put('/campgrounds/:id', validateCampground,catchAsync(async(req,res)=>{
//     const {id} = req.params;
//     const campground = await Campground.findByIdAndUpdate(id , {...req.body.campground});
//     res.redirect(`/campgrounds/${campground._id}`)
// }));
// app.delete('/campgrounds/:id', catchAsync(async (req,res)=>{
//     const {id} = req.params;
//     await Campground.findByIdAndDelete(id);
//     res.redirect('/campgrounds');
// }))
// app.get('/campgrounds/:id/reviews', (req,res)=>{
//     res.send('you made itz!!!!')
// })
// app.post('/campgrounds/:id/reviews',validateReview,catchAsync(async (req,res) =>{
//     const campground = await Campground.findById(req.params.id);
//     const review = new Review(req.body.review)
//     campground.reviews.push(review)
//     await review.save();
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`);
// }))
// app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async(req,res)=>{
//     // res.send('DELETE ME')
//     const {id,reviewId}= req.params;
//     await Campground.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/campgrounds/${id}`);
    
// }))
