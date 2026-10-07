<?php
declare(strict_types=1);
// All assets and documents pass through this controller, including direct URLs.
ini_set('display_errors', '0');
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-Robots-Tag: noindex, nofollow, noarchive');
header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'self'");
$private = dirname(__DIR__) . '/.knx-storage';
function reply(array $value, int $status = 200): never {
    http_response_code($status); header('Content-Type: application/json; charset=utf-8');
    echo json_encode($value, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR); exit;
}
function fail(string $message, int $status = 400): never { reply(['error' => $message], $status); }
function identifier(mixed $value): string {
    if (!is_string($value) || !preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/D', $value)) fail('Nieprawidłowy identyfikator.');
    return $value;
}
function write_json(string $file, array $value): void {
    $temp = $file . '.' . bin2hex(random_bytes(5)) . '.tmp';
    $bytes = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    if (file_put_contents($temp, $bytes, LOCK_EX) !== strlen($bytes)) throw new RuntimeException('Write failed');
    chmod($temp, 0600);
    if (!rename($temp, $file)) throw new RuntimeException('Rename failed');
}
function json_body(): array {
    if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 1000000) fail('Projekt jest zbyt duży.', 413);
    try { $body = json_decode(file_get_contents('php://input'), true, 64, JSON_THROW_ON_ERROR); }
    catch (Throwable $e) { fail('Nieprawidłowe dane JSON.'); }
    if (!is_array($body)) fail('Nieprawidłowe dane.'); return $body;
}
function project_path(string $id): string { global $private; return $private . '/projects/' . identifier($id) . '.json'; }
function read_project(string $id): array {
    $file = project_path($id); if (!is_file($file)) fail('Nie znaleziono projektu.', 404);
    return json_decode(file_get_contents($file), true, 64, JSON_THROW_ON_ERROR);
}
function validate_project(array $p): void {
    identifier($p['id'] ?? null);
    foreach (['name','studio','contact','email','type','city','stage','date','budget','priority','notes'] as $key) {
        if (!isset($p[$key]) || !is_string($p[$key]) || strlen($p[$key]) > ($key === 'notes' ? 12000 : 600)) fail('Nieprawidłowe pole: ' . $key);
    }
    if (!trim($p['name'])) fail('Podaj nazwę projektu.');
    if (!isset($p['revision']) || !is_int($p['revision']) || $p['revision'] < 0) fail('Nieprawidłowa wersja.');
    if (!array_key_exists('area',$p) || ($p['area'] !== null && (!is_numeric($p['area']) || $p['area'] < 0 || $p['area'] > 100000))) fail('Nieprawidłowa powierzchnia.');
    foreach (['scope'=>12,'rooms'=>100,'points'=>500,'scenes'=>100,'integrations'=>30] as $key=>$limit) {
        if (!isset($p[$key]) || !is_array($p[$key]) || !array_is_list($p[$key]) || count($p[$key]) > $limit) fail('Nieprawidłowa lista: ' . $key);
    }
    foreach ($p['scope'] as $v) if (!is_string($v) || strlen($v)>100) fail('Nieprawidłowy zakres.');
    $ids=[]; $roomIds=[]; $targets=[];
    $addId=function($id) use (&$ids) { identifier($id); if(isset($ids[$id])) fail('Powtórzony identyfikator.'); $ids[$id]=true; };
    $text=function($row,$keys) { foreach($keys as $key) if(!isset($row[$key]) || !is_string($row[$key]) || strlen($row[$key])>12000) fail('Nieprawidłowe pole elementu: '.$key); };
    foreach ($p['rooms'] as $r) {
        $addId($r['id']??null); $roomIds[$r['id']]=true; $text($r,['name','floor','notes']);
        if(!array_key_exists('area',$r)||($r['area']!==null&&(!is_numeric($r['area'])||$r['area']<0||$r['area']>100000))) fail('Nieprawidłowa powierzchnia pomieszczenia.');
        if(!isset($r['circuits'])||!is_array($r['circuits'])||count($r['circuits'])>200) fail('Za dużo obwodów.');
        foreach($r['circuits'] as $c) { $addId($c['id']??null); $targets[$c['id']]=true; $text($c,['name','kind','control','priority','spec']); }
    }
    foreach($p['scenes'] as $s){$addId($s['id']??null);$targets[$s['id']]=true;}
    $bindings=function($rows) use ($addId,$text,&$targets){
        if(!is_array($rows)||!array_is_list($rows)||count($rows)>100) fail('Nieprawidłowe przypisania.');
        foreach($rows as $b){$addId($b['id']??null);$text($b,['target','action']);if($b['target']!==''&&!isset($targets[$b['target']]))fail('Powiązanie wskazuje usunięty element.');}
    };
    foreach($p['points'] as $pt){
        $addId($pt['id']??null); $text($pt,['name','roomId','sensor','finish','status','notes']);
        if(!isset($roomIds[$pt['roomId']])) fail('Punkt nie ma pomieszczenia.');
        if(!array_key_exists('height',$pt)||($pt['height']!==null&&(!is_numeric($pt['height'])||$pt['height']<0||$pt['height']>500)))fail('Nieprawidłowa wysokość.');
        $bindings($pt['bindings']??null);
    }
    foreach($p['scenes'] as $s){
        $text($s,['name','icon','area','priority','notes']);$bindings($s['actions']??null);
        if(!isset($s['triggers'])||!is_array($s['triggers'])||count($s['triggers'])>20||!is_bool($s['exception']??null))fail('Nieprawidłowa scena.');
        foreach($s['triggers'] as $v)if(!is_string($v)||strlen($v)>200)fail('Nieprawidłowy wyzwalacz.');
        foreach($s['actions'] as $b) if($b['target']===$s['id'])fail('Scena nie może uruchamiać samej siebie.');
    }
    foreach($p['integrations'] as $i){$addId($i['id']??null);$text($i,['name','model','notes']);if(!is_bool($i['enabled']??null))fail('Nieprawidłowa integracja.');}
}
try {
    if (!is_file($private.'/config.json')) fail('Konfigurator czeka na konfigurację serwera.',503);
    $config=json_decode(file_get_contents($private.'/config.json'),true,16,JSON_THROW_ON_ERROR);
    if(!is_string($config['passwordHash']??null)||strlen($config['passwordHash'])<40) fail('Konfiguracja logowania niedostępna.',503);
    ini_set('session.use_strict_mode','1'); ini_set('session.use_only_cookies','1');
    session_name('INTELI_KNX'); session_save_path($private.'/sessions');
    session_set_cookie_params(['lifetime'=>0,'path'=>'/projektant-knx/','secure'=>true,'httponly'=>true,'samesite'=>'Strict']);
    session_start();
    $_SESSION['csrf']??=bin2hex(random_bytes(32));
    $csrf=$_SESSION['csrf']; $api=$_GET['api']??''; $method=$_SERVER['REQUEST_METHOD'];
    if(!is_string($api))fail('Nieprawidłowa ścieżka.');
    if(isset($_SESSION['auth'])&&(time()-$_SESSION['last']>7200||time()-$_SESSION['auth']>43200||($_SESSION['keyVersion']??'')!==hash('sha256',$config['passwordHash'])))unset($_SESSION['auth']);
    $loginError='';
    if($method==='POST'&&isset($_POST['login'])){
        if(!hash_equals($csrf,(string)($_POST['csrf']??'')))fail('Sesja wygasła. Odśwież stronę.',403);
        $key=hash('sha256',$_SERVER['REMOTE_ADDR']??'unknown');
        $rateFile=$private.'/rate/'.$key.'.json';
        $lock=fopen($private.'/rate.lock','c');flock($lock,LOCK_EX);
        $rate=is_file($rateFile)?json_decode(file_get_contents($rateFile),true):['start'=>time(),'count'=>0];
        if(time()-$rate['start']>900)$rate=['start'=>time(),'count'=>0];
        if($rate['count']>=8){flock($lock,LOCK_UN);header('Retry-After: 900');fail('Zbyt wiele prób. Spróbuj za 15 minut.',429);}
        $password=$_POST['password']??'';
        if(is_string($password)&&strlen($password)<=256&&password_verify($password,$config['passwordHash'])){
            write_json($rateFile,['start'=>time(),'count'=>0]);flock($lock,LOCK_UN);
            session_regenerate_id(true);$_SESSION['auth']=time();$_SESSION['last']=time();$_SESSION['keyVersion']=hash('sha256',$config['passwordHash']);$_SESSION['csrf']=bin2hex(random_bytes(32));
            header('Location: /projektant-knx/',true,303);exit;
        }
        $rate['count']++;write_json($rateFile,$rate);flock($lock,LOCK_UN);usleep(300000);$loginError='Nieprawidłowe hasło.';
    }
    if(!isset($_SESSION['auth'])){
        if($api!=='')fail('Zaloguj się ponownie. Niezapisane zmiany pozostają w otwartej karcie.',401);
        $requestPath=parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
        if(!in_array($requestPath,['/projektant-knx/','/projektant-knx/index.php','/projektant-knx/index.html'],true))fail('Wymagane logowanie.',401);
        header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");
        header('Content-Type: text/html; charset=utf-8');
        ?><!doctype html><html lang="pl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Logowanie | Projektant KNX</title><style>*{box-sizing:border-box}body{margin:0;background:#f5f7f8;color:#23343b;font:15px system-ui,sans-serif}header{padding:28px 6%;border-bottom:1px solid #d9e1e4;background:white}header a{color:#0e4637;text-decoration:none;font-size:22px;font-weight:750}main{max-width:450px;margin:10vh auto;padding:38px;background:white;border:1px solid #d9e1e4;border-radius:6px}h1{font-size:26px;margin:12px 0}p{color:#64757e;line-height:1.6}label{display:block;margin-top:28px;font-weight:600}input,button{width:100%;height:48px;margin-top:10px;border:1px solid #b9cbd1;border-radius:4px;padding:12px;font:inherit}input:focus{outline:2px solid #07869b}button{background:#07869b;color:white;font-weight:650;border:0;cursor:pointer}.error{color:#a32d2d}.eyebrow{font-size:12px;color:#07869b;font-weight:700}@media(max-width:500px){main{margin:40px 16px;padding:26px}}</style><header><a href="https://intelispaces.pl/">INTELISPACES</a></header><main><span class="eyebrow">PRZESTRZEŃ PROJEKTOWA</span><h1>Projektant KNX</h1><p>Zaloguj się do wspólnego obszaru zespołu InteliSpaces.</p><form method="post" action="/projektant-knx/"><input type="hidden" name="csrf" value="<?=htmlspecialchars($csrf,ENT_QUOTES,'UTF-8')?>"><input type="hidden" name="login" value="1"><label for="password">Hasło dostępu</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="256" autofocus><p role="alert" class="error"><?=htmlspecialchars($loginError,ENT_QUOTES,'UTF-8')?></p><button type="submit">Wejdź do projektanta</button></form></main></html><?php exit;
    }
    $_SESSION['last']=time();
    if($api!==''){
        if($method!=='GET'){
            if(!hash_equals($csrf,(string)($_SERVER['HTTP_X_CSRF_TOKEN']??'')))fail('Odśwież sesję logowania.',403);
            if(isset($_SERVER['HTTP_ORIGIN'])&&$_SERVER['HTTP_ORIGIN']!=='https://intelispaces.pl')fail('Niedozwolone źródło żądania.',403);
        }
        if($api==='session'&&$method==='GET')reply(['csrf'=>$csrf,'workspace'=>'InteliSpaces · zespół']);
        if($api==='logout'&&$method==='POST'){
            $_SESSION=[];session_destroy();setcookie('INTELI_KNX','',['expires'=>time()-3600,'path'=>'/projektant-knx/','secure'=>true,'httponly'=>true,'samesite'=>'Strict']);reply(['ok'=>true]);
        }
        session_write_close();
        if($api==='projects'&&$method==='GET'){
            $rows=[];foreach(glob($private.'/projects/*.json') as $file){$p=json_decode(file_get_contents($file),true);$rows[]=array_intersect_key($p,array_flip(['id','name','studio','revision','updatedAt','submissions']));}
            usort($rows,fn($a,$b)=>strcmp($b['updatedAt'],$a['updatedAt']));reply(['projects'=>$rows]);
        }
        if($api==='project'&&$method==='GET')reply(['project'=>read_project(identifier($_GET['id']??null))]);
        if($api==='brief'&&$method==='GET'){
            $p=read_project(identifier($_GET['project']??null));$id=identifier($_GET['id']??null);
            if(!array_filter($p['submissions'],fn($s)=>$s['id']===$id))fail('Nie znaleziono przekazanej wersji.',404);
            $copy=json_decode(file_get_contents($private.'/briefs/'.$id.'.json'),true,64,JSON_THROW_ON_ERROR);
            reply(['project'=>$copy['project'],'receipt'=>$copy['receipt']]);
        }
        if($api==='file'&&$method==='GET'){
            $p=read_project(identifier($_GET['project']??null));$id=identifier($_GET['id']??null);
            $a=null;foreach($p['attachments'] as $entry)if($entry['id']===$id)$a=$entry;
            if(!$a){
                foreach($p['submissions'] as $submission){
                    $copy=json_decode(file_get_contents($private.'/briefs/'.identifier($submission['id']).'.json'),true,64,JSON_THROW_ON_ERROR);
                    foreach($copy['project']['attachments'] as $entry)if($entry['id']===$id)$a=$entry;
                    if($a)break;
                }
            }
            if(!$a)fail('Nie znaleziono załącznika.',404);
            $file=$private.'/uploads/'.$p['id'].'/'.$id;
            if(!is_file($file))fail('Plik niedostępny.',404);
            header('Content-Type: '.$a['mime']);header('Content-Length: '.filesize($file));
            header("Content-Disposition: attachment; filename*=UTF-8''".rawurlencode($a['name']));readfile($file);exit;
        }
        $lock=fopen($private.'/projects.lock','c');flock($lock,LOCK_EX);
        if($api==='save'&&$method==='PUT'){
            $p=json_body();validate_project($p);$file=project_path($p['id']);
            $old=is_file($file)?read_project($p['id']):null;
            if(($old['revision']??0)!==$p['revision'])fail('Projekt zmienił się w innej karcie. Pobierz swoją kopię JSON, a następnie wczytaj wersję z serwera.',409);
            if(!$old&&count(glob($private.'/projects/*.json'))>=100)fail('Limit 100 projektów. Skontaktuj się z administratorem.',413);
            $p['attachments']=$old['attachments']??[];$p['submissions']=$old['submissions']??[];
            $p['revision']++;$p['updatedAt']=gmdate('c');
            if($old){
                write_json($private.'/history/'.$p['id'].'-'.$old['revision'].'.json',$old);
                $history=glob($private.'/history/'.$p['id'].'-*.json');natsort($history);
                while(count($history)>30){$oldest=array_shift($history);if(is_file($oldest))unlink($oldest);}
            }
            write_json($file,$p);reply(['project'=>$p]);
        }
        if($api==='upload'&&$method==='POST'){
            $p=read_project(identifier($_GET['project']??null));
            $f=$_FILES['file']??null;
            if(!$f||$f['error']!==UPLOAD_ERR_OK||$f['size']>12*1024*1024||!is_uploaded_file($f['tmp_name']))fail('Plik musi mieć mniej niż 12 MB.',413);
            $mime=(new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
            $allowed=['application/pdf'=>['pdf'],'image/jpeg'=>['jpg','jpeg'],'image/png'=>['png']];
            $ext=strtolower(pathinfo($f['name'],PATHINFO_EXTENSION));
            if(!isset($allowed[$mime])||!in_array($ext,$allowed[$mime],true))fail('Dozwolone pliki: PDF, JPG i PNG.');
            if(count($p['attachments'])>=20)fail('Limit 20 załączników na projekt.',413);
            $size=0;foreach(glob($private.'/uploads/*/*') as $path)$size+=filesize($path);
            if($size+$f['size']>512*1024*1024)fail('Wyczerpano miejsce na dokumenty. Skontaktuj się z administratorem.',413);
            $id=identifier($_GET['id']??null);$directory=$private.'/uploads/'.$p['id'];
            if(!is_dir($directory))mkdir($directory,0700);
            if(is_file($directory.'/'.$id))fail('Załącznik już istnieje.',409);
            if(!move_uploaded_file($f['tmp_name'],$directory.'/'.$id))throw new RuntimeException('Upload failed');chmod($directory.'/'.$id,0600);
            $name=mb_substr(preg_replace('/[\x00-\x1F\x7F\\\\\/]/u','_',basename($f['name'])),0,160);
            $p['attachments'][]=['id'=>$id,'name'=>$name,'size'=>$f['size'],'mime'=>$mime];$p['revision']++;$p['updatedAt']=gmdate('c');write_json(project_path($p['id']),$p);reply(['project'=>$p]);
        }
        if($api==='submit'&&$method==='POST'){
            $body=json_body();$p=read_project(identifier($body['id']??null));$submissionId=identifier($body['submissionId']??null);
            foreach($p['submissions'] as $s)if($s['id']===$submissionId)reply(['project'=>$p,'receipt'=>$s]);
            if($p['revision']!==($body['revision']??null))fail('Zapisz aktualną wersję przed przekazaniem.',409);
            if(!filter_var($p['email'],FILTER_VALIDATE_EMAIL)||!trim($p['contact'])||!count($p['rooms']))fail('Uzupełnij osobę kontaktową, e-mail i przynajmniej jedno pomieszczenie.');
            if(($body['consent']??false)!==true)fail('Potwierdź przekazanie briefu.');
            $receipt=['id'=>$submissionId,'revision'=>$p['revision'],'createdAt'=>gmdate('c')];
            write_json($private.'/briefs/'.$submissionId.'.json',['receipt'=>$receipt,'project'=>$p]);
            $p['submissions'][]=$receipt;$p['revision']++;$p['updatedAt']=gmdate('c');write_json(project_path($p['id']),$p);
            reply(['project'=>$p,'receipt'=>$receipt]);
        }
        if($api==='remove-file'&&$method==='POST'){
            $body=json_body();$p=read_project(identifier($body['project']??null));$id=identifier($body['id']??null);
            if(($body['revision']??null)!==$p['revision'])fail('Projekt zmienił się. Odśwież dokumentację.',409);
            $p['attachments']=array_values(array_filter($p['attachments'],fn($a)=>$a['id']!==$id));
            // Retain the binary for immutable briefs and recovery; remove only the active association.
            $p['revision']++;$p['updatedAt']=gmdate('c');write_json(project_path($p['id']),$p);reply(['project'=>$p]);
        }
        fail('Nie znaleziono operacji.',404);
    }
    session_write_close();
    $path=rawurldecode(parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH));
    $relative=substr($path,strlen('/projektant-knx/'));
    if($relative===''||$relative==='index.php')$relative='index.html';
    $base=realpath(__DIR__.'/app');$file=realpath(__DIR__.'/app/'.$relative);
    if(!$base||!$file||!str_starts_with($file,$base.DIRECTORY_SEPARATOR)||!is_file($file))fail('Nie znaleziono pliku.',404);
    $mime=['html'=>'text/html; charset=utf-8','js'=>'text/javascript; charset=utf-8','css'=>'text/css; charset=utf-8','png'=>'image/png','jpg'=>'image/jpeg','webp'=>'image/webp','ttf'=>'font/ttf','woff2'=>'font/woff2','txt'=>'text/plain'];
    $ext=strtolower(pathinfo($file,PATHINFO_EXTENSION));if(!isset($mime[$ext]))fail('Niedozwolony typ pliku.',403);
    header('Content-Type: '.$mime[$ext]);header('Content-Length: '.filesize($file));readfile($file);
} catch(Throwable $e) { error_log('KNX planner: '.$e->getMessage());fail('Nie udało się zapisać danych. Spróbuj ponownie; bieżące zmiany pozostają w otwartej karcie.',500); }
