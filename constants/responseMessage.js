module.exports = {
    NULL_VALUE: '필요한 값이 없습니다',
    OUT_OF_VALUE: '파라미터 값이 잘못되었습니다',
    TOO_MUCH_LONG_VALUE: '파라미터 값이 너무 깁니다',
  
    // 회원가입
    CREATED_USER: '회원 가입 성공',
    DELETE_USER: '회원 탈퇴 성공',
    ALREADY_EMAIL: '이미 사용중인 이메일입니다.',
    DIFFRERENT_PASSWORD: '비밀번호와 비밀번호 확인이 일치하지 않습니다',
    SIGNUP_OK: '가입 가능합니다',
    SIGNUP_NOT_OK: '가입 불가능합니다',
  
    // 로그인
    LOGIN_SUCCESS: '로그인 성공',
    LOGIN_FAIL: '로그인 실패',
    ALREADY_LOGIN: '이미 로그인 중입니다.',
    NEED_LOGIN: '로그인이 필요한 서비스 입니다.',
    NO_USER: '존재하지 않는 회원입니다.',
    MISS_MATCH_PW: '비밀번호가 맞지 않습니다.',
    INVALID_EMAIL: '이메일 형식을 확인해주세요.',

    // 로그아웃
    LOGOUT_SUCCESS: '로그아웃 성공',
    LOGOUT_FAIL: '로그아웃 실패',

    // 프로필 조회
    READ_PROFILE_SUCCESS: '프로필 조회 성공',
  
    // 유저
    READ_ONE_USER_SUCCESS: '유저 조회 성공',
    READ_ALL_USERS_SUCCESS: '모든 유저 조회 성공',
    UPDATE_ONE_USER_SUCCESS: '유저 수정 성공',
    DELETE_ONE_USER_SUCCESS: '유저 삭제 성공',
    DELETE_INFO_SUCCESS: '유저 정보 삭제 성공',
    NICKNAME_EXIST: '닉네임이 중복되었습니다',
    ACCESS_TOKEN_SUCCESS: 'access token 발급 성공',

    //친구
    READ_FRIENDS_LIST_SUCCESS: '친구 목록 조회 성공',
    READ_FIND_USERS_SUCCESS: '사용자 검색 조회 성공',
    READ_FRIEND_REQUESTS_SUCCESS: '친구 요청 목록 조회 성공',
    REQUEST_FRIEND_SUCCESS: '친구 신청 성공',
    UPDATE_FRIEND_SUCCESS: '친구 요청 수락 성공',
    DELETE_FRIEND_SUCCESS: '친구 삭제 성공',
    NO_FRIEND: '존재하지 않는 친구 관계입니다.',
    FRIEND_EXIST: '이미 존재하는 친구 요청입니다.',
    
    // ConsumptionHistory 
    ADD_ONE_POST_SUCCESS: '포스트 추가 성공',
    READ_ONE_POST_SUCCESS: '포스트 조회 성공',

    READ_CONSUMPTION_ID_SUCCESS: '아이디별 소비 내역 조회 성공',
    READ_CONSUMPTION_DATE_SUCCESS: '일별 소비 내역 조회 성공',
    READ_CALENDAR_DATE_TOTAL_AMOUNT: '총 지출 조회 성공',
    READ_CALENDAR_DATE_SUCCESS: '월별 캘린더 조회 성공',
    READ_FRIEND_CALENDAR_SUCCESS: '친구 캘린더 피드 조회 성공',

    READ_ALL_POSTS_SUCCESS: '모든 포스트 조회 성공',
    UPDATE_ONE_POST_SUCCESS: '포스트 수정 성공',
    DELETE_ONE_POST_SUCCESS: '포스트 삭제 성공',
    NO_POST: '존재하지 않는 포스트입니다.',

    // 좋아요/ 싫어요
    ADD_EMOTICON_SUCCESS: '공감 성공',
    DELETE_CMOTICON_SUCCESS: '공감 취소 성공',
    DELETE_CMOTICON_FAIL: '공감 취소 실패',
    EMOTICON_EXIST:'이미 공감을 한 게시물입니다',
    GET_EMOTION_BY_USERID:'이모티콘 조회 성공',
    CHANGE_EMOTION_SUCCESS:'이모티콘 변경 성공',

    // 댓글
    ADD_ONE_COMMENT_SUCCESS: '댓글 추가 성공',
    READ_ALL_COMMENT_SUCCESS: '댓글 조회 성공',
    UPDATE_ONE_COMMENT_SUCCESS: '댓글 수정 성공',
    DELETE_ONE_COMMENT_SUCCESS: '댓글 삭제 성공',
    NO_COMMENT: '삭제된 댓글입니다.',
    CANT_COMMENT: '대댓글을 달 수 없는 댓글입니다.',
  
    // 파일 업로드
    ONLY_IMAGE_AVAILABLE: '이미지만 업로드 가능합니다',
  
    // 서버 내 오류
    INTERNAL_SERVER_ERROR: '서버 내 오류',
  
    // 토큰
    TOKEN_EXPIRED: '토큰이 만료되었습니다.',
    TOKEN_INVALID: '토큰이 유효하지 않습니다.',
    TOKEN_EMPTY: '토큰이 없습니다.',
    NOT_TOKEN_EXPIRED: '토큰이 만료되지 않았습니다.',
  
    // 인증
    NO_AUTH_HEADER: 'Authorization 헤더가 없습니다.',
    NO_AUTH: '인증되지 않았습니다',
  
  };