import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from 'src/app/services/crud.service';
import { MessageService } from 'src/app/services/message.service';
import { ContratTypesComponent } from './contrat-types/contrat-types.component';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
  providers: [CrudService],
})
export class ContractsComponent implements OnInit {
  dataSource: any = { data: [] };
  filters: any = { page: 1, per_page: 10 };
  loading = false;

  constructor(
    private service: CrudService,
    private messageService: MessageService,
    private modalCtrl: NgbModal
  ) {
    service.setPath('contract');
  }

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.loading = true;
    this.service
      .listing(this.filters)
      .then((res) => {
        this.dataSource = res.data;
      })
      .finally(() => (this.loading = false));
  }

  async deleteQuestion(item: any) {
    const result = await this.messageService.alertConfirm(
      `Deseja excluir o contrato: <b>${item.title}</b> ? `
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

  openTypeContractsList() {
    const modalRef = this.modalCtrl.open(ContratTypesComponent, {
      size: 'md',
      backdrop: 'static',
    });
  }
}
