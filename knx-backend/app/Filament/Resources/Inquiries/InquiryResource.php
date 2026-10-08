<?php

namespace App\Filament\Resources\Inquiries;

use App\Filament\Resources\Inquiries\Pages\ListInquiries;
use App\Models\Inquiry;
use Filament\Actions\Action;
use Filament\Resources\Resource;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class InquiryResource extends Resource
{
    protected static ?string $model = Inquiry::class;

    protected static ?string $modelLabel = 'zapytanie ze strony';

    protected static ?string $pluralModelLabel = 'Zapytania ze strony';

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('reference')->label('Numer')->searchable(),
            TextColumn::make('payload.name')->label('Kontakt'),
            TextColumn::make('payload.email')->label('E-mail'),
            TextColumn::make('kind')->label('Rodzaj')->formatStateUsing(fn ($state) => $state === 'consultation' ? 'Konsultacja' : 'Projekt')->badge(),
            TextColumn::make('created_at')->label('Otrzymano')->dateTime('d.m.Y H:i', 'Europe/Warsaw')->sortable(),
        ])->defaultSort('created_at', 'desc')->recordActions([
            Action::make('open')->label('Otwórz')->url(fn (Inquiry $record) => route('inquiries.show', $record)),
        ]);
    }

    public static function getPages(): array
    {
        return ['index' => ListInquiries::route('/')];
    }
}
