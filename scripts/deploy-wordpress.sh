set -eu
ROOT=/home/horcwnciix/domains/horcwnciix.cfolks.pl/public_html/wordpress
WORK=/home/horcwnciix/intelispaces-migration
test "$(id -un)" = horcwnciix
test "$(hostname)" = s78.cyber-folks.pl
test -f "$ROOT/wp-config.php"
cd "$WORK"
sha256sum wordpress-release.tar.gz
mkdir -p release
tar -xzf wordpress-release.tar.gz -C release
find release -name '*.php' -exec /opt/alt/php84/usr/bin/php -l {} \;
cp -a release/intelispaces "$ROOT/wp-content/themes/"
cp -a release/intelispaces-backend "$ROOT/wp-content/plugins/"
cd "$ROOT"
wp config set IS_PRIVATE_DIR "$ROOT/wp-content/intelispaces-private"
wp theme activate intelispaces
wp plugin activate intelispaces-backend
wp plugin install limit-login-attempts-reloaded two-factor --activate
wp plugin auto-updates enable limit-login-attempts-reloaded two-factor
wp eval-file "$WORK/seed-wordpress.php"
wp rewrite flush --hard
wp db check --defaults
wp core verify-checksums
wp plugin verify-checksums limit-login-attempts-reloaded two-factor
chmod 600 wp-config.php
if test -f wp-config-local.php; then chmod 600 wp-config-local.php; fi
chmod 600 "$WORK/backup-20261007/wordpress-clean.sql"
wp post list --post_type=page --fields=ID,post_title,post_status --format=table
