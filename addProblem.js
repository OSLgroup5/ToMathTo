//user에 의해 문제가 추가될 수 있는 알고리즘(변경이 필요한 요소: req obj, access obj의 숫자값, G obj, problems obj)

//req.session.user_id는 현재 로그인 중인 유저의 아이디라고 가정

//access 수준을 1~3까지 단계별로 표현 전체 코드 건들 필요없이 아래 오브젝트에서 숫자만 바꾸면 됨(얘는 script에서 전역변수로 선언해야 사용가능할 것 같아요)
let access = {
    user: 1,
    master: 2,
    root_master: 3,
};

//user data가 담긴 json 오브젝트를 G라고 가정하고 작성
/*
<G의 예시>
let G = {
  normalUserId: {
    password: "12341234",
    gunhan: access.user,
  },
  masterUserId: {
    password: "imtheking",
    gunhan: access.master,
  },
  rootMasterId: {
    password: "terminator",
    gunhan: access.root_master,
  },
};
*/

//문제들을 저장하는 json obj를 problems에 저장했다 가정
/*
<problems의 예시>
let problems = {
  20: {
    name: "dummy name",
    description: "dummy description",
    area: "dummy area",
    rank: "dummy rank",
    answer: "dummy answer",
  },
  number: 20,
};
*/

//각각의 입력칸은 input-title, input-description, input-area, input-rank, input-answer라는 아이디들로 지정되있다 가정.
//삽입 시 아래의 obj에서 값만 바꿔주면 됨
//1. user에게 문제 제목, 내용, 범위, 랭크, 답 받기
let input = {
    input_title: "#input-title",
    input_description: "#input-description",
    input_area: "#input-area",
    input_rank: "#input-rank",
    input_answer: "#input-answer",
};

//---------여기서부터 eventListener에 들어갈 함수 내용
let p_title = document.querySelector(input.input_title);
let p_description = document.querySelector(input.input_description);
let p_area = document.querySelector(input.input_area);
let p_rank = document.querySelector(input.input_rank);
let p_answer = document.querySelector(input.input_answer);

//2. user의 권한 확인
if (
    G[req.session.user_id].gunhan === access.master ||
    G[req.session.user_id].gunhan === access.root_master
) {
    //한 칸이라도 입력 안했다면 경고를 출력한 뒤 return without adding
    if (
        !p_title.value.length ||
        !p_description.value.length ||
        !p_area.value.length ||
        !p_rank.value.length ||
        !p_answer.value.length
    ) {
        alert("빈 칸이 있습니다.");
        return;
    }

    //3-1. 받은 데이터를 다음 문제번호에 대응하는 값으로 problems.json에 삽입.
    problems.number++;
    problems[problems.number].name = p_title.value;
    problems[problems.number].description = p_description.value;
    problems[problems.number].area = p_area.value;
    problems[problems.number].rank = p_rank.value;
    problems[problems.number].answer = p_answer.value;

    //all clear
    p_title.value = "";
    p_description.value = "";
    p_area.value = "";
    p_rank.value = "";
    p_answer.value = "";
}
//3-2. 권한이 없다면 경고창 띄움
else {
    //all clear
    p_title.value = "";
    p_description.value = "";
    p_area.value = "";
    p_rank.value = "";
    p_answer.value = "";

    alert("권한이 허용되지 않았습니다.");
}
