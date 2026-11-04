<?php

namespace App\Console\Commands;

use App\Models\AppSetting;
use App\Models\JournalAction;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('journal:purge')]
#[Description('Command description')]
class PurgeJournal extends Command
{
    /**
     * Execute the console command.
     */
    public function handle() {

        JournalAction::plusAncienQue((int) AppSetting::read('journal_retention_jours'))->delete();
    }
}
