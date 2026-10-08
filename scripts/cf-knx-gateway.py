"""Public-only gateway for CF's document-root-based PHP directory isolation."""
from pathlib import Path
import re

PUBLIC_FILES = {'planner', 'css', 'js', 'fonts', 'favicon.ico', 'robots.txt', 'release.json', 'deployment.json'}
SIGNATURE = 'InteliSpaces Laravel gateway'


def install(app, url):
    app = Path(app)
    allowed = Path('/home/horcwnciix/domains/intelispaces.pl/public_html')
    if app not in {allowed / 'knx/app', allowed / 'knx-staging/app'}:
        raise ValueError('Unexpected application gateway target')
    host = 'knx.intelispaces.pl' if app == allowed / 'knx/app' else 'knx-staging.intelispaces.pl'
    if url != 'https://' + host or app.is_symlink():
        raise ValueError('Unexpected application gateway host')
    root = app.parent
    if 'Require all denied' not in (app / '.htaccess').read_text():
        raise ValueError('Private application directory must reject HTTP access')
    contents = {
        'index.php': '<?php\n// ' + SIGNATURE + '\nrequire __DIR__.\'/app/public/index.php\';\n',
        '.htaccess': '# ' + SIGNATURE + '\nOptions -Indexes\nRewriteEngine On\n'
        + 'RewriteCond %{HTTP_HOST} !^' + re.escape(host) + '$ [NC]\nRewriteRule ^index\\.php$ - [F,END]\n'
        + 'RewriteCond %{HTTP_HOST} !^' + re.escape(host) + '$ [NC]\nRewriteRule ^ - [L]\n'
        + 'RewriteRule ^(?:app|cgi-bin)(?:/|$) - [F,END]\nRewriteRule (^|/)\\. - [F,END]\n'
        + 'RewriteCond %{HTTP:Authorization} .\nRewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]\n'
        + 'RewriteCond %{HTTP:x-xsrf-token} .\nRewriteRule .* - [E=HTTP_X_XSRF_TOKEN:%{HTTP:X-XSRF-Token}]\n'
        + 'RewriteCond %{HTTPS} !=on\nRewriteRule ^ ' + url + '%{REQUEST_URI} [R=301,L]\n'
        + 'RewriteRule ^(?:index\\.html)?$ index.php [L]\n'
        + 'RewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^ index.php [L]\n'
        + 'AddHandler application/x-httpd-php84 php\n'
        + '<IfModule mod_headers.c>\nHeader always set X-Robots-Tag "noindex, nofollow, noarchive"\n'
        + '<FilesMatch "(?:release|deployment)\\.json$">\nHeader always set Cache-Control "no-store"\n</FilesMatch>\n</IfModule>\n',
        '.user.ini': '; ' + SIGNATURE + '\nupload_max_filesize=12M\npost_max_size=24M\ndisplay_errors=Off\n',
    }
    for name, content in contents.items():
        path = root / name
        if path.exists() and SIGNATURE not in path.read_text():
            raise ValueError('Unrecognized existing gateway file: ' + name)
        temporary = root / (name + '.new')
        temporary.write_text(content)
        temporary.chmod(0o644)
        temporary.replace(path)
    for name in PUBLIC_FILES:
        path, target = root / name, app / 'public' / name
        if path.is_symlink():
            if path.readlink() != target:
                raise ValueError('Unexpected public asset link')
        elif path.exists():
            raise ValueError('Unrecognized existing public asset: ' + name)
        elif target.exists() or name in {'release.json', 'deployment.json'}:
            path.symlink_to(target, target_is_directory=target.is_dir())
