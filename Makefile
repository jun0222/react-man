.PHONY: dev build c cp push

dev:
	npm run dev

build:
	npm run build

# コミットのみ
# 使い方: make c t=feat s=ui m="ヘッダー修正"
# type : feat / fix / style / refactor / docs / chore / ci / perf
# scope: ui / post / tag / routing / deps / ci / config など
c:
	git add -A
	git commit -m "$(t)($(s)): $(m)"

# コミット & push（自動デプロイ）
cp:
	git add -A
	git commit -m "$(t)($(s)): $(m)"
	git push origin main
