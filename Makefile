all: up

up: database
	bun run dev

database:
	docker-compose up -d --force-recreate