<?php

namespace App\Support;

use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Validator;

final class ProjectPayload
{
    public static function fail(string $message): never
    {
        throw new HttpResponseException(response()->json(['error' => $message], 422));
    }

    public static function identifier(mixed $id): string
    {
        if (! is_string($id) || ! preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/D', $id)) {
            self::fail('Nieprawidłowy identyfikator.');
        }

        return $id;
    }

    public static function validate(array $p): void
    {
        Validator::make($p, [
            'rooms.*' => ['array'], 'rooms.*.circuits.*' => ['array'],
            'points.*' => ['array'], 'points.*.bindings.*' => ['array'],
            'points.*.bindings.*.hold' => ['sometimes', 'array'],
            'points.*.placement' => ['sometimes', 'array'],
            'points.*.placement.documentId' => ['sometimes', 'string'],
            'points.*.photoId' => ['sometimes', 'string'],
            'scenes.*' => ['array'], 'scenes.*.actions.*' => ['array'],
            'integrations.*' => ['array'], 'planView' => ['sometimes', 'array'],
            'planView.documentId' => ['sometimes', 'string'],
        ])->validate();
        self::identifier($p['id'] ?? null);
        foreach (['name', 'studio', 'contact', 'email', 'type', 'city', 'stage', 'date', 'budget', 'priority', 'notes'] as $key) {
            if (! isset($p[$key]) || ! is_string($p[$key]) || strlen($p[$key]) > ($key === 'notes' ? 12000 : 600)) {
                self::fail('Nieprawidłowe pole: '.$key);
            }
        }
        if (! trim($p['name'])) {
            self::fail('Podaj nazwę projektu.');
        }
        if (! isset($p['revision']) || ! is_int($p['revision']) || $p['revision'] < 0) {
            self::fail('Nieprawidłowa wersja.');
        }
        if (! array_key_exists('area', $p) || ($p['area'] !== null && (! is_numeric($p['area']) || $p['area'] < 0 || $p['area'] > 100000))) {
            self::fail('Nieprawidłowa powierzchnia.');
        }
        foreach (['scope' => 12, 'rooms' => 100, 'points' => 500, 'scenes' => 100, 'integrations' => 30] as $key => $limit) {
            if (! isset($p[$key]) || ! is_array($p[$key]) || ! array_is_list($p[$key]) || count($p[$key]) > $limit) {
                self::fail('Nieprawidłowa lista: '.$key);
            }
        }
        foreach ($p['scope'] as $v) {
            if (! is_string($v) || strlen($v) > 100) {
                self::fail('Nieprawidłowy zakres.');
            }
        }
        $ids = [];
        $roomIds = [];
        $targets = [];
        $addId = function ($id) use (&$ids) {
            self::identifier($id);
            if (isset($ids[$id])) {
                self::fail('Powtórzony identyfikator.');
            } $ids[$id] = true;
        };
        $text = function ($row, $keys) {
            foreach ($keys as $key) {
                if (! isset($row[$key]) || ! is_string($row[$key]) || strlen($row[$key]) > 12000) {
                    self::fail('Nieprawidłowe pole elementu: '.$key);
                }
            }
        };
        foreach ($p['rooms'] as $r) {
            $addId($r['id'] ?? null);
            $roomIds[$r['id']] = true;
            $text($r, ['name', 'floor', 'notes']);
            if (! array_key_exists('area', $r) || ($r['area'] !== null && (! is_numeric($r['area']) || $r['area'] < 0 || $r['area'] > 100000))) {
                self::fail('Nieprawidłowa powierzchnia pomieszczenia.');
            }
            if (! isset($r['circuits']) || ! is_array($r['circuits']) || count($r['circuits']) > 200) {
                self::fail('Za dużo obwodów.');
            }
            foreach ($r['circuits'] as $c) {
                $addId($c['id'] ?? null);
                $targets[$c['id']] = true;
                $text($c, ['name', 'kind', 'control', 'priority', 'spec']);
            }
        }
        foreach ($p['scenes'] as $s) {
            $addId($s['id'] ?? null);
            $targets[$s['id']] = true;
        }
        $bindings = function ($rows) use ($addId, $text, &$targets) {
            if (! is_array($rows) || ! array_is_list($rows) || count($rows) > 100) {
                self::fail('Nieprawidłowe przypisania.');
            }
            foreach ($rows as $b) {
                $addId($b['id'] ?? null);
                $text($b, ['target', 'action']);
                if ($b['target'] !== '' && ! isset($targets[$b['target']])) {
                    self::fail('Powiązanie wskazuje usunięty element.');
                }
                foreach (['label', 'notes'] as $field) {
                    if (isset($b[$field])) {
                        $text($b, [$field]);
                    }
                }
                if (isset($b['hold'])) {
                    if (! is_array($b['hold'])) {
                        self::fail('Nieprawidłowe długie naciśnięcie.');
                    }$text($b['hold'], ['target', 'action']);
                    if ($b['hold']['target'] !== '' && ! isset($targets[$b['hold']['target']])) {
                        self::fail('Nieprawidłowy cel długiego naciśnięcia.');
                    }
                }
            }
        };
        $attachments = array_column($p['attachments'] ?? [], null, 'id');
        $codes = [];
        $position = function ($pos, bool $view = false) use ($attachments) {
            if (! is_array($pos) || ! is_string($pos['documentId'] ?? null) || ! isset($attachments[$pos['documentId']]) || $attachments[$pos['documentId']]['mime'] !== 'application/pdf') {
                self::fail('Punkt wymaga rzutu PDF należącego do projektu.');
            }
            if (! is_int($pos['page'] ?? null) || $pos['page'] < 1 || $pos['page'] > 200) {
                self::fail('Nieprawidłowa strona rzutu.');
            }
            foreach ($view ? ['zoom', 'centerX', 'centerY'] : ['x', 'y'] as $field) {
                $n = $pos[$field] ?? null;
                if ((! is_int($n) && ! is_float($n)) || ! is_finite((float) $n)) {
                    self::fail('Nieprawidłowa pozycja na rzucie.');
                }
                if (! $view && ($n < 0 || $n > 1)) {
                    self::fail('Punkt poza rzutem.');
                }
                if ($view && ($field === 'zoom' ? ($n < 0.1 || $n > 20) : abs($n) > 1000)) {
                    self::fail('Nieprawidłowy widok rzutu.');
                }
            }
        };
        if (isset($p['planView'])) {
            $position($p['planView'], true);
        }
        if (isset($p['nextPointNumber']) && (! is_int($p['nextPointNumber']) || $p['nextPointNumber'] < 1 || $p['nextPointNumber'] > 1000000)) {
            self::fail('Nieprawidłowa numeracja punktów.');
        }
        foreach ($p['points'] as $pt) {
            $addId($pt['id'] ?? null);
            $text($pt, ['name', 'roomId', 'sensor', 'finish', 'status', 'notes']);
            if (! isset($roomIds[$pt['roomId']])) {
                self::fail('Punkt nie ma pomieszczenia.');
            }
            if (! array_key_exists('height', $pt) || ($pt['height'] !== null && (! is_numeric($pt['height']) || $pt['height'] < 0 || $pt['height'] > 500))) {
                self::fail('Nieprawidłowa wysokość.');
            }
            $bindings($pt['bindings'] ?? null);
            foreach (['deviceType', 'model'] as $field) {
                if (isset($pt[$field])) {
                    $text($pt, [$field]);
                }
            }
            if (isset($pt['code'])) {
                if (! is_string($pt['code']) || ! preg_match('/^P[0-9]{2,6}$/D', $pt['code']) || isset($codes[$pt['code']])) {
                    self::fail('Nieprawidłowy lub powtórzony numer punktu.');
                }$codes[$pt['code']] = true;
            }
            if (isset($pt['placement'])) {
                $position($pt['placement']);
            }
            if (isset($pt['photoId']) && (! isset($attachments[$pt['photoId']]) || ! in_array($attachments[$pt['photoId']]['mime'], ['image/jpeg', 'image/png'], true))) {
                self::fail('Nieprawidłowe zdjęcie sensora.');
            }
        }
        foreach ($p['scenes'] as $s) {
            $text($s, ['name', 'icon', 'area', 'priority', 'notes']);
            $bindings($s['actions'] ?? null);
            if (! isset($s['triggers']) || ! is_array($s['triggers']) || count($s['triggers']) > 20 || ! is_bool($s['exception'] ?? null)) {
                self::fail('Nieprawidłowa scena.');
            }
            foreach ($s['triggers'] as $v) {
                if (! is_string($v) || strlen($v) > 200) {
                    self::fail('Nieprawidłowy wyzwalacz.');
                }
            }
            foreach ($s['actions'] as $b) {
                if ($b['target'] === $s['id']) {
                    self::fail('Scena nie może uruchamiać samej siebie.');
                }
            }
        }
        foreach ($p['integrations'] as $i) {
            $addId($i['id'] ?? null);
            $text($i, ['name', 'model', 'notes']);
            if (! is_bool($i['enabled'] ?? null)) {
                self::fail('Nieprawidłowa integracja.');
            }
        }
    }
}
