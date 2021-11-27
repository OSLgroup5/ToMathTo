# RedPen

[whenever you want, you can make Feature Requests](https://github.com/OSLgroup5/RedPen/issues)

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

This repository("RedPen") is where we(OSS team 5) develop the RedPen product together with the community. Not only do we work on code and issues here, we also publish our [plans](https://github.com/OSLgroup5/RedPen/wiki/Our-Plans) This source code is available to everyone under the standard [MIT LICENSE](https://github.com/OSLgroup5/RedPen/blob/main/LICENSE.md)

## Contributing

There are so much many ways in which you don't can't participate in this project, for example:

- [Submit Bug](https://github.com/OSLgroup5/RedPen/issues)
- [Submit Feature what you want(but need to easy to develop for me)](https://github.com/OSLgroup5/RedPen/issues)

## Feedback

- ask any question what you want any time (but not in dawn in korea) via [stackoverflow](https://stackoverflow.com/questions/)
- UpVote [popular feature requests](https://github.com/OSLgroup5/RedPen/labels/feature%20request)

## Related Projecs

- [DMOJ](https://github.com/DMOJ/online-judge)

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct.](https://opensource.microsoft.com/codeofconduct/) For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [asdffdsa@g.skku.edu](mailto:asdffdsa@g.skku.edu) with any additional questions or comments.
you can also read [CODE_OF_CONDUCT.md](https://github.com/OSLgroup5/RedPen/blob/main/CODE_OF_CONDUCT.md)

---

## detail features

로그인, 로그아웃, 회원가입 기능

문제 풀기 기능

> - MathJax 을 이용한 수식 표현
> - 서버로 입력한 답을 전송하여 ac여부 확인
> - 맞았다면 unsolved tag가 solved로 바뀜
> - 과거에 이미 풀었던 문제는 자동으로 solved로 뜸, 서버 재시작 해도 반영
> - 만약 해당 문제가 contest에 포함된 문제면 contest에 들어가야지 볼 수 있음

contest기능

> - contest가 진행중인 시간에만 대회 페이지, 대회에 포함된 문제 페이지에 접속 가능함
> - 대회 진행중에 문제를 풀면 페이지 새로고침 없이 자동으로 scoreboard가 갱신됨.
> - 한문제라도 대회 진행중에 맞춘 사람은 자동으로 scoreboard에 올라감
> - 동일한 문제에 대해 여러번 푼다고 점수가 오르는건 아님
> - 스코어 보드는 맞은 문제수가 많은 순으로 정렬됨.
# **What the branch _databases_ contain?**

-   **Databases for User**
    1. User Data
    2. Ranking
    3. Problem Records
-   **Databases of Problems**
-   **Appending Problem Algorithm**

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
