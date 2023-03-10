import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from 'src/app/services/crud.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.scss'],
  providers: [CrudService],
})
export class PlanFormComponent implements OnInit {
  dados: any = { status: 1 };
  loading = false;

  @Input() data: any;

  constructor(
    public tools: ToolsService,
    private service: CrudService,
    private activeModal: NgbActiveModal
  ) {
    service.setPath('plan');
  }

  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.getDados(this.data.id);
    }
  }

  closeModal(params: any = undefined) {
    this.activeModal.close(params);
  }

  getDados(id: any) {
    this.loading = true;
    this.service
      .show(id)
      .then((res) => {
        this.dados = res.data;
      })
      .finally(() => (this.loading = false));
  }

  submit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    if (this.dados.id) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.loading = true;
    this.service
      .create(this.dados)
      .then((res) => {
        if (!res.error) {
          this.closeModal(res);
        }
      })
      .finally(() => (this.loading = false));
  }

  update() {
    this.loading = true;
    this.service
      .update(this.dados, this.dados.id)
      .then((res) => {
        if (!res.error) {
          this.closeModal(res);
        }
      })
      .finally(() => (this.loading = false));
  }
}
