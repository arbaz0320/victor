import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { Editor } from 'ngx-editor';
import { CrudService } from 'src/app/services/crud.service';
import { MessageService } from 'src/app/services/message.service';
import { ToolsService } from 'src/app/services/tools.service';
import { EditorComponent } from 'src/app/shared/editor/editor.component';
import { ContractService } from '../../contract.service';

@Component({
  selector: 'app-contract-conditional-form',
  templateUrl: './contract-conditional-form.component.html',
  styleUrls: ['./contract-conditional-form.component.scss'],
  providers: [CrudService],
})
export class ContractConditionalFormComponent implements OnInit {
  dados: any = { text: '' };
  loading = false;

  @ViewChild('editor') editor: EditorComponent | undefined;

  @Input() data: any;
  @Input() fields: any = {};

  constructor(
    private modalCtrl: NgbModal,
    public tools: ToolsService,
    private service: CrudService,
    private contractService: ContractService,
    private activeModal: NgbActiveModal,
    private messageService: MessageService
  ) {
    service.setPath('contract-conditional');
  }

  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.getDados(this.data.id);
    } else {
      if (this.data) {
        this.dados = Object.assign({}, this.data);
      }
    }
  }

  closeModal(params: any = undefined) {
    this.activeModal.close(params);
  }

  getDados(id: any) {
    this.loading = true;
    this.service
      .show(id)
      .then(async (res) => {
        this.dados = res;
      })
      .finally(() => (this.loading = false));
  }

  submit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.closeModal(this.dados);
    return;
    if (this.dados.id) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.loading = true;
    this.service
      .create(this.dados)
      .then((res) => {
        if (!res.error) {
          this.closeModal(res);
        }
      })
      .finally(() => (this.loading = false));
  }

  update() {
    this.loading = true;
    this.service
      .update(this.dados, this.dados.id)
      .then((res) => {
        if (!res.error) {
          this.closeModal(res);
        }
      })
      .finally(() => (this.loading = false));
  }

  setField(field: any) {
    this.editor?.appendText(`{{$${field.slug}}}`);
    // this.dados.text = `${this.dados.text} <span>{{$${field.slug}}}</span>`;
  }
}
