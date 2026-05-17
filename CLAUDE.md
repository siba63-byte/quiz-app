# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

一般常識クイズアプリ。HTML/CSS/JavaScript のみで構成されたフロントエンドアプリ（サーバー不要）。

## 技術スタック

- HTML5
- CSS3
- JavaScript (Vanilla JS、フレームワークなし)

## 開発・動作確認

ビルドツール不要。ブラウザで直接 `index.html` を開くか、ローカルサーバーを起動して確認する。

```bash
# Python でローカルサーバーを起動（ポート 8000）
python -m http.server 8000

# Node.js の場合
npx serve .
```

## アーキテクチャ

### ファイル構成方針

- `index.html` — アプリのエントリーポイント
- `css/` — スタイルシート
- `js/` — JavaScript ロジック（機能ごとにファイルを分割）
- `data/` — クイズ問題データ（JSON 形式）

### データ構造

クイズ問題は `data/questions.json` に JSON で管理する。各問題の構造：

```json
{
  "id": 1,
  "question": "問題文",
  "choices": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
  "answer": 0,
  "explanation": "解説文"
}
```

`answer` は `choices` 配列のインデックス（0始まり）。

### JS モジュール方針

グローバル汚染を避けるため、各 JS ファイルは即時関数（IIFE）またはモジュールスコープで記述する。

## GitHubリポジトリ

https://github.com/siba63-byte/quiz-app.git

## 業務ルール

- ファイルの削除・上書き前には必ず確認を求めること
- 作業が完了したら `Claude_Work/作業ログ/` フォルダに実施内容を追記すること
