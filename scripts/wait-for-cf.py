"""Report success only after CF exposes the requested deployed commit."""
import json
import os
import time
import urllib.request

commit = os.environ['RELEASE_COMMIT']
url = 'https://horcwnciix.cfolks.pl/wordpress/wp-content/themes/intelispaces/release.json'
for attempt in range(24):
    try:
        request = urllib.request.Request(url + '?commit=' + commit, headers={'Cache-Control': 'no-cache'})
        with urllib.request.urlopen(request, timeout=15) as response:
            deployed = json.load(response)
        if deployed.get('commit') == commit:
            print('CF deployed ' + commit)
            break
    except (OSError, ValueError):
        pass
    time.sleep(20)
else:
    raise SystemExit('Package published, but deployment was not confirmed. Check the CF deployment status/log.')
