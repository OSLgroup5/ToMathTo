# ToMathTo ![ToMathTo](thumbnail.png)

[whenever you want, you can make Feature Requests](https://github.com/OSLgroup5/ToMathTo/issues)

## About this Project

this project is cross-platform Math online judge system. you can provide a math online judge server using this.

### What is Math Online Judge?

- math online judge is a system that end-user can solve, submit, graded in the webPage.
- this system also provide math online Competition system. end-user can compete each other on the web whenever a predetermined time by root
- A user authorized by super root can develop problems.

## How To install?

download this project and unzip

1. npm install
2. npm start

open webBrowser and go localhost:3000

## The Repository

This repository("ToMathTo") is where we(OSS team 5) develop the ToMathTo product together with the community. Not only do we work on code and issues here, we also publish our [plans](https://github.com/OSLgroup5/ToMathTo/wiki/Our-Plans) This source code is available to everyone under the standard [MIT LICENSE](https://github.com/OSLgroup5/ToMathTo/blob/main/LICENSE.md)

## Contributing

There are so much many ways in which you don't can't participate in this project, for example:

- [Submit Bug](https://github.com/OSLgroup5/ToMathTo/issues)
- [Submit Feature what you want(but need to easy to develop for me)](https://github.com/OSLgroup5/ToMathTo/issues)

## Feedback

- ask any question what you want any time (but not in dawn in korea) via [stackoverflow](https://stackoverflow.com/questions/)
- UpVote [popular feature requests](https://github.com/OSLgroup5/ToMathTo/labels/feature%20request)

## Related Projecs

- [DMOJ](https://github.com/DMOJ/online-judge)

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct.](https://opensource.microsoft.com/codeofconduct/) For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [asdffdsa@g.skku.edu](mailto:asdffdsa@g.skku.edu) with any additional questions or comments.
you can also read [CODE_OF_CONDUCT.md](https://github.com/OSLgroup5/ToMathTo/blob/main/CODE_OF_CONDUCT.md)

---

## detail features

### 로그인, 로그아웃, 회원가입 기능

> - 로그인 정보가 틀리면 alert를 띄움.
> - 로그인 성공시 새로운 session생성
> - 로그아웃 하면 session초기화.
> - 회원가입시 id가 중복되면 alert 띄우고 reject.
> - 문제 페이지, 대회페이지, 문제 제출, 문제 출제 등 각종 기능을 로그인 없이 사용하려하면 reject함

### 문제 풀기 기능

> - MathJax 을 이용한 수식 표현
> - 서버로 입력한 답을 전송하여 ac여부 확인, 답을 받아오는 동안은 waiting... 으로 표시, 받아온 후에는 wrong 또는 success
> - 맞았다면 unsolved tag가 solved로 바뀜
> - 과거에 이미 풀었던 문제는 자동으로 solved로 뜸, 서버 재시작 해도 반영
> - 만약 해당 문제가 contest에 포함된 문제면 contest에 들어가야지 볼 수 있음

### contest기능

> - contest가 진행중인 시간에만 대회 페이지, 대회에 포함된 문제 페이지에 접속 가능함
> - 대회 진행중에 문제를 풀면 페이지 새로고침 없이 자동으로 scoreboard가 갱신됨.
> - 한문제라도 대회 진행중에 맞춘 사람은 자동으로 scoreboard에 올라감
> - 동일한 문제에 대해 여러번 푼다고 점수가 오르는건 아님
> - 스코어 보드는 맞은 문제수가 많은 순으로 정렬됨.

### 문제 추가 기능

> - user 의 권한을 총 3가지로 나눔 (user, root, super root)
> - root 와 super root권한을 가진 사용자는 문제를 추가할 수 있음
> - 권한을 확인하여 "go to problem making page"버튼을 동적으로 생성
> - problem making page에서는 문제 정보(name, description, area, difficulty, answer)를 입력하여 문제를 추가할 수 있음 (권한 없으면 reject 됨)
> - problem name이 중복된다면 alert메세지를 띄우고 reject됨
> - 성공적으로 문제가 추가되면 서버 **재시작 없이** 페이지 새로고침하면 바로 적용됨

---

# **What the branch _databases_ contain?**

- **Databases for User**
    1. User Data
    2. Ranking
    3. Problem Records
- **Databases of Problems**
- **Appending Problem Algorithm**

---

## **What the files actually do?**

1. **_README.md_** : explain what the branch **_databases_** contain
2. **_info.json_** : contain the source of problems (for ease to find again)
3. **_problems.json_** : contain information of problems

    - problem number
    - problem name
    - problem description
    - problem area
    - problem difficulty (rank)
    - answer for problem

4. **_problems.txt_** : converted text file from _problems.json_
5. **_addProblem.js_**: Algorithm for appending problem by user
6. **_users.json_**: contain user data to replace userdata.json (made by Lee)
7. **_test.html_** : test the usage of problems.json on html
8. ~~**_userdata.json_** : contain user data~~
    - ~~user id~~
    - ~~solved problems by user~~
    - ~~user ranking~~
