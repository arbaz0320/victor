import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from 'src/app/services/crud.service';
import { MessageService } from 'src/app/services/message.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-signatories',
  templateUrl: './signatories.component.html',
  styleUrls: ['./signatories.component.scss'],
  providers: [CrudService],
})
export class SignatoriesComponent implements OnInit {
  @Input()
  contract_id: any;

  dataSource: any = { data: [] };
  loading = false;
  filters: any = { per_page: 10, page: 1 };

  types = [
    { id: 'parte', description: 'Parte' },
    { id: 'testemunha', description: 'Testemunha' },
    { id: 'fiador', description: 'Fiador' },
  ];

  dados: any = {};

  constructor(
    private modalCtrl: NgbModal,
    private service: CrudService,
    private messageService: MessageService,
    public tools: ToolsService
  ) {
    service.setPath('contract/signatories');
  }

  ngOnInit(): void {
    this.filters.contract_id = this.contract_id;
    this.getList();
  }

  async getList() {
    this.loading = true;
    await this.service
      .listing(this.filters)
      .then((res) => {
        this.dataSource = res;
      })
      .finally(() => (this.loading = false));
  }

  openForm(content: any, item = undefined) {
    const inputFile = <HTMLInputElement>document.getElementById('inputFile');
    if (inputFile) {
      inputFile.value = '';
    }

    if (item) {
      this.dados = Object.assign({}, item);
    } else {
      this.dados = { contract_id: this.contract_id };
    }
    this.modalCtrl.open(content, { size: 'md', backdrop: 'static' });
  }

  submit(content: NgbActiveModal, form: NgForm) {
    if (!form.valid) {
      return;
    }

    if (this.dados.id) {
      this.update(content, form.value);
    } else {
      this.create(content, form.value);
    }
  }

  create(content: NgbActiveModal, dados: any) {
    this.loading = true;
    this.service
      .create(this.dados)
      .then(async (res) => {
        this.dados = {};
        content.close(res);
        await this.getList();
      })
      .finally(() => (this.loading = false));
  }

  update(content: NgbActiveModal, dados: any) {
    this.loading = true;
    this.service
      .update(this.dados, this.dados.id)
      .then(async (res) => {
        this.dados = {};
        content.close(res);
        await this.getList();
      })
      .finally(() => (this.loading = false));
  }

  async deleteQuestion(item: any) {
    const result = await this.messageService.alertConfirm(
      `Deseja excluir o signatário: <b>${item.id}</b> ? `
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

  getType(type: any) {
    const find = this.types.find((t) => t.id == type);
    return find?.description;
  }
}
