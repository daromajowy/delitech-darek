"""Report success only after CF exposes the requested deployed commit."""
import json
import os
import time
import urllib.request

commit = os.environ['RELEASE_COMMIT']
urls = [
    'https://horcwnciix.cfolks.pl/wordpress/wp-content/themes/intelispaces/release.json',
    'https://horcwnciix.cfolks.pl/projektant-knx/release.json',
]
for attempt in range(24):
    try:
        deployed = []
        for url in urls:
            request = urllib.request.Request(url + '?commit=' + commit, headers={'Cache-Control': 'no-cache'})
            with urllib.request.urlopen(request, timeout=15) as response:
                deployed.append(json.load(response).get('commit'))
        if all(value == commit for value in deployed):
            print('CF deployed WordPress and KNX: ' + commit)
            break
    except (OSError, ValueError):
        pass
    time.sleep(20)
else:
    raise SystemExit('Package published, but deployment was not confirmed. Check the CF deployment status/log.')
