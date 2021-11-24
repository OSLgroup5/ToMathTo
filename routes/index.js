var express = require('express');
var router = express.Router();
var fs = require('fs');

const idSet = JSON.parse(fs.readFileSync('user.json'), 'utf8');
const probSet = JSON.parse(fs.readFileSync('problem.json'), 'utf8');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { session: req.session });
});

router.post('/login', (req, res, next) => {

    console.log(req.body.id);
    console.log(req.body.pw);
    if (req.body.id in idSet && idSet[req.body.id].password === req.body.pw) {

        req.session.user_id = req.body.id;
        req.session.logined = true;
        // req.session.regenerate(()=>
        // {
        //     req.session.logined = true;
        //     req.session.id = req.body.id;
        //     // res.render("logined", {session: req.session});
        // });

        res.send("good");
    }
    else {
        // res.write('<script>alert("incorrect id or pw")</script>');
        // res.write("<script>window.location=\"../\"</script>");
        res.send("bad");
    }
});

router.get('/logined', (req, res, next) => {
    if (!req.session.logined) {
        res.redirect('/');
    }
    else {
        console.log(req.session);
        res.render('logined', { session: req.session });
    }
});
router.get('/getProblemList', (req, res, next) => {
    if (!req.session.logined) {
        res.redirect('/');
    }
    else {
        res.send(probSet);
    }
});

router.post('/submitAnswer', (req, res, next)=>
{
    let probNum = req.body.probNum;
    let yourAnswer = req.body.answer;
    console.log(probNum);
    console.log(yourAnswer);
    if (!req.session.logined)
    {
        res.redirect('/');
    }
    else
    {
        res.send("correct");
    }
});

router.get('/problem', (req, res, next) => {
    console.log(req.session);

    if (!req.session.logined) {
        res.redirect('/');
    }
    else {
        res.render("problem");
        return;
        ///////////////////////
        // console.log(req.query.probNum);
        // res.render('problem');
        var output = ``;
            res.send(output);
    }
});
module.exports = router;
