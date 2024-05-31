const express = require('express');
const router = express.Router();
const findUserListGET = require('../../controllers/friends/findUserListGET');
const friendRequestPOST = require('../../controllers/friends/friendRequestPOST');
const friendRequestAcceptPATCH = require('../../controllers/friends/friendRequestAcceptPATCH');
const friendDeletePOST = require('../../controllers/friends/friendDeletePOST');
const receivedFriendRequestsListGET = require('../../controllers/friends/receivedFriendRequestsListGET');
const myFriendsListGET = require('../../controllers/friends/myFriendsListGET');

router.post('/requests', friendRequestPOST);//3
router.patch('/requests', friendRequestAcceptPATCH);//5
router.get('/requests/:userid', receivedFriendRequestsListGET); //4
router.post('/requests/delete', friendDeletePOST);//6
router.get('/search', findUserListGET);//2
router.get('/:userid', myFriendsListGET); //1

/* 흐름 순서

1) 내 로그인한 userid를 기준으로 지금 현재 친구 목록 조회 (= myFriendsListGET) ok

2) 그 다음이 친구 이름 검색인데 여기서도 쿼리가 userid 와 nickname인데 (= findUserListGet), 
-> nickname을 기반으로 user 서비스에 통신해서 userid를 가져와.

그거랑 친구 nickname을 같이 보내는 이유가 뭐지?
-> 쿼리 담아주는 걸 user서비스 통신으로 가져올 친구의 userid 
애초에 처음부터 userid를 클라이언트에 넣어줘야하나?
클라이언트가 모르는데 어떻게 쿼리문 담아서 줘? 
-> db 테이블 friendid user1id user2id accepted

3) 친구 신청 목록 조회(= receivedFriendRequestsListGET) 는 내 userid를 query로 주는게 맞지. ok
-> 여기는 내 테이블 목록에 저장되어있는 거 가져오기만 하면 됨

4) 친구 신청(= friendRequestPOST)은 sender(=현재 내 ), receiverid 각각 필요.  
-> 여기서 테이블에 저장됨.

5) 친구 신청 수락(=friendRequestAcceptPATCH) 
-> accepted 1로 수정. 여기도 우리 테이블
6) 친구 신청 거절(=friendDeletePOST)
-> 거절도 우리 테이블 사용하는거임.

궁금한거 
1: userid는 언제 friend db에 저장되나? 

2: 내 db에 저장되는 과정이 어떻게 되는거지? -> 친구 신청하면 수락하든 안하든 

3: 내가 user 서비스에 통신을 요청해야하는 때가 언제인가? -> 친구의 userid와 닉네임이 필요할 때 (=findUserListGet)


 */
module.exports = router;