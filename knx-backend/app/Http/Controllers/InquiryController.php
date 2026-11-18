<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
        $request->validate(['payload' => ['required', 'string', 'max:40000'], 'files' => ['prohibited']]);
        abort_if($request->allFiles() !== [], 422, 'Ten formularz nie przyjmuje załączników.');
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
        try {
            $record = Inquiry::create([
                'reference' => 'IS-'.now()->format('Ymd').'-'.strtoupper(Str::random(10)),
                'kind' => $clean['kind'], 'payload' => $clean, 'files' => [],
            ]);
        } catch (\Throwable $error) {
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
