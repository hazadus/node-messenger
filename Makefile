BACKUP_PATH = /Users/hazadus/webbackup
BACKUP_DATE = $(shell date +%Y_%m_%d_%H-%M)
FULL_PATH = $(BACKUP_PATH)/messenger-$(BACKUP_DATE)
REMOTE_USER = root
REMOTE_IP = 212.113.117.162
REMOTE_DIR = /usr/projects/node-messenger

backup:
	rsync -arv --exclude=.git $(REMOTE_USER)@$(REMOTE_IP):$(REMOTE_DIR) $(FULL_PATH)