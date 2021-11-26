const { restElement } = require('@babel/types');
var express = require('express');
var router = express.Router();
var fs = require('fs');

let idSet = JSON.parse(fs.readFileSync('user.json'), 'utf8');
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
        res.render('contest.html');
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
router.get('/getProblemList', (req, res, next)=>
{
    console.log("get Prob List" + req.query.cname);
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
    var output = `<!doctype html>
    <html lang="en">
    
    <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    
        <title>${cname} scoreBoard!</title>
    </head>
    
    <body>
        <h1>${cname} scoreBoard!</h1>
        <div id="list">
    
        </div>
    </body>
    <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
    <script>
        $.ajax({
            url: "/contest/getContestRank?cname=${cname}",
            type: 'get',
            success: (str)=>
            {
                let tar = document.querySelector('#list');
                while (tar.hasChildNodes())
                {
                    tar.removeChild(tar.firstChild);
                }
                let arr = JSON.parse(str);

                console.log(arr);
                for (let i = 0; i < arr.length; ++i)
                {
                    let adding = document.createElement('div');
                    adding.classList.add('d-flex');
                    let uid = document.createElement('span');
                    uid.innerText = arr[i].user_id;
                    adding.appendChild(uid);
                    for (probNum in arr[i].list)
                    {
                        let per = document.createElement('div');
                        let col = arr[i].list[probNum]?"success":"secondary";
                        let TxT = arr[i].list[probNum]?"YES":"NOP";
                        per.innerHTML = \`<div class="bg-\${col} p-2 text-white">\${TxT}</div>\`;
                        adding.appendChild(per);
                    }
                    tar.appendChild(adding);
                }
            }
        });
        setInterval(() => {
            $.ajax({
                url: "/contest/getContestRank?cname=${cname}",
                type: 'get',
                success: (str)=>
                {
                    let tar = document.querySelector('#list');
                    while (tar.hasChildNodes())
                    {
                        tar.removeChild(tar.firstChild);
                    }
                    let arr = JSON.parse(str);
    
                    console.log(arr);
                    for (let i = 0; i < arr.length; ++i)
                    {
                        let adding = document.createElement('div');
                        adding.classList.add('d-flex');
                        let uid = document.createElement('span');
                        uid.innerText = arr[i].user_id;
                        uid.classList.add('w-25');
                        adding.appendChild(uid);
                        for (probNum in arr[i].list)
                        {
                            let per = document.createElement('div');
                            let col = arr[i].list[probNum]?"success":"secondary";
                            let TxT = arr[i].list[probNum]?"YES":"NOP";
                            per.innerHTML = \`<div class="bg-\${col} p-2 text-white">\${TxT}</div>\`;
                            per.classList.add('w-25');
                            adding.appendChild(per);
                        }
                        tar.appendChild(adding);
                    }
                }
            });
        }, 5000);
    </script>
    
    </html>`;
    
    

    res.send(output);
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
        var output = `<!doctype html>
        <html lang="en">
        
        <head>
            <!-- Required meta tags -->
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
        
            <!-- Bootstrap CSS -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
        
            <title>${cname}</title>
        </head>
        
        <body>
            <h1>${cname}</h1>
            <a class="btn btn-primary" href="/contest" role="button">goToContestList</a>
            <a class="btn btn-primary" href="/contest/scoreboard?cname=${cname}" role="button">goToScoreBoard</a>
            <div>
                <p class="fs-5">${sttime}</p>
                <p class="fs-5">${edtime}</p>
            </div>
            <div id="problemList">
        
            </div>
        </body>
        <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
        <script>
            $.ajax({
                    url: "/contest/getProblemList?cname=${cname}",
                    type: 'get',
                    success: (data) =>
                    {
                        console.log(data);
                        let list = document.querySelector("#problemList");
                        let keys = Object.keys(data);
                        for (let i = 0; i < keys.length; ++i)
                        {
                            let it = data[keys[i]];
                            let adding = document.createElement("div");
                            adding.classList.add("d-flex");
                            let probNum = document.createElement("div");
                            probNum.innerText=keys[i];
                            adding.onclick = ()=>
                            {
                                window.location.href = "/problem?probNum="+keys[i];
                            };
                            adding.appendChild(probNum);
                            let desc = document.createElement("div");
                            desc.innerText = it.name;
                            
                            adding.appendChild(desc);
                            list.appendChild(adding);
                        }
                    }
                });
        </script>
        </html>`;
        res.send(output);
    }
});


module.exports = router;