import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from 'src/app/services/crud.service';
import { MessageService } from 'src/app/services/message.service';
import { ContractBlockFormComponent } from './contract-block-form/contract-block-form.component';

@Component({
  selector: 'app-contract-blocks',
  templateUrl: './contract-blocks.component.html',
  styleUrls: ['./contract-blocks.component.scss'],
  providers: [CrudService],
})
export class ContractBlocksComponent implements OnInit {
  dataSource: any = { data: [] };
  dataSourceSomeBlocks: any[] = [];
  loading = false;
  filters: any = { per_page: 10, page: 1 };

  @Input() data: any;
  @Input() block_or_fields: any = {};

  constructor(
    private modalCtrl: NgbModal,
    private activeModal: NgbActiveModal,
    private service: CrudService,
    private messageService: MessageService
  ) {
    service.setPath('contract-block');
  }

  ngOnInit(): void {
    if (this.block_or_fields && typeof this.block_or_fields == 'object') {
      Object.keys(this.block_or_fields).forEach((index) => {
        const item = Object.assign({}, this.block_or_fields[index]);
        console.log('item', item);
        if (item.type == 'block') {
          this.dataSourceSomeBlocks.push(item);
        }
      });
    }
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

  openBloco(item: any = undefined) {
    const modalRef = this.modalCtrl.open(ContractBlockFormComponent, {
      size: 'md',
      animation: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.data = item;

    item !== undefined
      && this.block_or_fields[item.slug] !== undefined
      && (modalRef.componentInstance.conditionals = this.block_or_fields[item.slug].conditionals);

    modalRef.result.then((res) => {
      if (res) {
        this.getList();
        // this.dados.type_id = res.data.id;
      }
    });
  }

  async deleteQuestion(item: any) {
    const result = await this.messageService.alertConfirm(
      `Deseja excluir o bloco: <b>${item.title}</b> ? `
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
