import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'src/app/services/message.service';
import { ChatFinishComponent } from '../chat-finish/chat-finish.component';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss'],
})
export class ChatFormComponent implements OnInit {
  dados = { messageText: '' };
  @Input() loading = false;
  @Input() status = 1;
  @Input() message: any = {};

  @Output() sendMessage: EventEmitter<any> = new EventEmitter<any>();

  constructor(private modalCtrl: NgbModal) {}

  ngOnInit() {}

  send(event: any) {
    let data: any = { status_default: 1, message: this.dados.messageText };
    if (event.pergunta && event.resposta) {
      data.status_default = 10;
      data.pergunta = event.pergunta;
      data.resposta = event.resposta;
    }
    this.dados.messageText = '';
    this.sendMessage.emit(data);
  }

  makeQuestions() {
    const modalRef = this.modalCtrl.open(ChatFinishComponent, {
      size: 'lg',
      backdrop: 'static',
    });
    modalRef.componentInstance.data = this.message;
    modalRef.result.then((res) => {
      if (res) {
        this.send(res);
      }
    });
  }
}
