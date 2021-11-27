var express = require('express');
var router = express.Router();
var fs = require('fs');

let idSet = JSON.parse(fs.readFileSync('user.json'), 'utf8');
let probSet = JSON.parse(fs.readFileSync('problem.json'), 'utf8');
let solvedSet = JSON.parse(fs.readFileSync('user_solved.json'), 'utf8');
let contestSet = JSON.parse(fs.readFileSync('contest.json'), 'utf8');
/* GET home page. */
router.get('/', function (req, res, next) {
    if ("logined" in req.session) {
        res.redirect('/logined');
    }
    else {
        res.render('index', { session: req.session });
    }
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
router.post('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
});
router.get('/logined', (req, res, next) => {
    if (!req.session.logined) {
        res.redirect('/');
    }
    else {
        // console.log(req.session);
        res.render('logined.ejs', { session: req.session, gunhan: idSet[req.session.user_id].gunhan });
    }
});

router.get('/problemMake', (req, res, next) => {
    if (!req.session.logined) {
        res.redirect('/');
    }
    else {
        let user_id = req.session.user_id;
        if (idSet[user_id].gunhan < 2) {
            res.redirect('/');

        }
        else {
            // console.log("hello");
            res.render('problemMake.html');
        }
    }
});
let access = {
    user: 1,
    master: 2,
    root_master: 3,
};
router.post('/problemMakingData', (req, res, next) => {
    if (!req.session.logined)
    {
        res.send("login먼저 하세요");
        return;
    }
    console.log("hello?!");
    let title = req.body.title;
    let description = req.body.description;
    let area = req.body.area;
    let rank = req.body.rank;
    let answer = req.body.answer;
    console.log(title);
    console.log(description);
    console.log(area);
    console.log(rank);
    console.log(answer);
    if (
        idSet[req.session.user_id].gunhan === access.master ||
        idSet[req.session.user_id].gunhan === access.root_master
    ) {
        //한 칸이라도 입력 안했다면 경고를 출력한 뒤 return without adding
        if (
            !title.length ||
            !description.length ||
            !area.length ||
            !rank.length ||
            !answer.length
        ) {
            // alert("빈 칸이 있습니다.");
            res.send("빈 칸이 있습니다.");
            return;
        }
        console.log("hello");
        let number = "" + (Object.keys(probSet).length + 1);
        // problems.number++;
        console.log(number);

        // probSet[number] = {};
        probSet[number]={};
        // console.log("aaasdfds");
        probSet[number].name = title;
        probSet[number].description = description;
        probSet[number].area = area;
        probSet[number].rank = rank;
        probSet[number].answer = answer;
        console.log(probSet.number);
        fs.writeFile("problem.json", JSON.stringify(probSet), (err)=>
        {
            console.log(err);
        });
        res.send("success!");
    }
    else
    {
        res.send("권한이 허용되지 않았습니다.");
    }
    

});

router.get('/getProblemList', (req, res, next) => {
    // if (!req.session.logined) {
    //     res.redirect('/');
    // }
    // else {
    // res.send(probSet);
    // }

    console.log("getProbList!!!!");
    let sending = {};
    for (x in probSet) {
        let can = true;
        for (con in contestSet) {
            if (contestSet[con].problemList.find((y) => parseInt(y) === parseInt(x))) {
                can = false;
                break;
            }
        }
        console.log(x + " " + can);
        if (can) sending[x] = probSet[x];
    }
    res.send(sending);
});

function canShow(probNum) {
    let nowTime = new Date();
    for (con in contestSet) {

        let constTime = new Date(contestSet[con].startTime);
        if (contestSet[con].problemList.find(y => parseInt(y) === parseInt(probNum)) && constTime > nowTime) return false;
    }
    return true;
}

function problemToContest(probNum) {
    for (con in contestSet) {
        if (contestSet[con].problemList.find(y => parseInt(y) === parseInt(probNum))) {
            return con;
        }
    }
    return undefined;
}
function updateScoreBoard(con, user, probNum) {
    let path = "contestScore/" + con + ".json";
    console.log(path);
    let isEx = fs.existsSync(path);
    let org = {};
    // console.log("log-1");
    if (isEx) org = JSON.parse(fs.readFileSync(path, 'utf8'), 'utf8');
    // console.log("log0");
    if (!(user in org)) org[user] = [];
    // console.log("log1");
    if (!org[user].find(y => parseInt(y) === parseInt(probNum))) {
        org[user].push(probNum);
    }
    // console.log(org);

    fs.writeFile(path, JSON.stringify(org), (err) => {
        console.log(err);
    });
}

router.post('/submitAnswer', (req, res, next) => {
    let probNum = req.body.probNum;
    let yourAnswer = req.body.answer;
    // console.log(probNum);
    // console.log(yourAnswer);
    if (!req.session.logined) {
        res.redirect('/');
    }
    else {
        if (!canShow(probNum)) {
            res.send("incorrect");
            return;
        }
        // res.send("correct");
        // console.log(yourAnswer);
        // console.log(probSet[probNum].answer);
        if ((probNum in probSet) && String(yourAnswer) === String(probSet[probNum].answer)) {
            // console.log("correct!!");

            if (!(req.session.user_id in solvedSet)) {
                solvedSet[req.session.user_id] = [];
            }
            let is_first = false;
            if (!Array.isArray(solvedSet[req.session.user_id]))
                solvedSet[req.session.user_id] = [];
            if (!solvedSet[req.session.user_id].find(y => parseInt(y) === parseInt(probNum))) {
                solvedSet[req.session.user_id].push(probNum);

                is_first = true;
            }
            fs.writeFileSync("user_solved.json", JSON.stringify(solvedSet), (err) => { });
            res.send("correct");

            let con = problemToContest(probNum);

            console.log("let's update contestScoreboard");
            // console.log(con);
            // console.log(new Date());
            // console.log(contestSet[con].endTime);
            if (con && new Date() < new Date(contestSet[con].endTime) && is_first) {
                // console.log("inside if");
                updateScoreBoard(con, req.session.user_id, probNum);
            }
        }
        else {
            // console.log("wrong!!");
            res.send("incorrect");
        }
    }
});
router.get('/register', (req, res, next) => {
    res.render('register');
});
router.post('/registerInfo', (req, res, next) => {
    let id = req.body.id;
    let pw = req.body.pw;
    // console.log(id);
    // console.log(pw);
    if (id in idSet) {
        res.write("<script>alert('already exist id!')</script>");
        res.write("<script>history.back()</script>");
        return;
    }
    else {
        // console.log(id);
        // console.log(pw);
        idSet[id] = {};
        idSet[id].password = pw;
        // console.log("check");
        // res.write("<script>alert('register complete!')</script>");
        res.send('<script type="text/javascript">alert("register complete!");location.href="/";</script>');
        // res.redirect('/');
        // res.send('<script type="text/javascript">location.href="/"</script>');
        fs.writeFileSync("user.json", JSON.stringify(idSet));
        // 
        // res.write("<script>window.location.href='/'</script>");

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

        if (!canShow(probNum)) {
            res.send("?");
        }
        else {
            res.send(probSet[probNum].description);
        }
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
        if (!(req.session.user_id in solvedSet)) {
            solvedSet[req.session.user_id] = [];
        }
        if (!Array.isArray(solvedSet[req.session.user_id])) {
            solvedSet[req.session.user_id] = [];
        }
        let isSolved = solvedSet[req.session.user_id].find(e => e === probNum);
        let initColor = isSolved ? "success" : "secondary";
        let solvedTxt = isSolved ? "solved" : "unsolved";
        if (!canShow(probNum)) {
            res.write("<script>alert('contest not start!')</script>");
            res.write("<script>history.back()</script>");
            return;
        }
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
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.3/MathJax.js?config=TeX-MML-AM_CHTML&delayStartupUntil=configured"></script>

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
                <div class="badge bg-${initColor} text-wrap" style="width: 6rem;"> ${solvedTxt} </div>
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
                document.querySelector("#result").innerHTML = '<div class="badge bg-warning text-wrap" style="width: 6rem;"> wait please... </div>';
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
                history.back();
            });
        </script>
        
        </html>`;

        res.send(output);
    }
});
module.exports = router;
