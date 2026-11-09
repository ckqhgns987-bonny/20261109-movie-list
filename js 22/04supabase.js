// Supabase를 JavaScript에서 쉽게 사용할 수 있도록 라이브러리를 가져옵니다.
// import를 사용하므로 HTML에서는 script type="module"로 연결해야 합니다.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 실습 1: Supabase 프로젝트 URL을 입력합니다.
// Supabase 프로젝트마다 고유한 주소가 있습니다.
const SUPABASE_URL = "https://ytspdvqyqwqzznccdkks.supabase.co";

// 실습 2: Supabase anon key를 입력합니다.
// ☆ amon key 대신에 service role key (secret) 로 작성해야 한다! 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0c3BkdnF5cXdxenpuY2Nka2tzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDE1ODUzMCwiZXhwIjoyMTA5NzM0NTMwfQ.XsWFTbo7OEGQRM_RAmKf-Qvf0OemtnTrnK2I1iiymsw";

// Supabase와 통신할 수 있는 연결 도구를 만듭니다.
// 앞으로 supabase라는 이름으로 데이터 조회/추가/수정/삭제를 실행합니다.
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// HTML에서 "저장된 영화 조회" 버튼을 찾습니다.
const loadSavedBtn = document.querySelector("#loadSavedBtn");

// HTML에서 저장된 영화 목록을 보여줄 영역을 찾습니다.
const savedMovieList = document.querySelector("#savedMovieList");

// 버튼을 클릭하면 loadSavedMovies 함수를 실행합니다.
loadSavedBtn.addEventListener("click", async function () {
  // await는 영화 목록을 다 불러올 때까지 기다리겠다는 의미입니다.
  await loadSavedMovies();
});

// 저장된 영화 목록을 Supabase에서 가져오는 함수입니다.
async function loadSavedMovies() {
  // 데이터를 불러오는 중임을 사용자에게 먼저 보여줍니다.
  savedMovieList.innerHTML = "<p>저장된 영화를 불러오는 중입니다.</p>";

  // 실습 3: movies 테이블에서 데이터를 조회합니다.
  // from("테이블명")는 특정 테이블을 선택한다는 뜻입니다.
  // select("*")는 모든 컬럼을 가져오겠다는 뜻입니다.
  // order("id", { ascending: false })는 id 기준으로 최신 데이터가 위에 오게 정렬합니다.
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .order("id", { ascending: false });

  // error가 있으면 Supabase 요청이 실패한 것입니다.
  // 예: 테이블 이름 오류, RLS 정책 문제, key 오류 등이 있을 수 있습니다.
  if (error) {
    // 개발자도구 Console에서 자세한 오류를 확인합니다.
    console.log(error);

    // 사용자 화면에는 간단한 실패 메시지를 보여줍니다.
    savedMovieList.innerHTML = "<p>데이터를 불러오지 못했습니다.</p>";

    // return은 여기서 함수를 멈추겠다는 의미입니다.
    return;
  }

  // data에는 Supabase에서 가져온 영화 목록 배열이 들어 있습니다.
  // 가져온 데이터를 화면에 출력하는 함수로 넘깁니다.
  renderSavedMovies(data);
}

// 새 영화 데이터를 Supabase에 추가하는 함수입니다.
async function addMovie() {
  // 실습 4: 선택한 테이블에 새 데이터를 추가합니다.
  // insert() 안에는 저장할 데이터를 객체 형태로 작성합니다.
  const { error } = await supabase
    .from("테이블명")
    .insert({
      title: "새로 저장한 영화",
      release_date: "2026-05-10",
      poster_url: "https://placehold.co/500x750?text=Movie",
      memo: "insert()로 저장한 데이터입니다."
    });

  // 저장 중 오류가 발생한 경우입니다.
  if (error) {
    // 개발자도구 Console에서 오류 내용을 확인합니다.
    console.log(error);

    // 사용자에게 저장 실패를 알려줍니다.
    alert("저장에 실패했습니다.");

    // 오류가 있으므로 여기서 함수를 멈춥니다.
    return;
  }

  // 저장이 성공했을 때 사용자에게 알려줍니다.
  alert("영화를 저장했습니다.");

  // 저장 후 화면의 목록을 다시 불러옵니다.
  // 새로 저장한 영화가 화면에 보이게 하기 위해서입니다.
  await loadSavedMovies();
}

// Supabase에서 가져온 영화 목록을 화면에 카드로 출력하는 함수입니다.
function renderSavedMovies(movies) {
  // 기존 화면 내용을 지웁니다.
  savedMovieList.innerHTML = "";

  // movies는 여러 영화가 들어 있는 배열입니다.
  // forEach는 배열 안의 영화를 하나씩 꺼내 반복합니다.
  movies.forEach(function (movie) {
    // article 태그를 새로 만듭니다.
    const card = document.createElement("article");

    // CSS에서 카드 디자인을 적용하기 위해 class 이름을 붙입니다.
    card.className = "movie-card";

    // 카드 안에 이미지, 제목, 개봉일, 메모, 버튼을 넣습니다.
    // movie.poster_url, movie.title 같은 값은 Supabase 테이블 컬럼명과 같아야 합니다.
    card.innerHTML = `
      <img src="${movie.poster_url}" alt="${movie.title} 포스터">
      <h2>${movie.title}</h2>
      <p>개봉일: ${movie.release_date}</p>
      <p>메모: ${movie.memo || "없음"}</p>
      <button class="btn small-btn" type="button">샘플 저장</button>
    `;

    // 방금 만든 카드 안에서 버튼을 찾습니다.
    const saveBtn = card.querySelector("button");

    // 카드 안의 버튼을 클릭하면 addMovie 함수가 실행됩니다.
    saveBtn.addEventListener("click", addMovie);

    // 완성된 카드를 화면에 추가합니다.
    savedMovieList.appendChild(card);
  });
}