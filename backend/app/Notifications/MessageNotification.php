<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MessageNotification extends Notification
{
    use Queueable;

    /**
     * @var string $name
     */
    private $name;

    /**
     * @var string $message
     */
    private $message;

    /**
     * Create a new notification instance.
     *
     * @param string $name
     * @param string $message
     *
     * @return void
     */
    public function __construct(string $name, string $message)
    {
        $this->name = $name;
        $this->message = $message;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->from(env("MAIL_FROM_ADDRESS"), env("MAIL_FROM_NAME"))
            ->subject('Chegou uma nova consulta!')
            ->greeting('Olá!')
            ->line('Recebemos uma nova consulta!')
            ->line('Nome: ' . $this->name)
            ->line('Mensagem: ' . $this->message)
            ->salutation('Atenciosamente, SC Advogados.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
