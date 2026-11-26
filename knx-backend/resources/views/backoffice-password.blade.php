<!doctype html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow">
    <title>Potwierdź dostęp do backoffice · InteliSpaces</title>
    <link rel="icon" type="image/svg+xml" href="{{ asset('planner/brand/favicon.svg') }}">
    <style>
        *{box-sizing:border-box}body{margin:0;background:#f4f6f5;color:#193040;font:16px/1.5 system-ui,sans-serif;min-height:100dvh;display:grid;place-items:center;padding:24px}
        main{width:100%;max-width:460px;padding:36px;background:#fff;border:1px solid #dde4e3;border-radius:16px;box-shadow:0 12px 40px #1930400a}
        h1{font-size:26px;line-height:1.2;margin:28px 0 12px;letter-spacing:-.5px}p{color:#586b76;margin:0 0 22px}.account{overflow-wrap:anywhere;font-size:14px}
        label{display:block;font-size:14px;font-weight:600;margin-bottom:8px}input{width:100%;font:inherit;padding:12px;border:1px solid #bac9cc;border-radius:8px;min-height:48px}input:focus-visible{outline:2px solid #00889a;outline-offset:2px}
        button{width:100%;margin-top:20px;background:#193040;color:#fff;border:0;border-radius:8px;padding:13px;font:600 15px system-ui;cursor:pointer;min-height:48px}button:hover{background:#25485c}button:focus-visible,a:focus-visible{outline:2px solid #00889a;outline-offset:3px}
        .error{font-size:14px;color:#a62629;margin:8px 0 0}.back{display:block;text-align:center;color:#167381;font-size:14px;margin-top:24px;text-underline-offset:4px}.note{font-size:13px;margin:24px 0 0;padding-top:20px;border-top:1px solid #e2e8e7}
        @media(max-width:480px){body{padding:16px}main{padding:26px 22px}}
    </style>
</head>
<body>
<main>
    @include('brand')
    <h1>Potwierdź dostęp<br>do backoffice</h1>
    <p>Wpisz ponownie hasło do swojego konta. Potwierdzenie będzie ważne przez 3 dni w tej przeglądarce.</p>
    <p class="account">Konto: <strong>{{ auth()->user()->email }}</strong></p>
    <form method="POST" action="{{ route('backoffice.password.confirm') }}">
        @csrf
        <input type="hidden" name="username" autocomplete="username" value="{{ auth()->user()->email }}">
        <label for="password">Hasło do konta</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required maxlength="1024" autofocus @error('password') aria-invalid="true" aria-describedby="password-error" @enderror>
        @error('password')<p id="password-error" class="error" role="alert">{{ $message }}</p>@enderror
        <button type="submit">Przejdź do backoffice</button>
    </form>
    <a class="back" href="{{ route('planner') }}">← Wróć do konfiguratora KNX</a>
    <p class="note">To dodatkowe potwierdzenie dostępu do panelu. Możesz nadal pracować w konfiguratorze.</p>
</main>
</body>
</html>
