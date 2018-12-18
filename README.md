# Naver-HackDay-Winter

Contents Feed Backend

- 요구사항
  - 개인별 뉴스 추천 기사를 전달하는데 있어 API 서버 IO를 최소화시켜라
  - 각 사용자별 컨텐츠들을 어떻게 효율적으로 관리를 할 것 인지?
  - 데이터를 시간순으로 정렬하여 나타나게 끔 구현 (중복 데이터 X )
  - 서버의 트래픽 초과로 인해 서버가 터졌을 때 대응은?
- 개발 스택
  - Node js(express)
  - Redis
  - Hystrix( 시간 부족으로 인해 사용 하지 못했습니다 ㅠ)

#### 요구사항 해결방안

- Redis 
  - In-memroy DB인 Redis를 이용하여 캐싱하는 방법 사용
  - 시간순 중복제거된 데이터를 사용자에게 보여주기 위하여 Sorted Set 사용
  - SortedSet은 사용자가 본 데이터를 확인하기 위해 저장 용도
  - 신규 데이터를 API 서버에서 가져오게되면 Redis 의 List에 저장해놓고 사용
- Node js
  - 싱글 쓰레드 비동기 기반인 Node를 이용하게되면 빠른 성능을 유지할수 있음
  - Spring과 비교했을 때 데이터를 전달해주는 용도로 API서버용으로 괜찮을것 같다고 생각이듬
  - 팀원과의 협업이 중요하다고 생각이 드는데 팀원들이 모두 Node를 쓰는것을 찬성함





# 실제 구현 

1. #### 페이지 로딩

   - URI

     | METHOD |       ROUTE       |
     | :----: | :---------------: |
     |  GET   | /contents/:userId |

   - 구현 방식

     1)  Redis에서 user:{userId}:contents의 키를 가진 SortedSet을 찾습니다.

     2)  SortedSet에 데이터가 만약 있다면 가장 최근 N ~ N- (페이지당 보여줄 갯수) 데이터를 보여줍니다.

     3)  SortedSet에 데이터가없으면 API서버를 호출해 데이터 80개를 받아 List에 저장을 합니다.

     - List는 javascript Array 내부함수인 sort를 이용해 svc_id기준으로 저장

     4)  List에 저장된 데이터중 가장 최근데이터 20개를 먼저 JSON 으로 전달

     5)  List의 데이터는 SortedSet에 다시 저장

2. 과거 데이터 더보기

   - URI

     | METHOD |             ROUTE              |
     | :----: | :----------------------------: |
     |  GET   | /contents/pastContents/:userId |

   - 구현 방식

     1)  user:{userId}:contents의 키를 가진 SortedSet 에서 가장 과거 데이터의 svc_id를 반환합니다.

     2)  두가지 경우

         - cookie의 갱신 시각이 5분이 지나지 않은경우

               1. user:{userId}:list 에서 가장 최근 데이터부터 역순으로 순회합니다.
               
               2. 가장 과거의 데이터인 svc_id 와 비교하여 더 과거인 데이터 20개를 리스트로 반환
               
               3. 사용된 데이터는 SortedSet에 삽입

         - cookie의 갱신 시각이 5분이 지난 경우

              1.  API 서버를 먼저 접속합니다.

              2. 초기데이터 설정과 같은 로직을 취합니다.

              3. 가장 과거 데이터의 svc_id값보다 더 과거인 데이터 20개를 리스트로 반환

              4. 사용된 데이터는 SortedSet에 삽입

3.  신규 데이터 더 보기

   - URI

     | METHOD |             ROUTE             |
     | :----: | :---------------------------: |
     |  GET   | /contents/newContents/:userId |

   - 구현 방식

     1)  user:{userId}:contents의 키를 가진 SortedSet 에서 가장 최근 데이터의 svc_id를 반환합니다.

     2)  두가지 경우

       - cookie의 갱신 시각이 5분이 지나지 않은경우
            1. user:{userId}:list 에서 가장 과거 데이터부터 역순으로 순회합니다.
            
            2. 가장 최근 데이터인 svc_id 와 비교하여 더 최근인 데이터 20개를 리스트로 반환
            
            3. 사용된 데이터는 SortedSet에 삽입

       - cookie의 갱신 시각이 5분이 지난 경우
            1. API 서버를 먼저 접속합니다.
            
            2. 초기데이터 설정과 같은 로직을 취합니다.
            
            3. 가장 최근 데이터의 svc_id값보다 더 최근인 데이터 20개를 리스트로 반환
            
            4. 사용된 데이터는 SortedSet에 삽입
