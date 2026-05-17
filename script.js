'use strict';

/* ==========================================================
   クイズデータ
   各オブジェクトの構造：
     question    : 問題文
     choices     : 選択肢の配列（4要素）
     answer      : 正解のインデックス（0始まり）
     explanation : 回答後に表示する解説文
   ========================================================== */
const questions = [
  {
    question: '日本の国鳥は何ですか？',
    choices: ['ツル', 'キジ', 'タカ', 'ワシ'],
    answer: 1,
    explanation: 'キジは日本の国鳥です。昔話「桃太郎」にも登場し、雄は美しい羽色で知られています。'
  },
  {
    question: '「吾輩は猫である」の著者は誰ですか？',
    choices: ['芥川龍之介', '太宰治', '夏目漱石', '川端康成'],
    answer: 2,
    explanation: '夏目漱石が1905年に発表した長編小説です。猫の視点から人間社会を風刺した作品です。'
  },
  {
    question: '地球の表面積のうち、海が占める割合として最も近いものはどれですか？',
    choices: ['約51%', '約61%', '約71%', '約81%'],
    answer: 2,
    explanation: '地球の表面の約71%を海が占めています。そのため地球は「水の惑星」とも呼ばれます。'
  },
  {
    question: '日本で最も面積が大きい都道府県はどこですか？',
    choices: ['岩手県', '長野県', '新潟県', '北海道'],
    answer: 3,
    explanation: '北海道の面積は約83,424km²で、日本全体の約22%を占める最大の都道府県です。'
  },
  {
    question: 'オリンピック五輪旗に使われていない色はどれですか？',
    choices: ['赤', '緑', '紫', '青'],
    answer: 2,
    explanation: '五輪旗の色は青・黄・黒・緑・赤の5色です。紫は含まれていません。これらの色と白地で世界中の国旗の色が表せるとされています。'
  },
  {
    question: '光の速さに最も近いのはどれですか？',
    choices: ['約3,000km/s', '約30万km/s', '約3万km/s', '約300万km/s'],
    answer: 1,
    explanation: '光の速さは真空中で約30万km/s（正確には約299,792km/s）です。1秒間に地球を約7.5周できる速さです。'
  },
  {
    question: '富士山の標高として正しいのはどれですか？',
    choices: ['3,556m', '3,667m', '3,776m', '3,990m'],
    answer: 2,
    explanation: '富士山の標高は3,776mで、日本一高い山です。静岡県と山梨県にまたがる活火山でもあります。'
  },
  {
    question: '日本の都道府県は全部でいくつありますか？',
    choices: ['43', '45', '47', '49'],
    answer: 2,
    explanation: '日本には1都（東京都）・1道（北海道）・2府（大阪府・京都府）・43県の合計47都道府県があります。'
  },
  {
    question: 'ひな祭りが行われるのは何月何日ですか？',
    choices: ['1月7日', '3月3日', '5月5日', '7月7日'],
    answer: 1,
    explanation: 'ひな祭りは3月3日（桃の節句）です。ひな人形を飾り、女の子の健やかな成長を願う行事です。'
  },
  {
    question: '世界最長の川として一般的に知られているのはどれですか？',
    choices: ['アマゾン川', '長江', 'ミシシッピ川', 'ナイル川'],
    answer: 3,
    explanation: 'ナイル川は全長約6,650kmで、世界最長の川として知られています。エジプトやスーダンなど11カ国を流れます。'
  }
];

/* ==========================================================
   定数・状態変数
   ========================================================== */
const TOTAL = questions.length; // 問題の総数（問題を追加しても自動で反映）

let currentIndex = 0;     // 現在表示中の問題番号（0始まり）
let score = 0;            // 正解数のカウンター
let answered = false;     // 二重回答防止フラグ（回答済みならtrue）

/* ==========================================================
   DOM要素の取得
   HTMLの要素をJavaScriptから操作するために変数に格納する。
   ページ読み込み時に一度だけ取得し、以降は使い回す。
   ========================================================== */
const quizScreen       = document.getElementById('quiz-screen');
const resultScreen     = document.getElementById('result-screen');
const questionNumber   = document.getElementById('question-number');
const progressFill     = document.getElementById('progress-fill');
const questionText     = document.getElementById('question-text');
const choicesContainer = document.getElementById('choices-container');
const feedback         = document.getElementById('feedback');
const feedbackText     = document.getElementById('feedback-text');
const explanationText  = document.getElementById('explanation-text');
const nextBtn          = document.getElementById('next-btn');
const resultIcon       = document.getElementById('result-icon');
const scoreText        = document.getElementById('score-text');
const scoreMessage     = document.getElementById('score-message');
const retryBtn         = document.getElementById('retry-btn');

/* ==========================================================
   関数①：loadQuestion
   currentIndex の問題をHTMLに描画する。
   【呼ばれるタイミング】
     - ページ読み込み時（初期化）
     - 「次の問題へ」ボタンを押したとき
     - 「もう一度挑戦する」ボタンを押したとき（restart経由）
   ========================================================== */
