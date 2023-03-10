<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactNotification extends Notification
{
    use Queueable;

    /**
     * @var string $name
     */
    private $name;

    /**
     * @var string $email
     */
    private $email;

    /**
     * @var string $subject
     */
    private $subject;

    /**
     * @var string $message
     */
    private $message;

    /**
     * Create a new notification instance.
     *
     * @param string $name
     * @param string $email
     * @param string $subject
     * @param string $message
     *
     * @return void
     */
    public function __construct(string $name, string $email, string $subject, string $message)
    {
        $this->name = $name;
        $this->email = $email;
        $this->subject = $subject;
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
            ->replyTo($this->email)
            ->subject('Contato pelo Site - ' . $this->subject)
            ->greeting('Olá!')
            ->line('Recebemos um contato!')
            ->line('Nome: ' . $this->name)
            ->line('E-mail: ' . $this->email)
            ->line('Motivo: ' . $this->subject)
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
