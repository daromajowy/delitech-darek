<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Resources\Pages\EditRecord;

class EditUser extends EditRecord
{
    protected static string $resource = UserResource::class;

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $data['password'] = '';

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        unset($data['active']);
        if ($this->getRecord()->is(auth()->user())) {
            unset($data['role']);
        }

        return $data;
    }
}
