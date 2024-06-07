<p align="left"><img src = "public/images/INU.png"  width=40%></p>

#### Dweb ❌ Incheon National University (INU)

## 🌟 Base code for the term project in Web class

⚠️ Copyright © 2024. _Dweb_ All Rights Reserved.

<p align="right"><img src = "public/images/Dweb.png" width=40%></p>
# chatting-Web



24.06.03 프로젝트 제출이후 코드 수정 없습니다.

프로젝트 구조

클라이언트(react)

	최신 React 버전 사용
	Babel - jsx -> js 문법 변환
	Webpack - JS 모듈 번들링 및 코드 모듈화, 성능 최적화 - 다시 검색
	Socket.io-cient -> 실시간 양방향 통신
	Axios -> http 프로토콜 처리 라이브러리

소켓 (실시간 통신) socket.io -(client, server)
  
서버(express)
	express.js 사용 서버 설정 
	Json, Rest API 구현
	Socket.io 사용 실시간 통신 처리

데이터베이스 (SQLite)
	SQLite 사용 -> 사용자,채팅방,메세지 데이터 저장


 기능별 처리 방식 요약
1. 회원가입 및 로그인
* REST API를 통한 통신: 클라이언트에서 서버로 HTTP POST 요청을 보내 회원가입 및 로그인 처리를 합니다.
* 비동기 처리: async/await 구문을 사용하여 HTTP 요청을 비동기적으로 처리합니다.
  
2. 채팅방 검색 및 생성
* REST API를 통한 통신: 클라이언트에서 서버로 HTTP GET 요청을 보내 채팅방을 검색하고, HTTP POST 요청을 보내 채팅방을 생성합니다.
* 비동기 처리: async/await 구문을 사용하여 HTTP 요청을 비동기적으로 처리합니다.
  
3. 채팅 메시지 전송 및 수신
* 소켓을 통한 실시간 통신: 클라이언트와 서버가 socket.io를 사용하여 실시간 양방향 통신을 구현합니다. 클라이언트에서 소켓 이벤트(sendMessage, join)를 발생시키고, 서버에서 이를 처리한 후 다시 클라이언트로 메시지를 전송합니다.
* Message 브로드캐스트 -> 모든회원
* 비동기 처리: 클라이언트에서 메시지 전송 시 Promise, async/await을  사용하여 비동기적으로 처리합니다.
  
4. 채팅방 목록 가져오기
* REST API를 통한 통신: 클라이언트에서 서버로 HTTP GET 요청을 보내 현재 존재하는 모든 채팅방 목록을 가져옵니다.
* 소켓을 통한 실시간 통신: 클라이언트와 서버가 socket.io를 사용하여 실시간 양방향 통신을 구현합니다.클라이언트에서 소켓 이벤트(fetchAllChatRooms, ,handleMessageReceived)를 발생시키고, 서버에서 이를 처리한 후 현재 존재하는 모든 채팅방 목록, 최신 메세지를 다시 클라이언트로 전송합니다.

비동기 처리:클라이언트에서 채팅방 목록을 요청할 때 Promise , async/await을  사용하여 비동기적으로 처리합니다.





추가기능 요약:
1. SQLite 데이터베이스 사용
2. promise 객체 (메세지 전송), async -await (promise객체 자동생성) - API 호출,db와의 비동기 통신 
3. 네트워킹 기능 개발 - REST API 를 사용해 백엔드 서버와 Json 형식으로 통신
   (api - server - db)
                 - 웹소켓을 통한 양방향 통신
