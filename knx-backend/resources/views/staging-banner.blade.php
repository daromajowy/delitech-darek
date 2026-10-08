@if(app()->environment('staging'))
    @php
        $release = is_file(public_path('release.json')) ? json_decode(file_get_contents(public_path('release.json')), true) : [];
        $version = substr($release['commit'] ?? '', 0, 12);
    @endphp
    <details data-staging-banner style="position:fixed;bottom:12px;left:12px;z-index:2147483600;max-width:calc(100vw - 24px);padding:9px 13px;background:#713f12;color:#fff;border:1px solid #fbbf24;border-radius:10px;box-shadow:0 3px 16px #0003;font:13px/1.6 system-ui">
        <summary style="cursor:pointer;font-weight:700">InteliSpaces Staging · wersja {{ $version ?: 'przygotowywana' }}</summary>
        <p style="margin:8px 0">Środowisko testowe · osobna baza · e-maile wyłączone.</p>
        <p style="margin:8px 0">Wersja do publikacji: <code style="user-select:all">{{ $version }}</code></p>
        <a style="color:#fff;text-decoration:underline" target="_blank" rel="noopener" href="https://github.com/daromajowy/delitech-darek/actions/workflows/promote.yml">Publikuj sprawdzoną wersję na produkcji →</a>
    </details>
@endif
