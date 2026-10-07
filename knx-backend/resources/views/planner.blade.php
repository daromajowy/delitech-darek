<!doctype html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="knx-api" content="{{ url('/api') }}">
    <meta name="knx-panel" content="{{ url('/admin') }}">
    <meta name="knx-website" content="{{ config('app.website_url') }}">
    <base href="{{ asset('planner') }}/">
    <title>Projektant KNX | InteliSpaces</title>
    @php($entry = json_decode(file_get_contents(public_path('planner/.vite/manifest.json')), true)['index.html'])
    @foreach($entry['css'] ?? [] as $css)<link rel="stylesheet" href="{{ asset('planner/'.$css) }}">@endforeach
    <script type="module" src="{{ asset('planner/'.$entry['file']) }}"></script>
</head>
<body><div id="root"></div><noscript>Włącz JavaScript, aby otworzyć projektant KNX.</noscript></body>
</html>
