import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from 'src/app/services/crud.service';
import { MessageService } from 'src/app/services/message.service';
import { FaqFormComponent } from './faq-form/faq-form.component';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  providers: [CrudService],
})
export class FaqComponent implements OnInit {
  dataSource: any = { data: [] };
  filters: any = { page: 1, per_page: 10 };
  loading = false;

  constructor(
    private service: CrudService,
    private messageService: MessageService,
    private modalCtrl: NgbModal
  ) {
    service.setPath('faq');
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
      `Deseja excluir o faq: <b>${item.question}</b> ? `
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

  openFaq(item = undefined) {
    const modalRef = this.modalCtrl.open(FaqFormComponent, {
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