function loadQuestion() {
  const q = questions[currentIndex]; // 現在の問題データを取得
  answered = false;                  // 新しい問題では回答済みフラグをリセット

  // 問題番号とプログレスバーを更新
  questionNumber.textContent = `問題 ${currentIndex + 1} / ${TOTAL}`;
  progressFill.style.width = `${(currentIndex / TOTAL) * 100}%`;

  // 問題文を表示
  questionText.textContent = q.question;

  // 選択肢ボタンを生成して挿入
  // まず前の問題のボタンをすべて削除してから、新しいボタンを作成する
  choicesContainer.innerHTML = '';
  q.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice;
    btn.dataset.index = i; // どの選択肢かを識別するためにインデックスを保持
    btn.addEventListener('click', () => selectAnswer(i)); // クリック時に selectAnswer を呼ぶ
    choicesContainer.appendChild(btn);
  });

  // フィードバックエリアと「次の問題へ」ボタンを非表示にリセット
  feedback.className = 'feedback hidden';
  feedbackText.textContent = '';
  explanationText.textContent = '';
  nextBtn.classList.add('hidden');
}

/* ==========================================================
   関数②：selectAnswer
   ユーザーが選択肢をクリックしたときに呼ばれる。
   【処理の流れ】
     1. 二重回答を防止（answered フラグを確認）
     2. 全ボタンを無効化して追加クリックを受け付けなくする
     3. 正解ボタンを緑、誤答ボタンを赤に色付け
     4. 正誤を判定してスコアを加算
     5. フィードバック（正解/不正解＋解説）を表示
     6. 「次の問題へ」ボタンを表示
   ========================================================== */
function selectAnswer(selectedIndex) {
  if (answered) return; // すでに回答済みなら何もしない
  answered = true;

  const q = questions[currentIndex];
  const buttons = choicesContainer.querySelectorAll('.choice-btn');

  // 全ボタンを無効化し、正解・誤答に応じてクラスを付与して色を変える
  buttons.forEach(btn => {
    btn.disabled = true;
    const idx = Number(btn.dataset.index);
    if (idx === q.answer) {
      btn.classList.add('correct');   // 正解ボタンを緑色に
    } else if (idx === selectedIndex) {
      btn.classList.add('incorrect'); // 選んだ誤答ボタンを赤色に
    }
  });

  // 正誤判定：選択インデックスが正解インデックスと一致するか確認
  const isCorrect = selectedIndex === q.answer;
  if (isCorrect) score++;

  // フィードバックエリアのクラスを切り替えて背景色を正誤に合わせる
  feedback.classList.remove('hidden', 'correct-fb', 'incorrect-fb');
  feedback.classList.add(isCorrect ? 'correct-fb' : 'incorrect-fb');

  // 正誤メッセージと解説を表示
  feedbackText.textContent = isCorrect
    ? '⭕ 正解！'
    : `✖ 不正解  正解：${q.choices[q.answer]}`;
  explanationText.textContent = q.explanation;

  // 最終問題かどうかでボタンのラベルを切り替える
  const isLast = currentIndex === TOTAL - 1;
  nextBtn.textContent = isLast ? '結果を見る' : '次の問題へ →';
  nextBtn.classList.remove('hidden');
}

/* ==========================================================
   関数③：showResult
   全問終了後に結果画面を表示する。
   【処理の流れ】
     1. クイズ画面を非表示、結果画面を表示に切り替え
     2. プログレスバーを100%にする
     3. スコアに応じてアイコンとメッセージを選択して表示
   ========================================================== */
function showResult() {
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  progressFill.style.width = '100%'; // プログレスバーを満タンにする

  scoreText.textContent = `${TOTAL}問中 ${score}問 正解`;

  // スコアに応じてアイコンとメッセージを変える
  let icon, message;
  if (score === TOTAL) {
    icon = '🏆'; message = '満点です！素晴らしい知識をお持ちです！';
  } else if (score >= TOTAL - 1) {
    icon = '🎉'; message = 'とても良い結果です！あと一歩で満点でした。';
  } else if (score >= Math.ceil(TOTAL / 2)) {
    // Math.ceil で過半数（端数切り上げ）以上かを判定
    icon = '👍'; message = 'まずまずの結果です。もう少しで過半数正解でした。';
  } else {
    icon = '📚'; message = 'チャレンジを続けて知識を深めましょう！';
  }

  resultIcon.textContent = icon;
  scoreMessage.textContent = message;
}

/* ==========================================================
   関数④：restart
   「もう一度挑戦する」ボタンで呼ばれる。
   状態変数をすべてリセットして最初の問題から再スタートする。
   ========================================================== */
function restart() {
  currentIndex = 0;  // 問題番号をリセット
  score = 0;         // スコアをリセット
  answered = false;  // 回答フラグをリセット

  // 結果画面を非表示にしてクイズ画面に戻す
  resultScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  loadQuestion(); // 最初の問題を読み込む
}

/* ==========================================================
   イベントリスナーの登録
   ========================================================== */

// 「次の問題へ／結果を見る」ボタン：次の問題に進むか結果画面を表示する
nextBtn.addEventListener('click', () => {
  currentIndex++; // 問題番号を進める
  if (currentIndex < TOTAL) {
    loadQuestion(); // まだ問題が残っていれば次を表示
  } else {
    showResult();   // 全問終了したら結果画面へ
  }
});

// 「もう一度挑戦する」ボタン：restart関数を呼んで最初からやり直す
retryBtn.addEventListener('click', restart);

/* ==========================================================
   初期化
   ページ読み込み完了後に最初の問題を表示する
   ========================================================== */
loadQuestion();
