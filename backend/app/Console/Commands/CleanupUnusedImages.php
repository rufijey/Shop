<?php

namespace App\Console\Commands;

use App\Models\Image;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CleanupUnusedImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:clear';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete unused images';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $files = Storage::files('public/images');

        $dbPhotos = Image::pluck('path')->toArray();

        $unusedFiles = array_filter($files, function ($file) use ($dbPhotos) {
            $relativeFilePath = 'images/' . basename($file);
            return !in_array($relativeFilePath, $dbPhotos);
        });

        foreach ($unusedFiles as $file) {
            Storage::delete($file);
            $this->info("Deleted: " . $file);
        }

        $this->info('Unused photos cleanup completed.');
    }
}
