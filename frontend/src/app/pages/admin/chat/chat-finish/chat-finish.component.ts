import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chat-finish',
  templateUrl: './chat-finish.component.html',
  styleUrls: ['./chat-finish.component.scss'],
})
export class ChatFinishComponent implements OnInit {
  dados: any = {};
  loading = false;

  fields: any[] = [];
  fieldSelected: any = null;

  @Input() data: any;

  constructor(
    // public tools: ToolsService,
    // private service: CrudService,
    private activeModal: NgbActiveModal // private contractService: ContractService, // private massageService: MessageService
  ) {
    // service.setPath('fields-block');
  }

  ngOnInit(): void {}

  closeModal(params: any = undefined) {
    this.activeModal.close(params);
  }

  submit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.closeModal(this.dados);
  }
}
