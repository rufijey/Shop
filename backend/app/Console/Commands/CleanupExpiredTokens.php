<?php

namespace App\Console\Commands;

use App\Models\RefreshToken;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CleanupExpiredTokens extends Command
{

    protected $signature = 'tokens:clear';

    protected $description = 'Cleanup expired tokens';

    public function handle()
    {
        $deletedTokens = RefreshToken::where('expires_at', '<', now())->delete();

        $this->info("Deleted $deletedTokens expired refresh tokens.");
    }
}
