import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from 'src/app/services/crud.service';
import { MessageService } from 'src/app/services/message.service';
import { ContractTypeFormComponent } from './contract-type-form/contract-type-form.component';

@Component({
  selector: 'app-contrat-types',
  templateUrl: './contrat-types.component.html',
  styleUrls: ['./contrat-types.component.scss'],
  providers: [CrudService],
})
export class ContratTypesComponent implements OnInit {
  dataSource: any = { data: [] };
  loading = false;
  filters: any = { per_page: 10, page: 1 };

  @Input() data: any;

  constructor(
    private modalCtrl: NgbModal,
    private activeModal: NgbActiveModal,
    private messageService: MessageService,
    private service: CrudService
  ) {
    service.setPath('contract-type');
  }

  ngOnInit(): void {
    this.getList();
  }

  closeModal(params: any = undefined) {
    this.activeModal.close(params);
  }

  getList() {
    this.loading = true;
    this.service
      .listing(this.filters)
      .then((res) => {
        this.dataSource = res;
      })
      .finally(() => (this.loading = false));
  }

  openForm(item = undefined) {
    const modalRef = this.modalCtrl.open(ContractTypeFormComponent, {
      size: 'sm',
      animation: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.data = item;
    modalRef.result.then((res) => {
      if (res) {
        this.getList();
      }
    });
  }

  async deleteQuestion(item: any) {
    const result = await this.messageService.alertConfirm(
      `Deseja excluir o tipo: <b>${item.title}</b> ? `
    );

    if (result.isConfirmed) {
      this.delete(item);
    }
  }

  delete(item: any) {
    this.loading = true;
    this.service
      .delete(item.id)
      .then(async (res) => {
        await this.getList();
      })
      .finally(() => (this.loading = false));
  }
}
