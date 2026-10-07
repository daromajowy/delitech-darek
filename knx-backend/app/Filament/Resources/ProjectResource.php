<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProjectResource\Pages\ListProjects;
use App\Models\Project;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class ProjectResource extends Resource
{
    protected static ?string $model = Project::class;

    protected static ?string $modelLabel = 'projekt KNX';

    protected static ?string $pluralModelLabel = 'Projekty KNX';

    protected static ?string $navigationLabel = 'Projekty i briefy';

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->accessibleTo(auth()->user());
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')->label('Projekt')->searchable()->sortable(),
            TextColumn::make('studio')->label('Pracownia')->searchable(),
            TextColumn::make('owner.name')->label('Właściciel'),
            TextColumn::make('status')->label('Status')->formatStateUsing(fn ($state) => $state === 'submitted' ? 'Brief przekazany' : 'W opracowaniu')->badge(),
            TextColumn::make('revision')->label('Wersja'),
            TextColumn::make('submissions_count')->counts('submissions')->label('Briefy'),
            TextColumn::make('updated_at')->label('Ostatni zapis')->dateTime('d.m.Y H:i')->sortable(),
        ])->defaultSort('updated_at', 'desc')->recordActions([
            Action::make('open')->label('Otwórz')->url(fn (Project $record) => route('planner', ['project' => $record->id])),
            Action::make('json')->label('Kopia JSON')->url(fn (Project $record) => route('project.download', $record)),
            Action::make('share')->label('Współpracownicy')->visible(fn (Project $record) => Gate::allows('share', $record))
                ->fillForm(fn (Project $record) => ['emails' => $record->members->pluck('email')->join("\n")])
                ->schema([Textarea::make('emails')->label('Adresy e-mail, po jednym w wierszu')->helperText('Wpisz istniejące konta. Administrator dodaje konta w zakładce Użytkownicy. Współpracownik może edytować cały projekt.')->maxLength(4000)])
                ->action(function (Project $record, array $data) {
                    Gate::authorize('share', $record);
                    $emails = collect(preg_split('/[\s,;]+/', strtolower(trim($data['emails'] ?? '')), -1, PREG_SPLIT_NO_EMPTY))->unique();
                    if ($emails->count() > 20) {
                        throw ValidationException::withMessages(['emails' => 'Maksymalnie 20 współpracowników.']);
                    }
                    $users = User::where('active', true)->whereIn('email', $emails)->get();
                    if ($users->count() !== $emails->count()) {
                        throw ValidationException::withMessages(['emails' => 'Nie znaleziono wszystkich aktywnych kont. Poproś administratora o ich utworzenie.']);
                    }
                    $record->members()->sync($users->pluck('id'));
                    Notification::make()->title('Zapisano dostęp do projektu')->success()->send();
                }),
        ]);
    }

    public static function getPages(): array
    {
        return ['index' => ListProjects::route('/')];
    }
}
