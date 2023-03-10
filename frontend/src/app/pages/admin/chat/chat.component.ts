import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Echo from 'laravel-echo';
import { MessageService } from 'src/app/services/message.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  filters: any = { children: false, order: 'DESC' };
  message: any = {};
  user: any = {};
  loading = false;

  constructor(
    private router: ActivatedRoute,
    public tools: ToolsService,
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    this.user = await this.messageService.getCurrentUser();

    this.router.queryParams.subscribe((resp) => {
      console.log('params', resp);
      if (resp['chat_id']) {
        const chat_id = resp['chat_id'];
        this.getMessage(chat_id);
      }
    });
    this.getMessages();
    this.webSockets();
  }

  getMessages() {
    this.loading = true;
    this.messageService
      .listingMessages(this.filters)
      .then((resp: any) => {
        this.messages = resp;
      })
      .finally(() => (this.loading = false));
  }

  getMessage(id: any) {
    this.messageService.showMessage(id).then((resp: any) => {
      this.message = resp;
      setTimeout(() => {
        const objDiv = document.getElementById('box-messages');
        if (objDiv) {
          objDiv.scrollTop = objDiv.scrollHeight;
        }
      }, 200);
    });
  }

  responseMessage(event: any) {
    let data = event;
    if (this.message.id) {
      data.message_id = this.message.id;
    }

    this.loading = true;
    this.messageService
      .createMessage(data)
      .then((resp: any) => {
        // this.getMessages();
        this.getMessage(this.message.id);
      })
      .finally(() => (this.loading = false));
  }

  webSockets() {
    console.log('init webSocket channel-message');

    const echo = new Echo({
      broadcaster: 'pusher',
      key: '0e3fc37b93f50ec46388',
      cluster: 'sa1',
      forceTLS: true
    });

    echo
      .channel('channel-message')
      .listen('MessageEvent', async (resp: any) => {
        const user = await this.messageService.getCurrentUser();
        console.log('resp channel-message', resp, user);
        if (
          resp.data &&
          resp.data.message_id &&
          this.message.id &&
          resp.data.message_id == this.message.id
        ) {
          this.getMessage(resp.data.message_id);
        }
      });
  }
}
