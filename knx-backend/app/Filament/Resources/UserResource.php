<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Validation\Rules\Password;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $modelLabel = 'użytkownik';

    protected static ?string $pluralModelLabel = 'Użytkownicy';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')->label('Imię i nazwisko')->required()->maxLength(200),
            TextInput::make('email')->label('E-mail')->email()->required()->unique(ignoreRecord: true)->maxLength(200)->dehydrateStateUsing(fn ($state) => strtolower(trim($state))),
            TextInput::make('password')->label('Hasło')->password()->autocomplete('new-password')->rule(Password::min(12)->letters()->numbers())->dehydrated(fn ($state) => filled($state))->required(fn (string $operation) => $operation === 'create')->helperText('Minimum 12 znaków, litery i cyfry. Przy edycji pozostaw puste, aby zachować hasło.'),
            Select::make('role')->label('Rola')->options(['member' => 'Projektant', 'admin' => 'Administrator'])->default('member')->required()->disabled(fn (?User $record) => $record?->id === auth()->id()),
            Toggle::make('active')->label('Konto aktywne')->default(true)->disabled(fn (?User $record) => $record?->id === auth()->id()),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')->label('Użytkownik')->searchable(),
            TextColumn::make('email')->label('E-mail')->searchable(),
            TextColumn::make('role')->label('Rola')->formatStateUsing(fn ($state) => $state === 'admin' ? 'Administrator' : 'Projektant'),
            IconColumn::make('active')->label('Aktywny')->boolean(),
            IconColumn::make('mfa')->label('2FA')->state(fn (User $record) => filled($record->app_authentication_secret))->boolean(),
        ])->recordActions([EditAction::make()]);
    }

    public static function getPages(): array
    {
        return ['index' => Pages\ListUsers::route('/'), 'create' => Pages\CreateUser::route('/create'), 'edit' => Pages\EditUser::route('/{record}/edit')];
    }
}
