import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from 'src/app/services/crud.service';
import { ContractConditionalFormComponent } from './contract-conditional-form/contract-conditional-form.component';

@Component({
  selector: 'app-contract-conditionals',
  templateUrl: './contract-conditionals.component.html',
  styleUrls: ['./contract-conditionals.component.scss'],
  providers: [CrudService],
})
export class ContractConditionalsComponent implements OnInit {
  dataSource: any = { data: [] };
  loading = false;
  filters: any = { per_page: 10, page: 1 };


  @Input() data: any;

  constructor(
    private modalCtrl: NgbModal,
    private activeModal: NgbActiveModal,
    private service: CrudService
  ) {
    service.setPath('contract-conditional');
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
    const modalRef = this.modalCtrl.open(ContractConditionalFormComponent, {
      size: 'lg',
      animation: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.data = item;
    modalRef.result.then((res) => {
      if (res) {
        this.closeModal(res);
      }
    });
  }
}
