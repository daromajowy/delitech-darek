<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListUsers extends ListRecords
{
    protected static string $resource = UserResource::class;

    protected static ?string $title = 'Dostęp do Projektanta KNX';

    protected ?string $subheading = 'Dodaj konto projektanta, zmień jego hasło lub zdecyduj, kto może się zalogować.';

    protected function getHeaderActions(): array
    {
        return [CreateAction::make()->label('Dodaj konto')];
    }
}
