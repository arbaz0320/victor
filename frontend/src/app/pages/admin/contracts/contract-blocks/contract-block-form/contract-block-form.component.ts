import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { Editor } from 'ngx-editor';
import { CrudService } from 'src/app/services/crud.service';
import { MessageService } from 'src/app/services/message.service';
import { ToolsService } from 'src/app/services/tools.service';
import { ContractConditionalFormComponent } from '../../contract-conditionals/contract-conditional-form/contract-conditional-form.component';
import { ContractFieldFormComponent } from '../../contract-fields/contract-field-form/contract-field-form.component';
import { ContractService } from '../../contract.service';

@Component({
  selector: 'app-contract-block-form',
  templateUrl: './contract-block-form.component.html',
  styleUrls: ['./contract-block-form.component.scss'],
  providers: [CrudService],
})
export class ContractBlockFormComponent implements OnInit {
  dados: any = { conditionals: [], conditionalsRemove: [], modo: 'normal' };
  loading = false;

  fieldSelected: any = null;
  fields: any[] = [];
  // editor: Editor = new Editor();

  @Input() data: any;
  @Input() conditionals: any = {};

  constructor(
    private modalCtrl: NgbModal,
    public tools: ToolsService,
    private service: CrudService,
    private contractService: ContractService,
    private activeModal: NgbActiveModal,
    private messageService: MessageService
  ) {
    service.setPath('contract-block');
  }

  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.getDados(this.data.id);
    } else {
      this.getFields();
    }
  }

  closeModal(params: any = undefined) {
    this.activeModal.close(params);
  }

  async getDados(id: any) {
    this.loading = true;
    await this.service
      .show(id)
      .then(async (res) => {
        await this.getFields();
        this.dados = res;
        this.setFieldSelect(this.dados.field_id);
      })
      .finally(() => (this.loading = false));
  }

  async getFields() {
    this.loading = true;
    await this.contractService
      .listingFields({})
      .then((res) => {
        this.fields = res;
      })
      .finally(() => (this.loading = false));
  }

  submit(form: NgForm) {
    if (!form.valid) {
      return;
    }

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

  addField() {
    const modalRef = this.modalCtrl.open(ContractFieldFormComponent, {
      size: 'md',
      animation: true,
      backdrop: 'static',
    });

    modalRef.result.then((res) => {
      if (res) {
        this.getFields();
      }
    });
  }

  setField(field: any) {
    // console.log('setField', field, this.dados);
    this.dados.text = `${this.dados.text} <span>{{$${field.slug}}}</span>`;
  }

  openConditional(item: any = undefined, index: any = undefined) {
    const modalRef = this.modalCtrl.open(ContractConditionalFormComponent, {
      size: 'xl',
      animation: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.data = item;

    item !== undefined
      && this.conditionals[index] !== undefined
      && (modalRef.componentInstance.fields = this.conditionals[index].fields_in_conditional);

    modalRef.result.then((res) => {
      if (res) {
        if (index >= 0) {
          this.dados.conditionals[index] = Object.assign({}, res);
        } else {
          this.dados.conditionals.push(res);
        }
      }
    });
  }

  async deleteQuestion(item: any, index: number) {
    const result = await this.messageService.alertConfirm(
      `Deseja excluir a condicional: <b>${item.label}</b> ? `
    );

    if (result.isConfirmed) {
      this.delete(item, index);
    }
  }

  delete(item: any, index: number) {
    if (!item.id) {
      this.dados.conditionals.splice(index, 1);
      return;
    }
    this.loading = true;
    this.contractService
      .deleteConditional(item.id)
      .then(async (res) => {
        await this.getDados(this.dados.id);
      })
      .finally(() => (this.loading = false));
  }

  setFieldSelected(event: any) {
    const value = event.target.value;
    this.setFieldSelect(value);
  }
  setFieldSelect(value: any) {
    const find = this.fields.find((field) => field.id == value);
    if (find) {
      this.fieldSelected = find;
    }
  }
}
