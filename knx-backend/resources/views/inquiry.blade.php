<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>{{ $inquiry->reference }} · InteliSpaces</title>
<style>body{font:16px/1.6 system-ui;background:#f4f6f5;color:#17211c;margin:0}main{max-width:900px;margin:32px auto;padding:24px;background:white;border-radius:16px}table{width:100%;border-collapse:collapse}th,td{padding:12px;text-align:left;vertical-align:top;border-bottom:1px solid #ddd;overflow-wrap:anywhere}td{white-space:pre-wrap}a{color:#0e6655}</style></head>
<body><main><a href="{{ route('filament.admin.resources.inquiries.index') }}">← Zapytania ze strony</a><h1>{{ $inquiry->reference }}</h1><p>{{ $inquiry->created_at->timezone('Europe/Warsaw')->format('d.m.Y H:i') }}</p><table>
@php($labels = ['kind'=>'Rodzaj','name'=>'Imię i nazwisko / firma','email'=>'E-mail','phone'=>'Telefon','company'=>'Pracownia / firma','investmentType'=>'Inwestycja','location'=>'Lokalizacja','stage'=>'Etap','areaSquareMeters'=>'Powierzchnia','description'=>'Opis','notes'=>'Uwagi','mode'=>'Forma spotkania','preferredTime'=>'Preferowana pora','topic'=>'Temat','sourceContext'=>'Źródło','scopeItems'=>'Zakres','consent'=>'Zgoda na kontakt','consentMarketing'=>'Zgoda marketingowa'])
@foreach ($inquiry->payload as $field => $value)
<tr><th>{{ $labels[$field] ?? $field }}</th><td>{{ is_array($value) ? implode(', ', $value) : (is_bool($value) ? ($value ? 'Tak' : 'Nie') : $value) }}</td></tr>
@endforeach
</table><h2>Prywatne załączniki</h2>
@forelse ($inquiry->files as $index => $file)
<p><a href="{{ route('inquiries.download', [$inquiry, $index]) }}">{{ $file['name'] }}</a> · {{ number_format($file['size'] / 1024, 0, ',', ' ') }} KB</p>
@empty<p>Brak załączników.</p>@endforelse
</main></body></html>
