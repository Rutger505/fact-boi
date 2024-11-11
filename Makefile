all: up

up: database
	bun run dev

down:
	docker-compose down

database:
	docker-compose up -d --force-recreate
