import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import Echo from 'laravel-echo';
import { Logout } from 'src/app/core/actions/auth.action';
import { AppState } from 'src/app/core/reducers';
import { MessageService } from 'src/app/services/message.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  // $userCurrent: Observable<any>;
  user: any = {};

  messages: any[] = [];

  constructor(
    private store: Store<AppState>,
    public tools: ToolsService,
    private messageService: MessageService
  ) {
    // this.$userCurrent = store.pipe(select(currentUser));
  }

  async ngOnInit() {
    this.user = await this.messageService.getCurrentUser();
    this.getMessages();
    this.webSockets();
  }

  toggleMenu() {
    const body = document.querySelector('body');
    body?.classList.toggle('toggle-sidebar');
  }

  webSockets() {
    console.log('init webSocket channel-messages');

    const echo = new Echo({
      broadcaster: 'pusher',
      key: '0e3fc37b93f50ec46388',
      cluster: 'sa1',
      forceTLS: true
    });

    echo
      .channel('channel-messages')
      .listen('MessagesEvent', async (resp: any) => {
        const user = await this.messageService.getCurrentUser();
        console.log('resp websocket', resp, user);
        if (resp.data && resp.data.id != user.id) {
          this.getMessages();
        }
      });
  }

  getMessages() {
    this.messageService.listingMessages().then((resp: any) => {
      this.messages = resp;
    });
  }

  async logout() {
    const result = await this.messageService.alertConfirm(
      'Deseja realmente sair ?'
    );
    if (result.isConfirmed) {
      this.store.dispatch(new Logout());
    }
  }
}
