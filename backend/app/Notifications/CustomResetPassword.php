<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;

class CustomResetPassword extends Notification implements ShouldQueue
{
    use Queueable;

    public $token;
    public $email;

    /**
     * Create a new notification instance.
     *
     * @param  string  $token
     * @param  string  $email
     * @return void
     */
    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable):array
    {
        return ['mail'];
    }

    /**
     * Получить email-уведомление для сброса пароля.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail(object $notifiable):MailMessage
    {
        $frontendUrl = 'http://localhost:8080/user/password/reset';

        $resetUrl = $frontendUrl . '?token=' . $this->token . '&email=' . urlencode($this->email);
        return (new MailMessage)
            ->subject('Reset Password Notification')
            ->greeting('Hello!')
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->action('Reset Password', $resetUrl)
            ->line('If you did not request a password reset, no further action is required.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
