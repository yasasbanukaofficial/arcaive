.PHONY: dev stop

dev:
	@sudo systemctl start ollama
	@echo "Ollama started"
	@tmux new-session -d -s arcaive -n ollama 'ollama serve; read' \; \
		new-window -n backend 'cd $(PWD)/backend && ./mvnw spring-boot:run; read' \; \
		new-window -n frontend 'cd $(PWD)/frontend && npm run dev; read' \; \
		new-window -n agent 'cd $(PWD)/agent && source .venv/bin/activate && python main.py dev; read' \; \
		attach

stop:
	@tmux kill-session -t arcaive || true
	@sudo systemctl stop ollama
	@echo "Ollama stopped"