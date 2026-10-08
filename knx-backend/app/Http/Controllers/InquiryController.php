<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InquiryController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        abort_unless(in_array($request->header('Origin'), config('cors.allowed_origins'), true), 403, 'Nieprawidłowe źródło formularza.');
        $key = 'inquiry:'.hash_hmac('sha256', (string) $request->ip(), config('app.key'));
        abort_if(RateLimiter::tooManyAttempts($key, 10), 429, 'Limit zgłoszeń osiągnięty. Spróbuj później.');
        RateLimiter::hit($key, 3600);
        $request->validate(['payload' => ['required', 'string', 'max:40000'], 'files' => ['sometimes', 'array', 'max:10'], 'files.*' => ['required', 'file', 'max:10240']]);
        $data = json_decode($request->string('payload')->toString(), true);
        abort_unless(is_array($data), 422, 'Nieprawidłowy formularz.');
        $data['consent'] = $data['consentDataProcessing'] ?? $data['consent'] ?? false;
        $rules = [
            'kind' => ['required', 'in:project,consultation'],
            'name' => ['required', 'string', 'max:200'],
            'email' => ['required', 'email:rfc', 'max:254'],
            'phone' => ['required', 'string', 'min:7', 'max:60'],
            'consent' => ['required', 'accepted'],
            'consentMarketing' => ['sometimes', 'boolean'],
            'scopeItems' => ['sometimes', 'array', 'max:20'],
            'scopeItems.*' => ['string', 'max:250'],
            'website' => ['sometimes', 'nullable', 'string', 'max:0'],
        ];
        foreach (['company', 'investmentType', 'location', 'stage', 'areaSquareMeters', 'mode', 'preferredTime', 'topic', 'sourceContext'] as $field) {
            $rules[$field] = ['sometimes', 'nullable', 'string', 'max:500'];
        }
        foreach (['description', 'notes'] as $field) {
            $rules[$field] = ['sometimes', 'nullable', 'string', 'max:10000'];
        }
        $clean = Validator::make($data, $rules)->validate();
        unset($clean['website']);
        $uploads = $request->file('files', []);
        abort_if(array_sum(array_map(fn ($file) => $file->getSize(), $uploads)) > 20 * 1024 * 1024, 422, 'Załączniki mogą mieć łącznie do 20 MB.');
        $allowed = [
            'pdf' => ['application/pdf'], 'png' => ['image/png'], 'jpg' => ['image/jpeg'], 'jpeg' => ['image/jpeg'],
            'zip' => ['application/zip', 'application/x-zip-compressed'],
            'dwg' => ['image/vnd.dwg', 'application/acad', 'application/x-acad', 'application/octet-stream'],
            'dxf' => ['image/vnd.dxf', 'application/dxf', 'text/plain', 'application/octet-stream'],
        ];
        foreach ($uploads as $file) {
            $extension = strtolower($file->getClientOriginalExtension());
            abort_unless(isset($allowed[$extension]) && in_array($file->getMimeType(), $allowed[$extension], true), 422, 'Niedozwolony typ pliku.');
            $handle = fopen($file->getRealPath(), 'rb');
            $head = fread($handle, 65536);
            fclose($handle);
            $valid = match ($extension) {
                'pdf' => str_starts_with($head, '%PDF-'),
                'png', 'jpg', 'jpeg' => @getimagesize($file->getRealPath()) !== false,
                'zip' => str_starts_with($head, "PK\x03\x04") || str_starts_with($head, "PK\x05\x06"),
                'dwg' => preg_match('/^AC10[0-9]{2}/', $head) === 1,
                'dxf' => str_starts_with($head, 'AutoCAD Binary DXF') || preg_match('/\bSECTION\b/', $head) === 1,
            };
            abort_unless($valid, 422, 'Zawartość pliku nie odpowiada jego typowi.');
        }
        $id = (string) Str::uuid();
        $stored = [];
        try {
            foreach ($uploads as $file) {
                $path = Storage::disk('local')->putFileAs('inquiries/'.$id, $file, (string) Str::uuid());
                if (! $path) {
                    throw new \RuntimeException('Private upload failed');
                }
                chmod(Storage::disk('local')->path($path), 0600);
                $name = mb_substr(preg_replace('/[\x00-\x1F\x7F]/u', '', basename(str_replace('\\', '/', $file->getClientOriginalName()))), 0, 180);
                $stored[] = ['path' => $path, 'name' => $name, 'size' => $file->getSize()];
            }
            $record = DB::transaction(fn () => Inquiry::create([
                'id' => $id, 'reference' => 'IS-'.now()->format('Ymd').'-'.strtoupper(Str::random(10)),
                'kind' => $clean['kind'], 'payload' => $clean, 'files' => $stored,
            ]));
        } catch (\Throwable $error) {
            Storage::disk('local')->deleteDirectory('inquiries/'.$id);
            report($error);
            abort(500, 'Nie udało się bezpiecznie zapisać zgłoszenia. Spróbuj ponownie.');
        }

        return response()->json(['reference' => $record->reference], 201);
    }

    public function show(Inquiry $inquiry): View
    {
        Gate::authorize('view', $inquiry);

        return view('inquiry', ['inquiry' => $inquiry]);
    }

    public function download(Inquiry $inquiry, string $index): StreamedResponse
    {
        Gate::authorize('view', $inquiry);
        abort_unless(ctype_digit($index), 404);
        $file = $inquiry->files[(int) $index] ?? null;
        abort_unless($file && str_starts_with($file['path'], 'inquiries/'.$inquiry->id.'/') && Storage::disk('local')->exists($file['path']), 404);

        return Storage::disk('local')->download($file['path'], $file['name'], ['Content-Type' => 'application/octet-stream', 'X-Content-Type-Options' => 'nosniff']);
    }
}
