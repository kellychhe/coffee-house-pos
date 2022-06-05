module.exports = function(app, passport, db) { // sends function to server.js
const {ObjectId} = require('mongodb')

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
      db.collection('orders').find().toArray()
      .then(results=> {
        let notCompleted = results.filter(order => !order.complete)
        let completed = results.filter(order => order.complete)
        res.render('orders.ejs', {
          orders: notCompleted,
          done: completed
        })
      })
    });

    app.get('/index', function(req,res){
      res.render('index.ejs')
    })

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('orders').find().toArray()
        .then(results=> {
          let notCompleted = results.filter(order => !order.complete)
          let completed = results.filter(order => order.complete)
          res.render('profile.ejs', {
            user : req.user, //use to just show profile name
            orders: notCompleted,
            done: completed
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/orders', (req, res) => {
      db.collection('orders').save(
        {name: req.body.name, 
          drink: req.body.drink, 
          size: req.body.size, 
          flavors: req.body.flavors,
          milk: req.body.milk,
          temperature: req.body.temperature,
          complete: false,
          barista: ''}, 
          //add barista with local.user.djfakljsd
          (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
      })
    })


    app.put('/orders', (req, res) => {
      db.collection('orders')
      .findOneAndUpdate({_id: ObjectId(req.body._id)}, {
        $set: {
          complete: true,
          barista: req.body.barista
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.delete('/orders', (req, res) => {
      db.collection('orders').findOneAndDelete({_id: ObjectId(req.body._id)}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Order deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================PDNT

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash orders
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true, // allow flash orders
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        let user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
