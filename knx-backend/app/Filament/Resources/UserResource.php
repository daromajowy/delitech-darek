<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rules\Password;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $modelLabel = 'użytkownik';

    protected static ?string $pluralModelLabel = 'Użytkownicy';

    protected static ?string $navigationLabel = 'Dostęp do projektanta';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')->label('Imię i nazwisko')->required()->maxLength(200),
            TextInput::make('email')->label('E-mail')->email()->required()->unique(ignoreRecord: true)->maxLength(200)->dehydrateStateUsing(fn ($state) => strtolower(trim($state))),
            TextInput::make('password')->label('Hasło')->password()->autocomplete('new-password')->rule(Password::min(12)->letters()->numbers())->dehydrated(fn ($state) => filled($state))->required(fn (string $operation) => $operation === 'create')->helperText('Minimum 12 znaków, litery i cyfry. Przy edycji pozostaw puste, aby zachować hasło.'),
            Select::make('role')->label('Rola')->options(['member' => 'Projektant', 'admin' => 'Administrator'])->default('member')->required()->disabled(fn (?User $record) => $record?->id === auth()->id()),
            Toggle::make('active')->label('Zezwól na logowanie')->default(true)
                ->visible(fn (string $operation): bool => $operation === 'create'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')->label('Użytkownik')->searchable(),
            TextColumn::make('email')->label('E-mail')->searchable(),
            TextColumn::make('role')->label('Rola')->formatStateUsing(fn ($state) => $state === 'admin' ? 'Administrator' : 'Projektant'),
            TextColumn::make('active')->label('Dostęp')->badge()
                ->formatStateUsing(fn (bool $state): string => $state ? 'Aktywny' : 'Zablokowany')
                ->color(fn (bool $state): string => $state ? 'success' : 'gray'),
            IconColumn::make('mfa')->label('2FA')->state(fn (User $record) => filled($record->app_authentication_secret))->boolean(),
        ])->filters([
            TernaryFilter::make('active')->label('Dostęp do projektanta')->placeholder('Wszystkie konta')
                ->trueLabel('Aktywne')->falseLabel('Zablokowane'),
        ])->recordActions([EditAction::make(), self::accessAction(false), self::accessAction(true)]);
    }

    private static function accessAction(bool $grant): Action
    {
        $label = $grant ? 'Przywróć dostęp' : 'Zablokuj dostęp';

        return Action::make($grant ? 'grantAccess' : 'blockAccess')
            ->label($label)
            ->color($grant ? 'success' : 'danger')
            ->visible(fn (User $record): bool => $record->active !== $grant && Gate::allows('managePlannerAccess', $record))
            ->requiresConfirmation()
            ->modalHeading(fn (User $record): string => $label.' · '.$record->name)
            ->modalDescription($grant
                ? 'Ta osoba będzie mogła ponownie zalogować się swoim hasłem.'
                : 'Ta osoba straci dostęp do projektanta. Jej projekty i pliki pozostaną zapisane.')
            ->modalSubmitActionLabel($label)
            ->action(function (User $record) use ($grant): void {
                $record->setPlannerAccess(auth()->user(), $grant);
                Notification::make()->success()->title($grant ? 'Przywrócono dostęp' : 'Zablokowano dostęp')->send();
            });
    }

    public static function getPages(): array
    {
        return ['index' => Pages\ListUsers::route('/'), 'create' => Pages\CreateUser::route('/create'), 'edit' => Pages\EditUser::route('/{record}/edit')];
    }
}
