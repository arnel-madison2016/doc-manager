<?php

namespace App\Console\Commands;

use App\Models\AppSetting;
use App\Models\Document;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

#[Signature('documents:purge-trash')]
#[Description('Command description')]
class PurgeTrash extends Command
{
    /**
     * Execute the console command.
     */
    public function handle() {

        $jours = (int) AppSetting::read('corbeille_retention_jours');
        Document::corbeilleExpiree($jours)->each(function (Document $d) {
            Storage::disk('local')->deleteDirectory("documents/{$d->id}");   // fichiers PDF et versions
            $d->delete();                                                    // versions en cascade
        });
    }
}
