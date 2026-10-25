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
            'rooms.*.planArea' => ['sometimes', 'array'],
            'scenes.*.roomId' => ['sometimes', 'string'],
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
        foreach ($p['rooms'] as $room) {
            if (isset($room['planArea'])) {
                $area = $room['planArea'];
                $position($area);
                foreach (['width', 'height'] as $field) {
                    $n = $area[$field] ?? null;
                    if ((! is_int($n) && ! is_float($n)) || ! is_finite((float) $n) || $n < 0.01 || $n > 1) {
                        self::fail('Nieprawidłowy obszar pomieszczenia.');
                    }
                }
                if ($area['x'] + $area['width'] > 1.000001 || $area['y'] + $area['height'] > 1.000001) {
                    self::fail('Obszar pomieszczenia poza rzutem.');
                }
                if (array_key_exists('vertices', $area)) {
                    self::validateRoomPolygon($area);
                }
            }
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
            if (isset($s['roomId']) && ! isset($roomIds[$s['roomId']])) {
                self::fail('Scena wskazuje nieistniejące pomieszczenie.');
            }
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

    /** @param array{x: float|int, y: float|int, width: float|int, height: float|int, vertices: mixed} $area */
    private static function validateRoomPolygon(array $area): void
    {
        $vertices = $area['vertices'];
        if (! is_array($vertices) || ! array_is_list($vertices) || count($vertices) < 3 || count($vertices) > 100) {
            self::fail('Obrys pomieszczenia wymaga od 3 do 100 narożników.');
        }
        foreach ($vertices as $vertex) {
            if (! is_array($vertex)) {
                self::fail('Nieprawidłowy narożnik pomieszczenia.');
            }
            foreach (['x', 'y'] as $coordinate) {
                $value = $vertex[$coordinate] ?? null;
                if ((! is_int($value) && ! is_float($value)) || ! is_finite((float) $value) || $value < 0 || $value > 1) {
                    self::fail('Narożnik pomieszczenia musi znajdować się na rzucie.');
                }
            }
        }
        $minX = min(array_column($vertices, 'x'));
        $minY = min(array_column($vertices, 'y'));
        $bounds = ['x' => $minX, 'y' => $minY, 'width' => max(array_column($vertices, 'x')) - $minX, 'height' => max(array_column($vertices, 'y')) - $minY];
        foreach ($bounds as $field => $value) {
            if (abs($area[$field] - $value) > 0.000001) {
                self::fail('Granice pomieszczenia nie odpowiadają jego narożnikom.');
            }
        }
        $epsilon = 1e-10;
        $cross = fn (array $a, array $b, array $c): float => ($b['x'] - $a['x']) * ($c['y'] - $a['y']) - ($b['y'] - $a['y']) * ($c['x'] - $a['x']);
        $onSegment = fn (array $point, array $a, array $b): bool => abs($cross($a, $b, $point)) <= $epsilon
            && $point['x'] >= min($a['x'], $b['x']) - $epsilon && $point['x'] <= max($a['x'], $b['x']) + $epsilon
            && $point['y'] >= min($a['y'], $b['y']) - $epsilon && $point['y'] <= max($a['y'], $b['y']) + $epsilon;
        $count = count($vertices);
        $doubleArea = 0;
        for ($i = 0; $i < $count; $i++) {
            $a = $vertices[$i];
            $b = $vertices[($i + 1) % $count];
            $next = $vertices[($i + 2) % $count];
            $doubleArea += $a['x'] * $b['y'] - $b['x'] * $a['y'];
            if (abs($cross($a, $b, $next)) <= $epsilon && ($b['x'] - $a['x']) * ($next['x'] - $b['x']) + ($b['y'] - $a['y']) * ($next['y'] - $b['y']) < 0) {
                self::fail('Boki obrysu pomieszczenia nie mogą się nakładać.');
            }
            for ($j = $i + 1; $j < $count; $j++) {
                $c = $vertices[$j];
                if (hypot($a['x'] - $c['x'], $a['y'] - $c['y']) <= $epsilon) {
                    self::fail('Narożniki pomieszczenia nie mogą się powtarzać.');
                }
                if ($j === $i + 1 || ($i === 0 && $j === $count - 1)) {
                    continue;
                }
                $d = $vertices[($j + 1) % $count];
                $abC = $cross($a, $b, $c);
                $abD = $cross($a, $b, $d);
                $cdA = $cross($c, $d, $a);
                $cdB = $cross($c, $d, $b);
                if (((($abC > $epsilon && $abD < -$epsilon) || ($abC < -$epsilon && $abD > $epsilon))
                    && (($cdA > $epsilon && $cdB < -$epsilon) || ($cdA < -$epsilon && $cdB > $epsilon)))
                    || $onSegment($c, $a, $b) || $onSegment($d, $a, $b) || $onSegment($a, $c, $d) || $onSegment($b, $c, $d)) {
                    self::fail('Boki obrysu pomieszczenia nie mogą się przecinać.');
                }
            }
        }
        if (abs($doubleArea) < 0.000002) {
            self::fail('Obrys pomieszczenia nie obejmuje powierzchni.');
        }
    }
}
