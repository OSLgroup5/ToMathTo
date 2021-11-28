// const { restElement } = require('@babel/types');
var express = require('express');
var router = express.Router();
var fs = require('fs');

// let idSet = JSON.parse(fs.readFileSync('user.json'), 'utf8');
let probSet = JSON.parse(fs.readFileSync('problem.json'), 'utf8');
// let solvedSet = JSON.parse(fs.readFileSync('user_solved.json'), 'utf8');

let contestSet = JSON.parse(fs.readFileSync('contest.json'), 'utf8');

router.get('/', (req, res, next) => {
    if (!req.session.logined)
    {
        res.redirect('/');
    }
    else
    {
        res.render('contest.ejs', {session:req.session});
    }
});
router.get('/getList', (req, res, next) => {
    // if (!req.session.logined) {
    //     res.redirect('/');
    // }
    // else 
    {
        console.log("getList");
        // res.send(contestSet);
        let sending = {};
        for (cname in contestSet) {
            console.log(cname);
            sending[cname] = {"name":cname, "length": contestSet[cname].problemList.length, "startTime": contestSet[cname].startTime, "endTime": contestSet[cname].endTime };
        }

        res.send(sending);
    }
});

let solvedSet = JSON.parse(fs.readFileSync('user_solved.json'), 'utf8');
function is_solved(user, x) {
    if (!(user in solvedSet)) return 0;
    let ret = solvedSet[user].find(y=>parseInt(x) === parseInt(y));
    if (ret) return 1;
    return 0;
}

router.get('/getProblemList', (req, res, next)=>
{
    // console.log("asdfsdfsdfdsfsdfsdfsdf");
    // console.log("asdfsdfsdfdsfsdfsdfsdf");
    // console.log("asdfsdfsdfdsfsdfsdfsdf");
    // console.log("asdfsdfsdfdsfsdfsdfsdf");
    // console.log("asdfsdfsdfdsfsdfsdfsdf");
    // console.log("asdfsdfsdfdsfsdfsdfsdf");
    // console.log(req.query);
    // console.log("get Prob List" + req.query.cname);
    if (!("cname" in req.query) || !(req.query.cname in contestSet))
    {
        res.end();
    }
    else
    {
        let cname = req.query.cname;
        let sttime = contestSet[cname].startTime;
        let edtime = contestSet[cname].endTime;
        let nowTime = new Date();
        if (nowTime < sttime)
        {
            // res.write("<script>alert('contest not start!')</script>");
            // res.write("<script>history.back()</script>");
            return;
        }
        let sending = {};
        console.log(contestSet[req.query.cname].problemList);
        for (let tt = 0; tt < contestSet[req.query.cname].problemList.length; ++tt)
        {
            let x = contestSet[req.query.cname].problemList[tt];
            console.log("x : " + x);
            console.log(probSet[x]);
            sending[x] = probSet[x];
            solvedSet = JSON.parse(fs.readFileSync('user_solved.json'), 'utf8');
            if (!req.session.logined) sending[x].status = -1;
            else sending[x].status = is_solved(req.session.user_id, x);
        }
        res.send(sending);
    }
});
router.get('/scoreboard', (req, res, next)=>
{
    if (!("cname" in req.query) || !(req.query.cname in contestSet))
    {
        res.end();
        return;
    }
    let cname = req.query.cname;
    // res.render('scoreboard.ejs', )
    // let cname = req.query.cname;
    console.log("let's send : " + cname);
    let sttime = contestSet[cname].startTime;
    let edtime = contestSet[cname].endTime;
    let len = contestSet[cname].problemList.length;
    let nowTime = new Date();
    // console.log(sttime);
    // console.log(nowTime);

    if (nowTime < new Date(sttime)) {
        res.write("<script>alert('contest not start!')</script>");
        res.write("<script>history.back()</script>");
        return;
    }
    res.render('scoreboard.ejs', { session: req.session, "sttime": sttime, "edtime": edtime, "cname": cname, "len":len });
    // res.send(output);
});
router.get('/getContestRank', (req, res, next)=>
{
    // console.log(req.query);
    // console.log("hello in getContestRank");
    if (!("cname" in req.query) || !(req.query.cname in contestSet))
    {
        res.end();
    }
    let path = "contestScore/"+req.query.cname+".json";
    let isEx = fs.existsSync(path);
    if (!isEx)
    {
        res.send(JSON.stringify([]));
        return;
    }

    let cname = req.query.cname;
    let D = JSON.parse(fs.readFileSync(path), 'utf8');
    let sending = [];


    console.log(D);
    for (key in D)
    {
        let user_id = key;
        console.log(key);
        let pushing = {};
        pushing.user_id = key;
        pushing.solved = D[user_id].length;
        pushing.list = {};
        console.log(pushing);
        for (let i = 0; i < contestSet[cname].problemList.length; ++i)
        {
            pushing.list[contestSet[cname].problemList[i]] = false;
        }
        for (let i = 0; i < D[user_id].length; ++i)
        {
            pushing.list[D[user_id][i]] = true;
        }

        sending.push(pushing);
        console.log(pushing);
    }
    console.log(sending);
    sending.sort((a, b)=>
    {
        return b.solved - a.solved;
    });
    console.log('yes!');
    res.send(JSON.stringify(sending));
});
router.get('/contest', (req, res, next)=>
{
    if (!req.session.logined)
    {
        res.redirect('/');
        return;
    }
    // console.log("reqed str : " + req.query.cname);
    // console.log(contestSet);
    // console.log(contestSet[req.query.cname]);
    // console.log("cname" in req.query);
	// console.log(req.query.cname in contestSet);
	// console.log("logggedd");
	
    if (!("cname" in req.query) || !(req.query.cname in contestSet))
    {
        res.redirect('/contest');
    }
    else
    {
        
        // let con = contestSet[req.query.cname];
        let cname = req.query.cname;
        console.log("let's send : " + cname);
        let sttime = contestSet[cname].startTime;
        let edtime = contestSet[cname].endTime;
        let nowTime = new Date();
        // console.log(sttime);
        // console.log(nowTime);
        
        if (nowTime < new Date(sttime))
        {
            res.write("<script>alert('contest not start!')</script>");
            res.write("<script>history.back()</script>");
            return;
        }
        res.render('contestProblemList.ejs', {session: req.session, "sttime": sttime,"edtime":edtime, "cname":cname});
        // res.send(output);
    }
});


module.exports = router;