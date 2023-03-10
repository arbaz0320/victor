import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContractFieldFormComponent } from 'src/app/pages/admin/contracts/contract-fields/contract-field-form/contract-field-form.component';
import { ContractService } from 'src/app/pages/admin/contracts/contract.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss'],
})
export class FieldsComponent implements OnInit {
  @Input()
  block_or_fields: any;

  loading = false;
  filterFields: any = { limite: 10 };
  fields: any[] = [];
  someFields: any[] = [];

  @Output()
  changeField: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private modalCtrl: NgbModal,
    private contractService: ContractService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getFields().then(
      () => {
        if (this.block_or_fields && typeof this.block_or_fields == 'object') {
          Object.keys(this.block_or_fields).forEach((index) => {
            const item = Object.assign({}, this.block_or_fields[index]);
            if (item.type != 'block' && index.indexOf('signature') === -1) {
              this.someFields.push(item);
            }
          });
        }
      }
    );
  }

  async getFields() {
    this.loading = true;
    return this.contractService
      .listingFields(this.filterFields)
      .then((res) => {
        this.fields = res;
      })
      .finally(() => (this.loading = false));
  }

  openField(item = undefined) {
    const modalRef = this.modalCtrl.open(ContractFieldFormComponent, {
      size: 'md',
      animation: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.data = item;
    modalRef.result.then((res) => {
      if (res) {
        this.getFields();
      }
    });
  }

  setField(event: any) {
    this.changeField.emit(event);
  }

  async deleteFieldQuestion(item: any) {
    const result = await this.messageService.alertConfirm(
      `Deseja excluir o contrato: <b>${item.title}</b> ? `
    );

    if (result.isConfirmed) {
      this.delField(item);
    }
  }
  delField(item: any) {
    this.loading = true;
    this.contractService
      .deleteField(item.id)
      .then(async (res) => {
        await this.getFields();
      })
      .finally(() => (this.loading = false));
  }
}
