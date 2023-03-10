import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from 'src/app/services/crud.service';
import { MessageService } from 'src/app/services/message.service';
import { ToolsService } from 'src/app/services/tools.service';
import { ContractService } from '../../contract.service';

@Component({
  selector: 'app-contract-field-form',
  templateUrl: './contract-field-form.component.html',
  styleUrls: ['./contract-field-form.component.scss'],
  providers: [CrudService],
})
export class ContractFieldFormComponent implements OnInit {
  dados: any = { options: [], status: 1, field_id: '' };
  loading = false;

  fields: any[] = [];
  fieldSelected: any = null;

  @Input() data: any;

  constructor(
    public tools: ToolsService,
    private service: CrudService,
    private activeModal: NgbActiveModal,
    private contractService: ContractService,
    private massageService: MessageService
  ) {
    service.setPath('fields-block');
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

  getDados(id: any) {
    this.loading = true;
    this.service
      .show(id)
      .then(async (res) => {
        this.dados = res;
        await this.getFields();
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

  async openAdd() {
    this.massageService.swal
      .fire({
        title: 'Nova Opção',
        html: 'para inserir múltiplas opções, separe por vírgula',
        input: 'textarea',
        inputAttributes: {
          rows: '5',
          placeholder: 'Ex: opção 1, opção 2',
        },
      })
      .then((res) => {
        if (res.isConfirmed && res.value) {
          const options: any[] = res.value.split(',');
          options.forEach((option) => {
            this.dados.options.push({ label: option });
          });
        }
      });
  }

  removeOption(index: number) {
    const option = this.dados.options[index];
    if (this.dados.optionsRemove && Array.isArray(this.dados.optionsRemove)) {
      this.dados.optionsRemove.push(option);
    } else {
      this.dados.optionsRemove = [option];
    }
    this.dados.options.splice(index, 1);
  }

  setFieldSelected() {
    // const value = event.target.value;
    if (!this.dados.field_id) {
      return false;
    }
    const value = this.dados.field_id;
    const find = this.fields.find((field) => field.id == value);
    if (find) {
      return find;
    }
    return false;
  }
}
