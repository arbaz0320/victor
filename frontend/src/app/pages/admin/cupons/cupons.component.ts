import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from 'src/app/services/crud.service';
import { MessageService } from 'src/app/services/message.service';
import { CupomFormComponent } from './cupom-form/cupom-form.component';

@Component({
  selector: 'app-cupons',
  templateUrl: './cupons.component.html',
  styleUrls: ['./cupons.component.scss'],
  providers: [CrudService],
})
export class CuponsComponent implements OnInit {
  dataSource: any = { data: [] };
  filters: any = { page: 1, per_page: 10 };
  loading = false;

  constructor(
    private service: CrudService,
    private messageService: MessageService,
    private modalCtrl: NgbModal
  ) {
    service.setPath('coupon');
  }

  ngOnInit(): void {
    this.getList();
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

  async deleteQuestion(item: any) {
    const result = await this.messageService.alertConfirm(
      `Deseja excluir o cupom: <b>${item.title}</b> ? `
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

  openCupom(item = undefined) {
    const modalRef = this.modalCtrl.open(CupomFormComponent, {
      size: 'md',
      backdrop: 'static',
    });
    modalRef.componentInstance.data = item;
    modalRef.result.then((res) => {
      if (res) {
        this.getList();
      }
    });
  }
}
