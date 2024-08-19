<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefreshToken extends Model
{
    use HasFactory;
    protected $table = 'refresh_tokens';
    protected $guarded = false;
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public static function createToken($fingerprint)
    {
        $userId = auth()->user()->id;
        $refreshToken = bin2hex(random_bytes(64));
        $expiresAt = now()->addMinutes(config('jwt.refresh_ttl'));

        self::create([
            'user_id' => $userId,
            'refresh_token' => $refreshToken,
            'fingerprint' => $fingerprint,
            'expires_at' => $expiresAt,
        ]);

        return $refreshToken;
    }

    public static function invalidateToken($fingerprint)
    {
        $userId = auth()->user()->id;
        RefreshToken::where('user_id', $userId)
            ->where('fingerprint', $fingerprint)
            ->delete();
    }
}
