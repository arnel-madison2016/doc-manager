<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('documents:purge-trash')->dailyAt('02:00')->withoutOverlapping();
Schedule::command('journal:purge')->dailyAt('02:30')->withoutOverlapping();
Schedule::command('sanctum:prune-expired --hours=24')->daily();

