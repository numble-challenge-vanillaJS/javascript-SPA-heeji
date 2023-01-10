# ☀️ SPA로 신년 메시지 페이지 만들기

## 1. 제약사항

- ES6 문법 사용
- 상태관리 라이브러리 사용 불가
- express, axios 등 HTTP 관련, CSS 관련 라이브러리 사용 가능
  - 이미지는 [https://unsplash.com/documentation#get-a-random-photo](https://unsplash.com/documentation#get-a-random-photo)를 사용해 랜덤 이미지를 띄운다.
- 모바일 기준 디자인 (가로 넓이 640px)
- 이미지 업로드는 URL만 가능
- Git을 이용한 코드 버전 관리
- AWS or 네이버 클라우드로 배포

## 2. 요구사항

- [피그마 링크](https://www.figma.com/file/CMDdlDmOZo4GvxH1RHdCFt/HPNY-2023?node-id=0%3A1)
- Javascript로 Single Page Application을 구현

### 1) 홈페이지

- [ ] 등록된 글을 불러와 이미지, 제목, 내용을 보여줍니다.
- [ ] 작성하기 버튼을 누르면 글 작성 페이지로 이동합니다.

### 2) 글 작성 페이지

- [ ] 이미지 업로드를 누르면 랜덤 이미지 소스가 불러와진다.
- [ ] 글 제목을 입력할 수 있다. 50자 제한
- [ ] 글 내용을 입력할 수 있다. 500자 제한
- [ ] 제출 버튼을 누르면 글이 등록된다.
  - [ ] 스낵바 노출
  - [ ] 글 상세 페이지로 이동

### 3) 글 수정 페이지

- [ ] 입력되어있던 정보를 보여준다. (이미지, 제목, 내용)
- [ ] 글 제목을 수정할 수 있다.
- [ ] 글 내용을 수정할 수 있다.
- [ ] 제출 버튼을 누르면 글이 등록된다.
  - [ ] 스낵바 노출
  - [ ] 글 상세 페이지로 이동

### 4) 글 상세 페이지

- [ ] 등록된 글을 보여준다. 이미지, 제목, 내용, 작성 일자
- [ ] 수정 버튼을 누르면 글 수정 페이지로 이동한다.
- [ ] 삭제 버튼을 누르면 글이 삭제되고 스낵바가 노출된다.
- [ ] 댓글 입력창을 노출
  - [ ] 댓글을 입력하고 제출을 누르면 댓글이 등록된다.
  - [ ] 내가 등록한 댓글에 나오는 삭제를 누르면 댓글이 삭제된다.

## 3. 설계

### 1) 전체

- history API를 사용해서 라우터 4개를 만든다.
- js 파일을 webpack으로 번들링한다.
- typescript 설치하고 번들링 추가
- post를 관리할 repository를 만든다.

### 2) 홈페이지

- infinite scroll 처럼 보이도록.. 데이터는 다 받아오되 20개 정도씩 잘라서 로딩하는 방식으로
- 서버에서 받아온 글 목록은 post repository에 저장해둔다.
- Post component, PostList component를 만든다.
  - PostList는 id목록을 받는다.
  - id로 repository에서 select해와서 post를 Post component에 넘겨 그리도록 한다.
- 글 작성 버튼을 만들고 navigate 함수를 연결한다.

### 3) 글 수정 삭제 페이지

- PostCreateEdit component를 만든다.
- create모드면 모두 빈 값, edit 모드이면 id로 repository에서 기존 정보를 가져온다.
- 제목, 내용 validation 구현
- 제출을 누르면
  - create모드면 post api를 호출하고 repository insert하고 스낵바 노출
  - edit모드면 patch api를 호출하고 repository update하고 스낵바 노출

### 4) 글 상세 페이지

- 진입하면 get api 호출해서 글 상세 정보를 불러온다. 혹은 repository에서 id로 select
- 수정을 누르면 글 수정 페이지로 이동
- 삭제를 누르면 id로 delete api 요청
- 댓글 입력창 validation
- 댓글 저장을 누르면 post api를 요청하고 스낵바 노출
- 댓글 삭제를 누르면 delete api를 요청하고 스낵바 노출

## 4. API 정리

- [http://43.201.103.199/](http://43.201.103.199/) baseURL

- **`GET` /posts**
  - 게시글 전부 불러오기
  ```jsx
  {
  	"code": 200,
  	"data": {
  		"posts": [
  			{
  				"postId": "2",
  				"title": "글 제목",
  				"content": "글 내용 입니다",
  				"image": "https://img.freepik.com/premium-photo/small-tricolor-kitten-meowsfloor-
  room_457211-10960.jpg?w=1060",
  				"createdAt": "2023-01-05T17:29:24.216+00:00",
  				"updatedAt": "2023-01-05T17:29:24.216+00:00"
  			},
  			...
  		]
  	}
  }
  ```
- **`GET` /post/:postId**
  - postId에 해당하는 게시글 하나 불러오기
  ```jsx
  {
  	"code": 200,
  	"data": {
  		"post": {
  			"postId": "2",
  			"title": "게시글",
  			"content": "안녕하세요, 게시글 입니다",
  			"image": "https://img.freepik.com/premium-photo/small-tricolor-kitten-meowsfloor-
  room_457211-10960.jpg?w=1060",
  			"createdAt": "2023-01-05T17:29:24.216+00:00",
  			"updatedAt": "2023-01-05T17:29:24.216+00:00"
  },
  		"comments": [
  			{
  				"commentId": "1",
  				"postId": "1",
  				"content": "댓글입니다."
  			}
  		]
  	}
  }
  ```
- **`POST` /post**
  - 게시글 추가하기
    Request
  ```jsx
  {
  // body, all required
  	"title": "글 제목입니다",
  	"content": "글 내용입니다",
  	"image": "https://img.freepik.com/premium-photo/small-tricolor-kitten-meows-floorroom_
  457211-10960.jpg?w=1060"
  }
  ```
  Response
  ```jsx
  {
  	"code": 201,
  	"data": {
  	"post": {
  	"postId": "1",
  	"title": "글 제목입니다",
  	"content": "글 내용입니다",
  	"image": "https://img.freepik.com/premium-photo/small-tricolor-kitten-meowsfloor-
  room_457211-10960.jpg?w=1060"
  		},
  	"createdAt": "2023-01-05T17:29:24.216+00:00",
  	"updatedAt": "2023-01-05T17:29:24.216+00:00"
  	}
  }
  ```
- **`PATCH` /post/:postId**
  - 게시글 수정하기
    **Request**
  - 변경하려는 필드만 json 형태로 body에 입력
  ```json
  {
  	"title": "수정한 글 제목입니다",
  	"content": "수정한 글 작성입니다",
  	"image": "https://img.freepik.com/premium-photo/small-tricolor-kitten-meows-floorroom_
  457211-10960.jpg?w=1060"
  }
  ```
  **Response**
  ```json
  {
  	"code": 200,
  	"data": {
  		"post": {
  			"postId": "1",
  			"title": "수정한 글 제목입니다",
  			"content": "수정한 글 작성입니다"
  			"image": "https://img.freepik.com/premium-photo/small-tricolor-kitten-meowsfloor-
  room_457211-10960.jpg?w=1060",
  			"createdAt": "2023-01-05T17:29:24.216+00:00",
  			"updatedAt": "2023-01-05T17:29:24.216+00:00"
  		}
  	}
  }
  ```
- **`DELETE` /post/:postId**
- **`POST` /comment/:postId**
  request body
  ```json
  {
    "content": "댓글 내용"
  }
  ```
  **Response**
  ```jsx
  {
  	"code": 201,
  	"data": {
  		"commentId": "1",
  		"postId": "2",
  		"content": "댓글 내용"
  	}
  }
  ```
- **`DELETE` /comment/:commentId**
