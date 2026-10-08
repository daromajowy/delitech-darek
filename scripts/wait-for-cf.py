"""Confirm both applications and the completed paired deployment."""
import json
import os
import re
import time
import urllib.request


def read(url):
    request = urllib.request.Request(url, headers={'Cache-Control': 'no-cache'})
    with urllib.request.urlopen(request, timeout=15) as response:
        return json.load(response)


def main():
    commit = os.environ['RELEASE_COMMIT']
    environment = os.environ.get('RELEASE_ENV', 'staging')
    if not re.fullmatch(r'[a-f0-9]{40}', commit) or environment not in {'staging', 'production'}:
        raise ValueError('Invalid release identity or environment')
    urls = (['https://staging.intelispaces.pl', 'https://knx-staging.intelispaces.pl'] if environment == 'staging'
            else ['https://intelispaces.pl', 'https://knx.intelispaces.pl'])
    request_id = int(os.environ['DEPLOYMENT_ID']) if os.environ.get('DEPLOYMENT_ID') else None
    for attempt in range(36):
        try:
            markers = [read(url + '/release.json?commit=' + commit) for url in urls]
            ready = [read(url + '/deployment.json?commit=' + commit) for url in urls]
            if (all(value.get('commit') == commit and value.get('environment') == environment for value in markers)
                    and all(value.get('commit') == commit and value.get('environment') == environment
                            and value.get('status') == 'ready' and value.get('request_id') == request_id for value in ready)):
                print('CF ' + environment + ' website and KNX confirmed: ' + commit)
                return
        except (OSError, ValueError):
            pass
        time.sleep(20)
    raise SystemExit('Deployment not confirmed. Check the environment-specific CF controller log; production is never promoted automatically.')


if __name__ == '__main__':
    main()
