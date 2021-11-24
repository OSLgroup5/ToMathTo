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
        // console.log(req.session);
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

router.post('/submitAnswer', (req, res, next) => {
    let probNum = req.body.probNum;
    let yourAnswer = parseInt(req.body.answer);
    // console.log(probNum);
    // console.log(yourAnswer);
    if (!req.session.logined) {
        res.redirect('/');
    }
    else {

        // res.send("correct");
        // console.log(yourAnswer);
        // console.log(probSet[probNum].answer);
        if ( (probNum in probSet) && yourAnswer === probSet[probNum].answer) 
        {
            // console.log("correct!!");
            res.send("correct");
        }
        else 
        {
            // console.log("wrong!!");
            res.send("incorrect");
        }
    }
});
router.get('/getDescription', (req, res, next) => {
    let probNum = req.query.probNum;
    console.log(probNum);

    // console.log(req);
    if (!(probNum in probSet)) {
        res.send("incorrect problem number");
    }
    else {
        res.send(probSet[probNum].description);
        // res.write
    }
});

router.get('/problem', (req, res, next) => {
    // console.log(req.session);
    // console.log("problem reqest inputed");
    if (!req.session.logined) {
        res.redirect('/');
    }
    else {
        let probNum = req.query.probNum;
        let probName = probSet[probNum].name;
        let probDesc = probSet[probNum].description;
        probDesc = probDesc.replaceAll("\\", "\\\\");
        console.log(probNum);
        // console.log(probDesc);
        // res.render("problem");
        // return;
        ///////////////////////
        // console.log(req.query.probNum);
        // res.render('problem');
        var output = `<!doctype html>
        <html lang="en">
        
        <head>
            <!-- Required meta tags -->
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
        
            <!-- Bootstrap CSS -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        
            <title>Problem  ${probNum}</title>
        </head>
        <script type="text/javascript" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML&delayStartupUntil=configured"></script>

        <body>
            <h1>Problem  ${probName}</h1>
            <p id="desc">
                
            </p>
            <button type="button" class="btn btn-outline-primary" id="goToList">goToList!</button>
            <div class="input-group flex-nowrap">
                <span class="input-group-text">answer: </span>
                <input type="text" class="form-control" placeholder="answer the question" id="answer">
            </div>
            <button type="button" class="btn btn-outline-primary" id="submit">Submit!</button>
            <div id="result">
        
            </div>
        
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
                crossorigin="anonymous"></script>
        </body>
        <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
        <script>

            // document.querySelector("#desc").innerHTML = \`${probDesc}\`;
            window.onload = ()=>
            {
                $.ajax({
                    url:"/getDescription",
                    type:"get",
                    data: {probNum:"${probNum}"},
                    success:(data)=>{document.querySelector("#desc").innerHTML=data; MathJax.Hub.Configured();}
                });
                
            };
            document.querySelector('#submit').addEventListener("click", ()=>
            {
                $.ajax({
                    url: "/submitAnswer", 
                    type: "post",
                    data: {answer: document.querySelector("#answer").value, probNum: ${probNum}},
                    success:(data)=>
                    {
                        // console.log(data);
                        let x = document.querySelector("#result");
                        if (data === "correct")
                        {
                            x.innerHTML = '<div class="badge bg-primary text-wrap" style="width: 6rem;"> Success! </div>';
                        }
                        else
                        {
                            x.innerHTML = '<div class="badge bg-danger text-wrap" style="width: 6rem;"> Wrong! </div>';
                        }
                    }
                });
            });
        
            document.querySelector("#goToList").addEventListener("click",()=>
            {
                console.log("clicked!");
                window.location.href = "/logined";
            });
        </script>
        
        </html>`;

        res.send(output);
    }
});
module.exports = router;
