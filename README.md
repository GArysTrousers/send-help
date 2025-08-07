# TODO

## Fixes


## Features
- Session Delete Old
- LDAP - Delete non-exist users
- Only show/fetch recent/old tickets
- Delete tickets
- ticket: due date?
- permissions

# .env

```
SESSION_LENGTH=10000000000
LDAP_DOMAIN=my.lan
LDAP_URL=ldap://10.1.1.1:389
LDAP_USER=user@my.lan
LDAP_PASSWORD="@ssword"
LDAP_USER_BASES="OU=Staff,DC=a,DC=lan"
CONTENT_DIR=/home/server/data/content
DB_FILE=/home/server/data/db.sqlite
SMTP_HOST=outlook.office365.com
SMTP_PORT=587
SMTP_USER=email@outlook.com
SMTP_PASS="email@ssword"
SMTP_FROM="Help Desk <email@outlook.com>"
CUSTOM_LOGIN_TITLE="Help Desk"
CUSTOM_ORG_NAME="Big Business"
SITE_URL="help.mydomain.com"
```