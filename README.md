# notesphere3

memo
NextJSはApp Routerを使用


開発モジュール一覧
各モジュールは、フロントエンド、バックエンド、データベースの作業を分けて、依存関係や必要なタスクを明確に記載。環境構築からリリースまでをカバーするよ。
モジュール 1: 環境構築
目的: 開発に必要なツールと環境をセットアップし、プロジェクトの土台を作る。
タスク:
フロントエンド環境:
Node.jsとnpm/yarnをインストール。

Next.jsプロジェクトをcreate-next-appで初期化（TypeScriptテンプレート使用）。

Tailwind CSSをNext.jsに統合（tailwindcssパッケージインストールと設定）。

Vitestをセットアップ（テスト環境構築、vitest.config.ts設定）。

バックエンド環境:
PHPとComposerをインストール。

Laravelプロジェクトをcomposer create-project laravel/laravelで初期化。

Laravel Sanctumをインストール・設定（認証用）。

PHPUnitの初期設定確認。

データベース環境:
MySQLをインストール・起動。

Laravelの.envファイルでMySQL接続設定（データベース作成、ユーザー設定）。

その他:
Gitリポジトリを初期化（.gitignore設定）。

プロジェクトフォルダ構成を整理（例: frontend/、backend/）。

成果物:
フロントエンド: npm run devでNext.jsが起動し、Tailwind CSSが動作。

バックエンド: php artisan serveでLaravelが起動、Sanctum設定完了。

データベース: MySQLに接続可能、テストデータベース作成済み。

依存関係: なし（最初に実行）。

モジュール 2: データベース設計と初期モデル
目的: Notion風アプリの基本データ構造を設計し、バックエンドでモデルとマイグレーションを作成。
タスク:
データベース設計:
基本テーブル設計（例: users, pages, blocks）。
users: ユーザー認証情報（Sanctum用）。

pages: Notionのページ単位（タイトル、作成者、作成日など）。

blocks: ページ内のコンテンツブロック（テキスト、リストなど）。

ER図を簡易作成（手書きやツール使用）。

バックエンド:
Laravelでモデルとマイグレーションを作成（php artisan make:model）。

マイグレーション実行（php artisan migrate）。

初期シーダーでテストデータ作成（php artisan db:seed）。

成果物:
MySQLにテーブル作成済み、テストデータ挿入済み。

Laravelでモデルとリレーション設定完了。

依存関係: モジュール 1（環境構築）。

モジュール 3: バックエンドAPI開発
目的: フロントエンドがデータを取得・操作できるRESTful APIを構築。
タスク:
バックエンド:
Laravelでコントローラ作成（php artisan make:controller）。

APIルート定義（routes/api.phpでエンドポイント設定）。
例: GET /api/pages, POST /api/pages, GET /api/blocks。

Sanctumで認証ミドルウェア設定（トークン認証）。

PHPUnitでAPIの単体テスト作成（認証、データ取得テスト）。

成果物:
PostmanやcurlでAPIエンドポイントが動作確認済み。

認証付きのAPIが動作（例: ログイン後にページ一覧取得）。

依存関係: モジュール 1、2。

モジュール 4: フロントエンド基本UI構築
目的: Notion風の基本的なUIをReact + Next.jsで実装。
タスク:
フロントエンド:
コンポーネント設計（例: PageList, BlockEditor, Sidebar）。

Tailwind CSSでNotion風のシンプルなデザイン実装。

Next.jsのページルーティング設定（例: /pages/[id]）。

Vitestで主要コンポーネントのテスト作成。

成果物:
静的なUIがブラウザで表示可能。

コンポーネント単位のテストが通る。

依存関係: モジュール 1。

モジュール 5: フロントエンドとバックエンドの統合
目的: フロントエンドからAPIを呼び出し、データを動的に表示・操作。
タスク:
フロントエンド:
AxiosやFetchでAPIリクエストを実装。

状態管理（ReactのuseState/useEffect、必要ならReact Query）。

認証フローの実装（Sanctumトークンの取得・保存）。

バックエンド:
CORS設定（Laravelでフロントエンドからのリクエスト許可）。

成果物:
フロントエンドでページ一覧やブロックの表示・編集が可能。

認証（ログイン/ログアウト）が動作。

依存関係: モジュール 1、2、3、4。

モジュール 6: テストとデバッグ
目的: アプリ全体の動作を確認し、エラーを修正。
タスク:
フロントエンド:
Vitestで統合テスト（API連携やUI動作確認）。

バックエンド:
PHPUnitでエンドツーエンドテスト。

全体:
手動テスト（ブラウザで操作確認）。

デバッグ（コンソールログやデバッガーでエラー修正）。

成果物:
主要機能がエラーなく動作。

テストカバレッジが一定以上（例: 80%）。

依存関係: モジュール 1〜5。

モジュール 7: デプロイ準備
目的: アプリを本番環境にデプロイする準備を整える。
タスク:
フロントエンド:
Next.jsをビルド（npm run build）。

VercelやNetlifyにデプロイ設定。

バックエンド:
Laravelの本番環境設定（.env更新、キャッシュクリア）。

HerokuやVPSにデプロイ設定。

データベース:
本番用MySQLデータベースをセットアップ。

マイグレーションとシーダー実行。

成果物:
本番環境でアプリが動作。

URLでアクセス可能。

依存関係


