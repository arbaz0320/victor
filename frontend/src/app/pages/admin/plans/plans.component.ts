import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from 'src/app/services/crud.service';
import { MessageService } from 'src/app/services/message.service';
import { PlanFormComponent } from './plan-form/plan-form.component';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
  providers: [CrudService],
})
export class PlansComponent implements OnInit {
  dataSource: any = { data: [] };
  filters: any = { page: 1, per_page: 10 };
  loading = false;

  constructor(
    private service: CrudService,
    private messageService: MessageService,
    private modalCtrl: NgbModal
  ) {
    service.setPath('plan');
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
      `Deseja excluir o plano: <b>${item.name}</b> ? `
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

  openForm(item = undefined) {
    const modalRef = this.modalCtrl.open(PlanFormComponent, {
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
