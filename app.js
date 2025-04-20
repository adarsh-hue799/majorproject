if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const Document = require('./models/document.js');
const Application = require("./models/application.js");


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const { saveRedirectUrl, isAuthenticated } = require('./middleware');
const multer = require('multer');
const { storage } = require('./cloudConfig');


const upload = multer({storage, limits: { fileSize: 5 * 1024 * 1024 }});

const MONGO_URI = 'mongodb://localhost:27017/pmsss';




connect().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

async function connect() {
    await mongoose.connect(MONGO_URI);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maixAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  };
  
  // app.get('/', function (req, res) {
  //   res.send('This is the Home Route');
  // });
  
  
  
  app.use(session(sessionOptions));
  app.use(flash());
  
  app.use(passport.initialize())
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  
  app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
  });


app.get('/', (req, res) => {
    res.render("home.ejs");
});

app.post("/signup", async (req, res) => {
    try {
        const { email, password, name } = req.body;
    const user = new User({ email, name});
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Signed up successfully!");
        res.redirect("/login/student");
    });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});

app.get('/signup', async (req, res) => {
    res.render("students/signup.ejs");
});
app.get('/login/student', async (req, res) => {
    res.render("students/login.ejs");
});
app.get('/login/sag', async (req, res) => {
    res.render("sag/login.ejs");
});
app.get('/login/finance', async (req, res) => {
    res.render("finance/login.ejs");
});

app.post('/login/student', saveRedirectUrl, passport.authenticate('local',{failureRedirect: "/login/student", failureFlash: true}), (req, res) => {
    if (req.user.role !== 'student') {
        req.flash("error", "You are not a student!");
      return res.redirect("/login/student"); 
    }
    req.flash("success", "Welcome to PMSSS Portal!");
    let redirectUrl = res.locals.redirectUrl || "/login/student/dashboard";//for home page session redirectUrl undefined
    res.redirect(redirectUrl);
});
app.post('/login/sag', saveRedirectUrl, passport.authenticate('local',{failureRedirect: "/login/sag", failureFlash: true}), (req, res) => {
    if (req.user.role !== 'SAG Bureau') {
        req.flash("error", "You are not a SAG Bureau!");
      return res.redirect("/login/sag"); 
    }
    req.flash("success", "Welcome to PMSSS Portal!");
    let redirectUrl = res.locals.redirectUrl || "/login/sag/dashboard";//for home page session redirectUrl undefined
    res.redirect(redirectUrl);
});
app.post('/login/finance', saveRedirectUrl, passport.authenticate('local',{failureRedirect: "/login/finance", failureFlash: true}), (req, res) => {
    if (req.user.role !== 'Finance Bureau') {
        req.flash("error", "You are not a Finance Bureau!");
      return res.redirect("/login/finance"); 
    }
    req.flash("success", "Welcome to PMSSS Portal!");
    let redirectUrl = res.locals.redirectUrl || "/login/finance/dashboard";//for home page session redirectUrl undefined
    res.redirect(redirectUrl);
});

app.get('/login/student/dashboard', async (req, res) => {
    res.render("students/dashboard.ejs");
});
app.get('/login/student/announcement', async (req, res) => {
    res.render("students/announcement.ejs");
});
app.get('/login/student/viewstatus', async (req, res) => {
    res.render("students/viewstatus.ejs");
});
app.get('/login/student/scholarship', async (req, res) => {
    res.render("students/scholarship.ejs");
});
app.get('/login/student/apphistory', async (req, res) => {
    res.render("students/apphistory.ejs");
});
app.get('/login/sag/manageappln', async (req, res) => {
    const applications = await Application.find();
    res.render("sag/manageappln.ejs", { applications });
});
  
  // Approve an application
  app.post('/applications/:id/approve', async (req, res) => {
    await Application.findByIdAndUpdate(req.params.id, { status: 'verified' });
    res.redirect('/manage-applications');
  });
  
  // Reject an application
  app.post('/applications/:id/reject', async (req, res) => {
    await Application.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    res.redirect('/manage-applications');
  });
app.get('/login/sag/dashboard', async (req, res) => {
    res.render("sag/dashboard.ejs");
});
app.get('/login/sag/reviewreports', async (req, res) => {
    res.render("sag/reviewreports.ejs");
});
app.get('/login/sag/statistics', async (req, res) => {
    res.render("sag/statistics.ejs");
});
app.get('/login/sag/generateReport', async (req, res) => {
    res.render("sag/generateReport.ejs");
});
app.get('/login/sag/feedback', async (req, res) => {
    res.render("sag/feedback.ejs");
});
app.get('/login/finance/dashboard', async (req, res) => {
    res.render("finance/dashboard.ejs");
});
app.get('/login/finance/pendingDisbursements', async (req, res) => {
    res.render("finance/pendingDisbursements.ejs");
});
app.get('/login/finance/disbursementsCompleted', async (req, res) => {
    res.render("finance/disbursementsCompleted.ejs");
});
app.get('/login/finance/applRecived', async (req, res) => {
    res.render("finance/applRecived.ejs");
});
app.get('/login/finance/total', async (req, res) => {
    res.render("finance/total.ejs");
});
app.get('/login/student/upload',isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const userDocuments = await Document.find({ userId: userId });
        const submittedDocuments = {};
        userDocuments.forEach(doc => {
            submittedDocuments[doc.type] = true;
        });
        res.render("students/test.ejs", { submittedDocuments });
    } catch (error) {
        console.error('Error fetching documents:', error);
        req.flash("error", "Failed to load the upload page. Please try again.");
        res.redirect("/login/student/dashboard");
    }
});



app.post('/login/student/upload',isAuthenticated, (req, res, next) => {
    upload.single("Document[url]")(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                req.flash("error", "File size should not exceed 5MB.");
            } else {
                req.flash("error", err.message || "Failed to upload document. Please try again.");
            }
            return res.redirect("/login/student/upload");
        }
        next();
    });
}, async (req, res) => {
    try {
        const file = req.file;
        const userId = req.user._id || res.locals.currUser;
        console.log(userId);
        const document = new Document({
            userId: userId,
            type: req.body.type,
            url: file.path, 
        });
        
        console.log('Document Object:', document);
        
        const saveDocument = await document.save();

        console.log("savedoc",saveDocument);

        const user = await User.findById(userId);
        console.log("user",user);
        
        user.documents.push(saveDocument._id);

        await user.save();

        req.flash("success", "Document uploaded successfully!");
        res.redirect("/login/student/upload");
    } catch (error) {
        // Improved error logging
        console.error('Error uploading document:', error.stack || error.message || error);
        console.dir(error, { depth: null });

        req.flash("error", "Failed to upload document. Please try again.");
        res.redirect("/login/student/upload");
    }
});


app.listen(8080, () => {
  console.log('Server is listening on port 8080');
});

