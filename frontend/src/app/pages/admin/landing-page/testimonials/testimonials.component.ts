import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from 'src/app/services/crud.service';
import { MessageService } from 'src/app/services/message.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
  providers: [CrudService],
})
export class TestimonialsComponent implements OnInit {
  dataSource: any = { data: [] };
  loading = false;
  filters: any = { per_page: 10, page: 1 };

  dados: any = {};
  file: File | undefined;

  constructor(
    private modalCtrl: NgbModal,
    // private activeModal: NgbActiveModal,
    private service: CrudService,
    private messageService: MessageService,
    public tools: ToolsService
  ) {
    service.setPath('deposition');
  }

  ngOnInit(): void {
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

  openBloco(content: any, item = undefined) {
    const inputFile = document.getElementById('inputFile');
    if (inputFile) {
      inputFile.nodeValue = '';
    }

    if (item) {
      this.dados = Object.assign({}, item);
    } else {
      this.dados = {};
    }
    this.modalCtrl.open(content, { size: 'md', backdrop: 'static' });
  }

  submit(content: NgbActiveModal, form: NgForm) {
    if (!form.valid) {
      return;
    }

    if (this.dados.id) {
      this.update(content);
    } else {
      this.create(content);
    }
  }

  changeAvatar(target: any) {
    this.file = target.files[0];
    if (!this.checkImage()) {
      this.messageService.toastError(
        'Limite de 2mb para a imagem.',
        'Tamanho excedido'
      );
      this.file = undefined;
      const inputFile = <HTMLInputElement>document.getElementById('inputFile');
      if (inputFile) {
        inputFile.value = '';
      }
    }
  }

  checkImage() {
    if (this.file && this.file.size / 1024 > 2024) {
      return false;
    }
    return true;
  }

  getFormData() {
    let formData = new FormData();
    Object.keys(this.dados).forEach((data) => {
      formData.append(data, this.dados[data]);
    });
    if (this.file) {
      formData.append('image', this.file);
    }

    return formData;
  }

  create(content: NgbActiveModal) {
    this.loading = true;
    this.service
      .create(this.getFormData())
      .then(async (res) => {
        this.dados = {};
        content.close(res);
        await this.getList();
      })
      .finally(() => (this.loading = false));
  }

  update(content: NgbActiveModal) {
    this.loading = true;
    this.service
      .update(this.getFormData(), this.dados.id)
      .then(async (res) => {
        this.dados = {};
        content.close(res);
        await this.getList();
      })
      .finally(() => (this.loading = false));
  }

  async deleteQuestion(item: any) {
    const result = await this.messageService.alertConfirm(
      `Deseja excluir o depoimento: <b>${item.id}</b> ? `
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
